import type { iDownloadRequest } from "@/schemas/downloadRequest";
import { _startDownload, getIsDownloading, isConnected, setIsDownloading } from "./io";
import { readingsHeader, type iReadings } from "@/schemas/readings";
import * as fs from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { iDownloadProgress } from "@/schemas/downloadProgress";
import {
    DownloadError,
    DownloadErrorEnum,
    errorHandler,
    IOError,
    IOErrorEnum,
} from "./errorHandler";

function encode(str: string): Uint8Array {
    return new TextEncoder().encode(str);
}

function formatReadings(readings: iReadings[]): Uint8Array {
    return encode(
        readings
            .map((reading: iReadings) => {
                let outStr = "";
                for (let i = 0; i < readingsHeader.length; i++) {
                    outStr += reading[readingsHeader[i]!];
                    if (i < readingsHeader.length - 1) {
                        outStr += ";";
                    }
                }
                return outStr;
            })
            .join("\n") + "\n"
    );
}

function synthesizeFilename(downloadId: string, nonce: number = 0) {
    if (nonce === 0) {
        return `reports-${downloadId}.csv`;
    }
    return `reports-${downloadId}-${nonce}.csv`;
}

export async function downloadReports(
    downloadRequest: iDownloadRequest,
    _resume: boolean = false,
    _forcePick: boolean = false,
    mergeFailHandler: (err: Error) => void = errorHandler
): Promise<undefined | Error> {
    if (!isConnected()) {
        return new IOError(IOErrorEnum.NotConnected);
    }
    const _progress = await AsyncStorage.getItem("download-progress");
    let progress: null | iDownloadProgress = _progress === null ? null : JSON.parse(_progress!);

    if (progress !== null && !_resume) {
        return new DownloadError(DownloadErrorEnum.UnfinishedDownload, {
            downloadId: progress.downloadId,
        });
    }

    console.log("Starting Download!");

    let dirUri = "";
    if (progress === null) {
        try {
            dirUri = (await fs.Directory.pickDirectoryAsync())!.uri;
        } catch {
            return new DownloadError(DownloadErrorEnum.CancelPicking);
        }

        progress = {
            downloadId: downloadRequest.downloadId,
            to: downloadRequest.to,
            nonce: 0,
            lastWritten: new Date(new Date(downloadRequest.from).getTime() - 1).toISOString(),
            dirUri: dirUri,
        };
    } else if (_forcePick) {
        try {
            dirUri = (await fs.Directory.pickDirectoryAsync(progress.dirUri))!.uri;
        } catch {
            return new DownloadError(DownloadErrorEnum.CancelPicking);
        }

        if (dirUri !== progress.dirUri) {
            return new DownloadError(DownloadErrorEnum.NoPermission, { path: progress.dirUri });
        }
    } else {
        dirUri = progress.dirUri;
    }
    let outFile, wStream;
    try {
        outFile = new fs.File(
            dirUri,
            synthesizeFilename(downloadRequest.downloadId, progress.nonce + 1)
        );
        outFile.create({ overwrite: true });
        wStream = outFile.writableStream();
    } catch {
        return new DownloadError(DownloadErrorEnum.NoPermission, { path: progress.dirUri });
    }
    const writer = wStream.getWriter();
    if (progress.nonce === 0) {
        writer.write(encode(readingsHeader.join(";") + "\n"));
    }
    setIsDownloading(true);
    return _startDownload(
        downloadRequest,
        async (readings: iReadings[]) => {
            await writer.write(formatReadings(readings));
            const lastWritten = readings[readings.length - 1]!.timestamp;
            progress!.lastWritten = lastWritten;

            console.log(lastWritten);

            await AsyncStorage.setItem("download-progress", JSON.stringify(progress));
        },
        async (downloadId: string) => {
            console.log("Download for " + downloadId + " is finished!");

            await writer.close();
            setIsDownloading(false);
            const resp = await mergeDownloads(progress, dirUri);
            if (resp !== undefined) {
                mergeFailHandler(resp);
                return;
            }
            await AsyncStorage.removeItem("download-progress");
        }
    );
}

export async function resumeDownload(_forcePick: boolean = false, mergeFailHandler: (err: Error) => void = errorHandler): Promise<undefined | Error> {
    if (!isConnected()) {
        return new IOError(IOErrorEnum.NotConnected);
    }
    if (getIsDownloading() === true) {
        return new DownloadError(DownloadErrorEnum.DownloadInProgress);
    }
    const _progress = await AsyncStorage.getItem("download-progress");
    if (_progress === null) {
        return new DownloadError(DownloadErrorEnum.NoUnfinishedDownload);
    }
    const progress: iDownloadProgress = JSON.parse(_progress!);
    progress.nonce++;
    await AsyncStorage.setItem("download-progress", JSON.stringify(progress));
    const resp = await downloadReports(
        {
            to: progress.to,
            from: new Date(new Date(progress.lastWritten).getTime() + 1).toISOString(),
            downloadId: progress.downloadId,
        },
        true,
        _forcePick,
        mergeFailHandler
    );
    if (resp !== undefined) {
        progress.nonce--;
        await AsyncStorage.setItem("download-progress", JSON.stringify(progress));
        return resp;
    }
}

async function mergeDownloads(
    progress: iDownloadProgress,
    outDirUri: string
): Promise<undefined | Error> {
    const outFile = new fs.File(outDirUri, synthesizeFilename(progress.downloadId, 0));
    outFile.create({ overwrite: true });
    const wStream = outFile.writableStream();
    const writer = wStream.getWriter();

    // Merge loop
    for (let i = 0; i <= progress.nonce; i++) {
        try {
            const nowFile = new fs.File(outDirUri, synthesizeFilename(progress.downloadId, i + 1));
            const rStream = nowFile.readableStream();
            const reader = rStream.getReader();
            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    break;
                }
                await writer.write(value);
            }
            await reader.cancel();
        } catch {
            return new DownloadError(DownloadErrorEnum.NotFound, {
                path: `${outDirUri}/${synthesizeFilename(progress.downloadId, i + 1)}`,
            });
        }
    }

    // Delete loop
    for (let i = 0; i <= progress.nonce; i++) {
        try {
            new fs.File(outDirUri, synthesizeFilename(progress.downloadId, i + 1)).delete();
        } catch {
            return new DownloadError(DownloadErrorEnum.NotFound, {
                path: `${outDirUri}/${synthesizeFilename(progress.downloadId, i + 1)}`,
            });
        }
    }

    await writer.close();

    console.log("Finish Merging!");
}

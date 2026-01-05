import type { iDownloadRequest } from "@/schemas/downloadRequest";
import {
    _startDownload,
    getIsDownloading,
    isConnected,
    setIsDownloading,
    setShouldContinue,
} from "./io";
import { readingsHeader, type iReadings } from "@/schemas/readings";
import * as fs from "expo-file-system";
import * as fsLegacy from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { iDownloadProgress } from "@/schemas/downloadProgress";
import {
    DownloadError,
    DownloadErrorEnum,
    errorHandler,
    IOError,
    IOErrorEnum,
} from "./errorHandler";
import { MAX_DOWNLOAD_ID_LENGTH, PROGRESS_SCALING_FACTOR } from "./constants";
import { toastInfo, toastSuccess } from "@/src/components/ToastStack";
import { linearMap, round } from "./utils";
import { Platform } from "react-native";

export async function checkUnfinishedProgress() {
    const progress = await AsyncStorage.getItem("download-progress");
    if (progress === null) {
        return null;
    }
    const { lastWritten, from, to } = JSON.parse(progress) as iDownloadProgress;
    return linearMap(
        round(new Date(lastWritten).getTime() / PROGRESS_SCALING_FACTOR, 0),
        round(new Date(from).getTime() / PROGRESS_SCALING_FACTOR, 0),
        round(new Date(to).getTime() / PROGRESS_SCALING_FACTOR, 0),
        0,
        100
    );
}

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

async function getDirPermission(initialUri?: string): Promise<string> {
    let outUri = "";
    if (Platform.OS === "android") {
        const permissions =
            await fsLegacy.StorageAccessFramework.requestDirectoryPermissionsAsync(initialUri);
        if (!permissions.granted) {
            throw new DownloadError(DownloadErrorEnum.CancelPicking);
        }
        outUri = permissions.directoryUri;
    } else {
        outUri = (await fs.Directory.pickDirectoryAsync(initialUri)).uri;
    }

    return outUri;
}

async function createFile(dirUri: string, filename: string): Promise<fs.File> {
    if (Platform.OS === "android") {
        dirUri = fsLegacy.documentDirectory!;
    }

    const outFile = new fs.File(dirUri, filename);
    outFile.create({ overwrite: true });
    return outFile;
}

async function getFile(dirUri: string, filename: string): Promise<fs.File> {
    if (Platform.OS === "android") {
        dirUri = fsLegacy.documentDirectory!;
    }
    return new fs.File(dirUri, filename);
}

async function moveOutFile(outFile: fs.File, dirUri: string) {
    if (Platform.OS === "android") {
        const fileUri = await fsLegacy.StorageAccessFramework.createFileAsync(
            dirUri,
            outFile.name,
            "text/csv"
        );
        await fsLegacy.writeAsStringAsync(fileUri, await outFile.text());
    }
}

/**
 * @description Download Reports
 * @param downloadRequest DownloadRequest data
 * @param mergeFailHandler Handler when merge fails
 * @param {boolean} _resume Resume the unfinished download (Should not be set by FE)
 * @param {boolean} _forcePick Force the file picker to open (Should not be set by FE)
 * @returns {Promise<undefined | Error>}
 */
export async function downloadReports(
    downloadRequest: iDownloadRequest,
    progressHandler: (percent: number | null) => void,
    _resume: boolean = false,
    _forcePick: boolean = false,
    mergeFailHandler: (err: Error) => void = errorHandler
): Promise<undefined | Error> {
    if (downloadRequest.downloadId.length > MAX_DOWNLOAD_ID_LENGTH) {
        return new DownloadError(DownloadErrorEnum.InvalidName);
    }
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

    let dirUri = "";
    if (progress === null) {
        try {
            dirUri = await getDirPermission();
        } catch {
            return new DownloadError(DownloadErrorEnum.CancelPicking);
        }

        progress = {
            downloadId: downloadRequest.downloadId,
            from: downloadRequest.from,
            to: downloadRequest.to,
            nonce: 0,
            lastWritten: new Date(new Date(downloadRequest.from).getTime() - 1).toISOString(),
            dirUri: dirUri,
        };
    } else if (_forcePick) {
        try {
            dirUri = await getDirPermission(progress.dirUri);
        } catch {
            return new DownloadError(DownloadErrorEnum.CancelPicking);
        }

        if (dirUri !== progress.dirUri) {
            return new DownloadError(DownloadErrorEnum.DifferentFolder, { path: progress.dirUri });
        }
    } else {
        dirUri = progress.dirUri;
    }
    let outFile: fs.File, wStream;
    try {
        outFile = await createFile(
            dirUri,
            synthesizeFilename(downloadRequest.downloadId, progress.nonce + 1)
        );
        wStream = outFile.writableStream();
    } catch {
        return new DownloadError(DownloadErrorEnum.NoPermission, { path: progress.dirUri });
    }
    const writer = wStream.getWriter();
    if (progress.nonce === 0) {
        writer.write(encode(readingsHeader.join(";") + "\n"));
    }
    setIsDownloading(true);
    toastInfo({ message: "Starting Download!" });

    const startTime = round(new Date(progress.from).getTime() / PROGRESS_SCALING_FACTOR, 0);
    const endTime = round(new Date(progress.to).getTime() / PROGRESS_SCALING_FACTOR, 0);

    setShouldContinue(true);
    return _startDownload(
        downloadRequest,
        async (readings: iReadings[]) => {
            setIsDownloading(true);
            await writer.write(formatReadings(readings));
            const lastWritten = readings[readings.length - 1]!.timestamp;
            progress!.lastWritten = lastWritten;

            await AsyncStorage.setItem("download-progress", JSON.stringify(progress));
            progressHandler(
                linearMap(
                    round(new Date(lastWritten).getTime() / PROGRESS_SCALING_FACTOR, 0),
                    startTime,
                    endTime,
                    0,
                    100
                )
            );
        },
        async (downloadId: string) => {
            toastSuccess({ message: "Download is finished!" });
            await writer.close();
            setIsDownloading(false);
            const resp = await mergeDownloads(progress, dirUri);
            if (resp !== undefined) {
                mergeFailHandler(resp);
                return;
            }
            await AsyncStorage.removeItem("download-progress");
            progressHandler(null);
        }
    );
}

/**
 * @description Resume unfinished downlaods, throw if there isn't any
 * @param {boolean} _forcePick Force to open file picker (should be supplied IFF permission error)
 * @param mergeFailHandler Passed to downloadReports (defailt to be errorHandler)
 * @returns {Promise<Error | undefined>}
 */
export async function resumeDownload(
    progressHandler: (progress: number | null) => void,
    _forcePick: boolean = false,
    mergeFailHandler: (err: Error) => void = errorHandler
): Promise<undefined | Error> {
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
    toastInfo({ message: "Resuming Download!" });
    const resp = await downloadReports(
        {
            to: progress.to,
            from: new Date(new Date(progress.lastWritten).getTime() + 1).toISOString(),
            downloadId: progress.downloadId,
        },
        progressHandler,
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
    const outFile = await createFile(outDirUri, synthesizeFilename(progress.downloadId, 0));
    const wStream = outFile.writableStream();
    const writer = wStream.getWriter();

    // Merge loop
    for (let i = 0; i <= progress.nonce; i++) {
        try {
            const nowFile = await getFile(
                outDirUri,
                synthesizeFilename(progress.downloadId, i + 1)
            );
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
            (await getFile(outDirUri, synthesizeFilename(progress.downloadId, i + 1))).delete();
        } catch {
            return new DownloadError(DownloadErrorEnum.NotFound, {
                path: `${outDirUri}/${synthesizeFilename(progress.downloadId, i + 1)}`,
            });
        }
    }

    await writer.close();
    await moveOutFile(outFile, outDirUri);

    toastSuccess({ message: "Finish Merging!" });
}

export async function cancelDownloads() {
    setShouldContinue(false);
    const _progress = await AsyncStorage.getItem("download-progress");
    setIsDownloading(false);
    await AsyncStorage.removeItem("download-progress");
    if (_progress === null) {
        return new DownloadError(DownloadErrorEnum.NoUnfinishedDownload);
    }
}

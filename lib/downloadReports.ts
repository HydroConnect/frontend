import type { iDownloadRequest } from "@/schemas/downloadRequest";
import { _startDownload, getIsDownloading, isConnected, setIsDownloading } from "./io";
import { readingsHeader, type iReadings } from "@/schemas/readings";
import * as fs from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { iDownloadProgress } from "@/schemas/downloadProgress";

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
    _resume: boolean = false
): Promise<null | string> {
    if (!isConnected()) {
        // TODO: Make this a throw
        console.log("Socket not Connected!");
        return null;
    }
    const _progress = await AsyncStorage.getItem("download-progress");
    let progress: null | iDownloadProgress = _progress === null ? null : JSON.parse(_progress!);

    if (progress !== null && !_resume) {
        console.log("There are unfinished job with id: " + progress.downloadId);
        return progress.downloadId;
    }

    console.log("Starting Download!");
    const outDir = await fs.Directory.pickDirectoryAsync(
        progress !== null ? progress.dirUri : undefined
    );
    if (progress === null) {
        progress = {
            downloadId: downloadRequest.downloadId,
            to: downloadRequest.to,
            nonce: 0,
            lastWritten: new Date(new Date(downloadRequest.from).getTime() - 1).toISOString(),
            dirUri: outDir.uri,
        };
    } else {
        if (outDir.uri !== progress.dirUri) {
            console.log(
                "Please select the same directory as your previous downloads!\n",
                progress.dirUri
            );
        }
    }

    const outFile = new fs.File(
        outDir.uri,
        synthesizeFilename(downloadRequest.downloadId, progress.nonce + 1)
    );
    outFile.create({ overwrite: true });
    const wStream = outFile.writableStream();
    const writer = wStream.getWriter();
    if (progress.nonce === 0) {
        writer.write(encode(readingsHeader.join(";") + "\n"));
    }
    setIsDownloading(true);
    _startDownload(
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
            await AsyncStorage.removeItem("download-progress");
            await mergeDownloads(progress, outDir.uri);
            setIsDownloading(false);
        }
    );

    return null;
}

export async function resumeDownload() {
    if (!isConnected()) {
        // TODO: Make this a throw
        console.log("Socket is not connected!");
        return;
    }
    if (getIsDownloading() === true) {
        console.log("Is still downloading!");
        return;
    }
    const _progress = await AsyncStorage.getItem("download-progress");
    if (_progress === null) {
        console.log("No Downloads to Resume!");
        return;
    }
    const progress: iDownloadProgress = JSON.parse(_progress!);
    progress.nonce++;
    await AsyncStorage.setItem("download-progress", JSON.stringify(progress));
    downloadReports(
        {
            to: progress.to,
            from: new Date(new Date(progress.lastWritten).getTime() + 1).toISOString(),
            downloadId: progress.downloadId,
        },
        true
    );
}

async function mergeDownloads(progress: iDownloadProgress, outDirUri: string) {
    const outFile = new fs.File(outDirUri, synthesizeFilename(progress.downloadId, 0));
    outFile.create({ overwrite: true });
    const wStream = outFile.writableStream();
    const writer = wStream.getWriter();

    // Merge loop
    for (let i = 0; i <= progress.nonce; i++) {
        const nowFile = new fs.File(outDirUri, synthesizeFilename(progress.downloadId, i + 1));
        const rStream = nowFile.readableStream();
        const reader = rStream.getReader();
        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    break;
                }
                await writer.write(value);
            }
            await reader.cancel();
        } catch (err) {
            console.log("Error in merging!\n--------\n\n", err);
        }
    }

    // Delete loop
    for (let i = 0; i <= progress.nonce; i++) {
        try {
            new fs.File(outDirUri, synthesizeFilename(progress.downloadId, i + 1)).delete();
        } catch (err) {
            console.log("Error in deleting!\n--------\n\n", err);
        }
    }

    await writer.close();
    console.log("Finish Merging!");
}

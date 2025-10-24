import { io, Socket } from "socket.io-client";
import { BACKEND_API_BASE_URL, BACKEND_API_IO_VERSION } from "./constants";
import type { iReadings } from "@/schemas/readings";
import type { iDownloadRequest } from "@/schemas/downloadRequest";

let socket: Socket | undefined = undefined;
let isDownloading = false;

export function getIsDownloading() {
    return isDownloading;
}
export function setIsDownloading(input: boolean) {
    isDownloading = input;
}

export function isConnected(): boolean {
    return socket !== undefined;
}

/**
 *
 * @param disconnectHandler Is suggested to handle changes in UI and to call connectAndListen() again
 * @param readingsHandler Is suggested to update the UI of the element
 */
export function connectAndListen(
    disconnectHandler: () => void,
    readingsHandler: (readings: iReadings) => void
) {
    console.log("Connecting!");
    socket = io(`${BACKEND_API_BASE_URL}/io/${BACKEND_API_IO_VERSION}`);
    socket!.on("connect", () => {
        console.log("Connected!");
    });
    socket!.on("disconnect", () => {
        if (!socket!.active) {
            socket!.disconnect();
            setIsDownloading(false);
            socket = undefined;
            disconnectHandler();
        }
    });
    socket!.on("connect_error", () => {
        if (!socket!.active) {
            socket!.disconnect();
            setIsDownloading(false);
            socket = undefined;
            disconnectHandler();
        }
    });
    socket!.on("readings", (readings: iReadings) => {
        readingsHandler(readings);
    });
    socket.on("download-data", (readings, ack) => {
        console.log(...readings);
        ack();
    });
    socket.on("download-finish", (downloadId) => {
        console.log("Download for " + downloadId + " has finished!");
    });
}

export function _startDownload(
    downloadRequest: iDownloadRequest,
    downloadHandler: (readings: iReadings[], downloadId: string) => void | Promise<void>,
    finishHandler: (downloadId: string) => void | Promise<void>
) {
    if (socket === undefined) {
        setIsDownloading(false);
        console.log("Socket is not connected!");
        return;
    }

    socket!.off("download-data");
    socket!.off("download-finish");

    socket!.on("download-data", (readings: iReadings[], downloadId: string, ack: () => void) => {
        if (downloadId !== downloadRequest.downloadId) {
            return;
        }
        downloadHandler(readings, downloadId);
        ack();
    });
    socket.on("download-finish", (downloadId) => {
        if (downloadId !== downloadRequest.downloadId) {
            return;
        }
        finishHandler(downloadId);
    });
    socket!.emit("download-request", downloadRequest);
}

export function disconnect() {
    if (socket === undefined) {
        console.log("Socket is not connected!");
        return;
    }
    socket!.disconnect();
    socket = undefined;
}

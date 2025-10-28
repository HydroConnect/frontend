import { io, Socket } from "socket.io-client";
import { BACKEND_API_BASE_URL, BACKEND_API_IO_VERSION } from "./constants";
import type { iReadings } from "@/schemas/readings";
import type { iDownloadRequest } from "@/schemas/downloadRequest";
import { IOError, IOErrorEnum } from "./errorHandler";

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

function handleLostConnection(disconnectHandler: () => void) {
    if (!socket!.active) {
        socket!.disconnect();
        setIsDownloading(false);
        socket = undefined;
        disconnectHandler();
    }
}

/**
 *
 * @param disconnectHandler Is suggested to handle changes in UI and to call connectAndListen() again
 * @param readingsHandler Is suggested to update the UI of the element
 */
export function connectAndListen(
    connectHandler: () => void,
    disconnectHandler: () => void,
    readingsHandler: (readings: iReadings) => void
) {
    console.log("Connecting!");

    socket = io(`${BACKEND_API_BASE_URL}/io/${BACKEND_API_IO_VERSION}`);
    socket!.on("connect", () => {
        connectHandler();
    });
    socket!.on("disconnect", () => {
        handleLostConnection(disconnectHandler);
    });
    socket!.on("connect_error", () => {
        handleLostConnection(disconnectHandler);
    });
    socket!.on("readings", (readings: iReadings) => {
        readingsHandler(readings);
    });
}

export function _startDownload(
    downloadRequest: iDownloadRequest,
    downloadHandler: (readings: iReadings[], downloadId: string) => void | Promise<void>,
    finishHandler: (downloadId: string) => void | Promise<void>
): undefined | Error {
    if (socket === undefined) {
        setIsDownloading(false);
        return new IOError(IOErrorEnum.NotConnected);
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

export function disconnect(): undefined | Error {
    if (socket === undefined) {
        return new IOError(IOErrorEnum.NotConnected);
    }
    socket!.disconnect();
    socket = undefined;
}

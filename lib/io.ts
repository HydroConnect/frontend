import { io, Socket } from "socket.io-client";
import { BACKEND_API_BASE_URL, BACKEND_API_IO_VERSION } from "./constants";
import type { iReadings } from "@/schemas/readings";
import type { iDownloadRequest } from "@/schemas/downloadRequest";
import { errorHandler, IOError, IOErrorEnum } from "./errorHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";

let socket: Socket | undefined = undefined;
let isDownloading = false;
let shouldContinue = true;

export function getShouldContinue() {
    return shouldContinue;
}

export function setShouldContinue(input: boolean) {
    shouldContinue = input;
}

/**
 * @description Get downloading status
 * @returns {boolean}
 */
export function getIsDownloading() {
    return isDownloading;
}
/**
 * @description Change downloading status (should never be called in FE)
 * @param {boolean} input
 */
export function setIsDownloading(input: boolean) {
    isDownloading = input;
}
/**
 * @description Get socket connection status
 * @returns {boolean}
 */
export function isConnected(): boolean {
    return socket !== undefined;
}

function handleLostConnection(disconnectHandler: () => void) {
    disconnectHandler();
    setIsDownloading(false);
    if (!socket!.active) {
        socket!.disconnect();
        socket = undefined;
    }
}

async function resetDownloadState() {
    await AsyncStorage.removeItem("download-progress");
    setIsDownloading(false);
}

/**
 * @description Connect to socket.io and listen readings
 * @param connectHandler Is suggested to change UI Connection status
 * @param disconnectHandler Is suggested to handle changes in UI and to call connectAndListen() again
 * @param readingsHandler Is suggested to update the UI of the IoT data element
 * @param IOErrorHandler Is suggested to use default ErrorHandler (when receives error event)
 */
export function connectAndListen(
    connectHandler: () => void,
    disconnectHandler: () => void,
    readingsHandler: (readings: iReadings) => void,
    IOErrorHandler: (err: Error) => void = errorHandler
) {
    if (socket !== null) {
        disconnect();
    }
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
    socket!.io.on("reconnect_failed", () => {
        handleLostConnection(disconnectHandler);
    });
    socket!.on("error", (err: Error) => {
        IOErrorHandler(err);
    });
    socket!.on("readings", (readings: iReadings) => {
        readingsHandler(readings);
    });
}

/**
 * @description Start backend process for download (should never be called by FE)
 * @param downloadRequest
 * @param downloadHandler
 * @param finishHandler
 * @returns {undefined | Error} Undefined if success Error if there are error
 */
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

    socket!.on("error", async (err: Error) => {
        if (err.name === "IOError") {
            await resetDownloadState();
        }
    });
    socket!.on(
        "download-data",
        (readings: iReadings[], downloadId: string, ack: (arg: any) => void) => {
            if (downloadId !== downloadRequest.downloadId) {
                return;
            }
            if (getShouldContinue()) {
                downloadHandler(readings, downloadId);
                ack(true);
            } else {
                ack(false);
            }
        }
    );
    socket.on("download-finish", (downloadId) => {
        if (downloadId !== downloadRequest.downloadId) {
            return;
        }
        finishHandler(downloadId);
    });
    socket!.emit("download-request", downloadRequest);
}

/**
 * @description Disconnect socket.io from server (This also clear all EventListener)
 * @returns {undefined | Error} Error if is not connected from beginning
 */
export function disconnect(): undefined | Error {
    if (socket === undefined) {
        return new IOError(IOErrorEnum.NotConnected);
    }
    socket!.off();
    socket!.disconnect();
    socket = undefined;
}

import { connect, io, Socket } from "socket.io-client";
import { BACKEND_API_BASE_URL, BACKEND_API_IO_VERSION } from "./constants";
import type { iReadings } from "@/schemas/readings";

let socket: Socket | undefined = undefined;

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
            socket = undefined;
            disconnectHandler();
        }
    });
    socket!.on("connect_error", () => {
        if (!socket!.active) {
            socket!.disconnect();
            socket = undefined;
            disconnectHandler();
        }
    });
    socket!.on("readings", (readings: iReadings) => {
        readingsHandler(readings);
    });
}

export function disconnect() {
    if (socket === undefined) {
        console.error("Socket is not connected!");
        return;
    }
    socket!.disconnect();
    socket = undefined;
}

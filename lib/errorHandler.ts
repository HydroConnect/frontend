import { toastError } from "@/src/components/ToastStack";
import { MAX_DOWNLOAD_ID_LENGTH } from "./constants";

export enum IOErrorEnum {
    NotConnected,
}
export enum DownloadErrorEnum {
    InvalidName,
    CancelPicking,
    NotFound,
    NoPermission,
    DifferentFolder,
    DownloadInProgress,
    UnfinishedDownload,
    NoUnfinishedDownload,
    Unknown,
}
export enum SystemErrorEnum {
    DatabaseInitError,
    DatabaseExecError,
    NotificationProjectIdNotFound,
    NotRealDevice,
}
export class HttpError extends Error {
    status: number;

    constructor(statusCode: number) {
        let message = "";
        switch (Math.floor(statusCode / 100)) {
            case 4:
                message = "Bad Request / Connection Error";
                break;
            default:
                message = "Server Error";
                break;
        }

        super(message);
        this.name = this.constructor.name;
        this.status = statusCode;
        this.cause = message;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class IOError extends Error {
    constructor(type: IOErrorEnum) {
        let message = "";
        switch (type) {
            case IOErrorEnum.NotConnected:
                message = "Socket.IO is not connected";
                break;
        }
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
    }
}
export class DownloadError extends Error {
    metadata = {};
    type: DownloadErrorEnum;
    constructor(type: DownloadErrorEnum, metadata?: any) {
        let message = "";
        switch (type) {
            case DownloadErrorEnum.InvalidName:
                message = "Supplied name is invalid (max_length " + MAX_DOWNLOAD_ID_LENGTH + ")";
                break;
            case DownloadErrorEnum.CancelPicking:
                message = "User has canceled";
                break;
            case DownloadErrorEnum.NotFound:
                message = "File is missing";
                break;
            case DownloadErrorEnum.DownloadInProgress:
                message = "Another download is in progress";
                break;
            case DownloadErrorEnum.NoPermission:
                message = "Require permission";
                break;
            case DownloadErrorEnum.DifferentFolder:
                message = "Choosen folder differs than before: " + metadata.path;
                break;
            case DownloadErrorEnum.UnfinishedDownload:
                message = "There is unfinished download";
                break;
            case DownloadErrorEnum.NoUnfinishedDownload:
                message = "No unfinished download";
                break;
            case DownloadErrorEnum.Unknown:
                message = "Error while downloading";
        }
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.type = type;
        this.metadata = metadata;
        this.name = this.constructor.name;
    }
}
export class SystemError extends Error {
    constructor(type: SystemErrorEnum) {
        let message = "";
        switch (type) {
            case SystemErrorEnum.DatabaseInitError:
                message = "Error in initializing database";
                break;
            case SystemErrorEnum.DatabaseExecError:
                message = "Error in executing database command";
                break;
            case SystemErrorEnum.NotificationProjectIdNotFound:
                message = "Project ID not founc (app error)";
                break;
            case SystemErrorEnum.NotRealDevice:
                message = "Some feature can only be run on real device not simulator";
                break;
        }
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
    }
}

export function errorHandler(err: Error) {
    toastError({ message: err.message });
}

export enum IOErrorEnum {
    NotConnected,
}
export enum DownloadErrorEnum {
    CancelPicking,
    NotFound,
    NoPermission,
    DownloadInProgress,
    UnfinishedDownload,
    NoUnfinishedDownload,
    Unknown,
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
    constructor(type: DownloadErrorEnum, metadata?: any) {
        let message = "";
        switch (type) {
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
        this.metadata = metadata;
        this.name = this.constructor.name;
    }
}

export function errorHandler(err: Error) {
    console.log(err);
}

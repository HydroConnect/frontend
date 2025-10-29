interface iDownloadRequest {
    from: string;
    to: string;
    downloadId: string;
}

const downloadRequestSample = {
    from: "2025-10-22T01:32:11.043Z",
    to: "2025-10-22T01:32:11.048Z",
    downloadId: "MDOW",
};

export type { iDownloadRequest };
export { downloadRequestSample };

interface iDownloadProgress {
    downloadId: string;
    nonce: number; // How many times does the reconnection happens
    lastWritten: string;
    from: string;
    to: string;
    dirUri: string;
}

const downloadProgressSample: iDownloadProgress = {
    downloadId: "MDOW",
    nonce: 0,
    lastWritten: "2025-10-22T01:32:11.046Z",
    from: "2025-10-22T01:32:11.046Z",
    to: "2025-10-22T01:32:11.048Z",
    dirUri: "file:///testing",
};

export type { iDownloadProgress };
export { downloadProgressSample };

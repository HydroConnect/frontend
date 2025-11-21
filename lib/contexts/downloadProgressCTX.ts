import { createContext } from "react";

interface iDownloadProgressCTX {
    downloadProgress: number | null;
    setDownloadProgress: (...args: any) => any;
}
export const DownloadProgressCTX = createContext<null | iDownloadProgressCTX>(null);

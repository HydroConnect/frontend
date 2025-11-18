import { createContext } from "react";

interface iConnectionCTX {
    connection: boolean;
    setConnection: (...args: any) => any;
}
export const ConnectionCTX = createContext<null | iConnectionCTX>(null);

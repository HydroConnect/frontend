import type { iReadings } from "@/schemas/readings";
import { createContext } from "react";

interface iReadingCTX {
    reading: null | iReadings;
    setReading: (...args: any) => any;
}
export const ReadingCTX = createContext<null | iReadingCTX>(null);

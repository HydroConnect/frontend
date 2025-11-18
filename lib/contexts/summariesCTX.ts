import type { iSummaries } from "@/schemas/summaries";
import { createContext } from "react";

interface iSummariesCTX {
    summaries: null | iSummaries[];
    setSummaries: (...args: any) => any;
}
export const SummariesCTX = createContext<null | iSummariesCTX>(null);

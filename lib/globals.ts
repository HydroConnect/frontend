import type { iReadings } from "@/schemas/readings";
import type { iSummaries } from "@/schemas/summaries";

interface iGlobals {
    GLatestReadings: null | iReadings;
    GSummaries: null | iSummaries[];
    GLastFetch: null | Date;
}

export const globals: iGlobals = {
    GLatestReadings: null,
    GSummaries: null,
    GLastFetch: null,
};

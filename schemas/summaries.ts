import { readingsSample, type iReadings } from "./readings";

interface iSummaries {
    min: iReadings;
    max: iReadings;
    timestamp: string;
}

const summariesSample: iSummaries = {
    min: readingsSample,
    max: readingsSample,
    timestamp: "2025-10-21T01:23:54.533+00:00",
};

export { summariesSample };
export type { iSummaries };

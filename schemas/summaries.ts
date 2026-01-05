// Sync with BE
interface iSummaries {
    uptime: number;
    timestamp: string;
}

const summariesSample: iSummaries = {
    uptime: 3600,
    timestamp: "2025-10-21T01:23:54.533+00:00",
};

export { summariesSample };
export type { iSummaries };

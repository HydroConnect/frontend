interface iReadings {
    turbidity: number;
    pH: number;
    tds: number;
    temperature: number;
    percent: number;
    timestamp: string;
}

const readingsSample: iReadings = {
    percent: 0.5,
    pH: 7,
    tds: 6,
    temperature: 10,
    turbidity: 10,
    timestamp: "2025-10-21T01:23:54.533+00:00",
};

export { readingsSample };
export type { iReadings };

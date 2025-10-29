interface iReadings {
    turbidity: number;
    pH: number;
    tds: number;
    temperature: number;
    control: number;
    percent: number;
    timestamp: string;
}

const readingsSample: iReadings = {
    turbidity: 10,
    pH: 7,
    tds: 6,
    temperature: 10,
    control: 31,
    percent: 0.5,
    timestamp: "2025-10-21T01:23:54.533+00:00",
};

const readingsHeader: (keyof iReadings)[] = [
    "turbidity",
    "pH",
    "tds",
    "temperature",
    "control",
    "percent",
    "timestamp",
];

export { readingsSample, readingsHeader };
export type { iReadings };

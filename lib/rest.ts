import { type iSummaries } from "@/schemas/summaries";
import {
    BACKEND_API_BASE_URL,
    BACKEND_API_REST_VERSION,
    FETCH_REST_TIME_MS,
    PANDUAN_EXPIRED_D,
} from "./constants";
import { HttpError } from "./errorHandler";
import type { iReadings } from "@/schemas/readings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globals } from "./globals";
import NetInfo from "@react-native-community/netinfo";
import { toastError } from "@/src/components/ToastStack";
import type { iPanduanData } from "@/schemas/panduanData";

/**
 * @description Get last 7 days summaries
 * @returns {Promise<iSummaries[] | Error>}
 */
export async function getSummaries(): Promise<iSummaries[] | Error> {
    try {
        const result = await fetch(
            `${BACKEND_API_BASE_URL}/rest/${BACKEND_API_REST_VERSION}/summary`
        );
        if (result.status !== 200) {
            throw "Connection Error";
        }
        const json = await result.json();
        return json;
    } catch (err) {
        if (err === "Connection Error") {
            return new HttpError(400);
        }
        return new HttpError(500);
    }
}

/**
 * @description Get latest readings
 * @returns {Promise<iReadings | Error>}
 */
export async function getLatest(): Promise<iReadings | Error> {
    try {
        const result = await fetch(
            `${BACKEND_API_BASE_URL}/rest/${BACKEND_API_REST_VERSION}/latest`
        );
        if (result.status !== 200) {
            throw "Connection Error";
        }
        const json = await result.json();
        return json;
    } catch (err) {
        if (err === "Connection Error") {
            return new HttpError(400);
        }
        return new HttpError(500);
    }
}

async function prefetch(
    setLatestReading: ((...args: any[]) => any) | null,
    setSummaries: ((...args: any[]) => any) | null
) {
    if (globals.GLatestReadings === null) {
        globals.GLatestReadings = JSON.parse(
            (await AsyncStorage.getItem("reading")) ?? "null"
        ) as iReadings | null;
    }
    if (globals.GSummaries === null) {
        globals.GSummaries = JSON.parse((await AsyncStorage.getItem("summaries")) ?? "null") as
            | iSummaries[]
            | null;
    }

    if (setLatestReading !== null) {
        setLatestReading(globals.GLatestReadings);
    }
    if (setSummaries !== null) {
        setSummaries(globals.GSummaries);
    }
}

export async function fetchData(
    setLatestReading: ((...args: any[]) => any) | null,
    setSummaries: ((...args: any[]) => any) | null
) {
    await prefetch(setLatestReading, setSummaries);

    if (
        globals.GLastFetch !== null &&
        Date.now() - globals.GLastFetch.getTime() <= FETCH_REST_TIME_MS
    ) {
        return;
    }
    let isSuccess = true;
    const [readingData, summariesData] = await Promise.all([getLatest(), getSummaries()]);

    if (!(readingData instanceof Error)) {
        globals.GLatestReadings = readingData;
        await AsyncStorage.setItem("reading", JSON.stringify(readingData));
        if (setLatestReading !== null) {
            setLatestReading(readingData);
        }
    } else {
        isSuccess = false;
        NetInfo.refresh();
    }

    if (!(summariesData instanceof Error)) {
        globals.GSummaries = summariesData;
        await AsyncStorage.setItem("summaries", JSON.stringify(summariesData));
        if (setSummaries !== null) {
            setSummaries(summariesData);
        }
    } else {
        isSuccess = false;
        NetInfo.refresh();
    }
    if (isSuccess) {
        globals.GLastFetch = new Date();
    } else {
        toastError({ message: "Error fetching" });
    }
}

export async function getPanduanData(
    _forceFetch: boolean = false
): Promise<iPanduanData[] | Error> {
    const hasil = await AsyncStorage.getItem("panduanData");
    if (
        _forceFetch ||
        hasil === null ||
        (hasil !== null &&
            Date.now() - JSON.parse(hasil).timestamp >= PANDUAN_EXPIRED_D * 1000 * 60 * 60 * 24)
    ) {
        try {
            const result = await fetch(
                `${BACKEND_API_BASE_URL}/rest/${BACKEND_API_REST_VERSION}/panduan`
            );
            if (result.status !== 200) {
                throw "Connection Error";
            }
            const json = await result.json();
            await AsyncStorage.setItem(
                "panduanData",
                JSON.stringify({ timestamp: Date.now(), data: json })
            );
            return json;
        } catch (err) {
            if (err === "Connection Error") {
                return new HttpError(400);
            }
            return new HttpError(500);
        }
    } else {
        return JSON.parse(hasil).data;
    }
}

import { type iSummaries } from "@/schemas/summaries";
import { BACKEND_API_BASE_URL, BACKEND_API_REST_VERSION } from "./constants";
import { HttpError } from "./errorHandler";
import type { iReadings } from "@/schemas/readings";

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
    } catch {
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
    } catch {
        return new HttpError(500);
    }
}

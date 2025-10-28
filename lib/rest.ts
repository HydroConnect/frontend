import { type iSummaries } from "@/schemas/summaries";
import { BACKEND_API_BASE_URL, BACKEND_API_REST_VERSION } from "./constants";
import { errorHandler, HttpError } from "./errorHandler";

export async function getSummaries(): Promise<iSummaries[] | null> {
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
        errorHandler(new HttpError(500));
    }

    return null;
}

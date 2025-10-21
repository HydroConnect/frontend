import { type iSummaries } from "@/schemas/summaries";
import { BACKEND_API_BASE_URL, BACKEND_API_REST_VERSION } from "./constants";

export async function getSummaries(): Promise<iSummaries[] | null> {
    try {
        const result = await fetch(
            `${BACKEND_API_BASE_URL}/rest/${BACKEND_API_REST_VERSION}/summary`
        );
        const json = await result.json();
        return json;
    } catch (err) {
        console.log(err);
    }

    return null;
}

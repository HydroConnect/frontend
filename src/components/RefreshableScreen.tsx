import { ReadingCTX } from "@/lib/contexts/readingCTX";
import { SummariesCTX } from "@/lib/contexts/summariesCTX";
import { fetchData } from "@/lib/rest";
import { useCallback, useContext, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";

export function RefreshableScreen({ children }: any) {
    const { setReading } = useContext(ReadingCTX)!;
    const { setSummaries } = useContext(SummariesCTX)!;

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData(setReading, setSummaries);
        setRefreshing(false);
    }, [setReading, setRefreshing, setSummaries]);

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            className="w-full h-full m-0 p-0 box-content bg-white"
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#7D9F8C"]} // Android
                    tintColor="#000000" // iOS
                />
            }>
            {children}
        </ScrollView>
    );
}

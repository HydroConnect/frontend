import { View } from "react-native";
import { StatusPill } from "./StatusPill";
import { Typography } from "./Typography";
import { useContext } from "react";
import { ConnectionCTX } from "@/lib/contexts/connectionCTX";

interface PageTitleProps {
    className?: null | string;
    title: string;
}

export default function PageTitle({ className = null, title }: PageTitleProps) {
    const { connection } = useContext(ConnectionCTX)!;

    return (
        <View className={`flex-row justify-start items-center gap-5 ${className ?? ""}`}>
            <Typography variant="h3" weight="semibold">
                {title}
            </Typography>
            <StatusPill
                text={connection ? "Terhubung" : "Tak Terhubung"}
                variant={connection ? "ok" : "warn"}
                className="h-max grow-1"
            />
        </View>
    );
}

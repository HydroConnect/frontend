import AsyncStorage from "@react-native-async-storage/async-storage";

export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

export function getHari(date: Date): string {
    return new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
    }).format(date);
}

export function getJam(date: Date): string {
    return new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })
        .format(date)
        .replace(":", ".");
}

export function debounce(state: any, fun: (...args: any[]) => any, timeout: number = 400): void {
    if (state.now === true) {
        return;
    }
    fun();
    state.now = true;
    setTimeout(() => {
        state.now = false;
    }, timeout);
}

export function round(num: number, precision: number) {
    return Math.round(num * 10 ** precision) / 10 ** precision;
}

export async function isFirstTime(): Promise<boolean> {
    const firstTime = await AsyncStorage.getItem("isFirstTime");
    if (firstTime === null) {
        await AsyncStorage.setItem("isFirstTime", "true");
        return true;
    }
    return false;
}

export function getHourMinute(num: number) {
    return [Math.floor(num), Math.round(num*60) % 60];
}
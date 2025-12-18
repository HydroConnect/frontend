import * as SQLite from "expo-sqlite";
import { errorHandler, SystemError, SystemErrorEnum } from "./errorHandler";

export let db: SQLite.SQLiteDatabase | undefined = undefined;
(async function init() {
    try {
        db = await SQLite.openDatabaseAsync("hydroconnect");
        await db.execAsync(
            `CREATE TABLE IF NOT EXISTS notifications (notification_id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp INTEGER NOT NULL, type INTEGER NOT NULL);`
        );
    } catch {
        errorHandler(new SystemError(SystemErrorEnum.DatabaseInitError));
    }
})();

# Frontend API Reference

## Overview

This document provides a complete reference for the **Frontend API**, including schemas, constants, contexts, globals, socket handlers, REST utilities, and download logic.

> **Note:** `ApiTest.tsx` is a **development-only** page for API debugging and must be excluded from production.

All console logs throughout the codebase have been replaced with:

- `toastInfo`
- `toastError`
- `toastSuccess`
- `toastWarn`

These functions must be used for all developer-facing and user-facing notifications.

---

## Directory Structure

```
lib/                     # Logic, constants, functions
lib/contexts/            # React Context Providers (connection, readings, summaries)
schemas/                 # All schemas used by the frontend
```

---

# Schemas

## DownloadProgress

```ts
interface iDownloadProgress {
    downloadId: string;
    nonce: number; // Number of reconnection attempts
    lastWritten: string;
    to: string;
    dirUri: string;
}

const downloadProgressSample: iDownloadProgress = {
    downloadId: "MDOW",
    nonce: 0,
    lastWritten: "2025-10-22T01:32:11.046Z",
    to: "2025-10-22T01:32:11.048Z",
    dirUri: "file:///testing",
};
```

---

## DownloadRequest (Sync with BE)

```ts
interface iDownloadRequest {
    from: string;
    to: string;
    downloadId: string;
    // Length must be less than MAX_DOWNLOAD_ID_LENGTH
}

const downloadRequestSample = {
    from: "2025-10-22T01:32:11.043Z",
    to: "2025-10-22T01:32:11.048Z",
    downloadId: "MDOW",
};
```

---

## Readings (Sync with BE)

```ts
interface iReadings {
    turbidity: number;
    pH: number;
    tds: number;
    temperature: number; // Degree Celcius
    control: number; // MSB → LSB (valve, sensor, distribution, reservoir, tank)
    percent: number; // Percent from formula
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
```

---

## Updated Summaries Schema (Sync with BE)

```ts
interface iSummaries {
    uptime: number;
    timestamp: string;
}

const summariesSample: iSummaries = {
    uptime: 3600,
    timestamp: "2025-10-21T01:23:54.533+00:00",
};

export { summariesSample };
export type { iSummaries };
```

---

## Notification Schema

```ts
export const enum NotificationType {
    on,
    off,
}

interface iNotification {
    type: NotificationType;
    timestamp: Date;
}

const notificationSample: iNotification = {
    type: NotificationType.on,
    timestamp: new Date(),
};

export { notificationSample };
export type { iNotification };
```

---

# Contexts (`lib/contexts/`)

## connectionCTX

```ts
interface iConnectionCTX {
    connection: boolean;
    setConnection: (...args: any) => any;
}
```

Used for global UI connection status, updated by socket events.

---

## readingCTX

```ts
interface iReadingCTX {
    reading: null | iReadings;
    setReading: (...args: any) => any;
}
```

Stores the **latest IoT reading**.

---

## summariesCTX

```ts
interface iSummariesCTX {
    summaries: null | iSummaries[];
    setSummaries: (...args: any) => any;
}
```

Stores the **latest summaries** returned from backend.

---

# Globals (`lib/globals.tsx`)

These globals are used for syncing UI state, caching, and checking when to re-fetch.

```ts
interface iGlobals {
    GLatestReadings: null | iReadings;
    GSummaries: null | iSummaries[];
    GLastFetch: null | Date;
}

export const globals: iGlobals = {
    GLatestReadings: null,
    GSummaries: null,
    GLastFetch: null,
};
```

- `GLatestReadings` is updated by socket stream
- `GSummaries` is updated by summaries REST calls
- `GLastFetch` is used by offline-prefetch logic

---

# Constants

```ts
export const BACKEND_API_BASE_URL = "http://192.168.110.221:3000"; // On development adjust this to server IP
export const BACKEND_API_REST_VERSION = "v1";
export const BACKEND_API_IO_VERSION = "v1";
export const MAX_DOWNLOAD_ID_LENGTH = 10;

export const ON_OFF_THRESHOLD_MS = 6000;
export const ON_OFF_THRESHOLD_ERROR_MS = 4000;

export const FETCH_REST_TIME_MS = 10000;
export const IOT_INTERVAL_MS = 2000;

export const SUMMARY_GRAPH_PRECISION = 2;
```

---

# API Reference

## resumeDownload

```ts
/**
 * @description Resume unfinished downloads, throw if none exist
 * @param {boolean} _forcePick Force open file picker (used when permission error)
 * @param mergeFailHandler Passed to downloadReports (defaults to errorHandler)
 * @returns {Promise<Error | undefined>}
 */
export async function resumeDownload(
    _forcePick: boolean = false,
    mergeFailHandler: (err: Error) => void = errorHandler
): Promise<undefined | Error>;
```

**File:** `downloadReports.ts`

---

## downloadReports

```ts
export async function downloadReports(
    downloadRequest: iDownloadRequest,
    _resume: boolean = false,
    _forcePick: boolean = false,
    mergeFailHandler: (err: Error) => void = errorHandler
): Promise<undefined | Error>;
```

**File:** `downloadReports.ts`

---

## disconnect

```ts
export function disconnect(): undefined | Error;
```

**File:** `io.ts`

---

## \_startDownload

```ts
export function _startDownload(
    downloadRequest: iDownloadRequest,
    downloadHandler: (readings: iReadings[], downloadId: string) => void | Promise<void>,
    finishHandler: (downloadId: string) => void | Promise<void>
): undefined | Error;
```

**File:** `io.ts`

---

## connectAndListen

```ts
export function connectAndListen(
    connectHandler: () => void,
    disconnectHandler: () => void,
    readingsHandler: (readings: iReadings) => void,
    IOErrorHandler: (err: Error) => void = errorHandler
);
```

**File:** `io.ts`

### Additional Behavior

A new socket reconnection listener has been introduced:

```ts
socket!.io.on("reconnect_failed", () => {
    handleLostConnection(disconnectHandler);
});
```

This ensures the frontend correctly handles reconnection failures, updating UI and context states accordingly.

---

## isConnected

```ts
export function isConnected(): boolean;
```

---

## setIsDownloading

```ts
export function setIsDownloading(input: boolean);
```

---

## getIsDownloading

```ts
export function getIsDownloading();
```

---

## getSummaries

```ts
export async function getSummaries(): Promise<iSummaries[] | Error>;
```

**File:** `rest.ts`

---

# REST Utilities: `rest.ts`

### Prefetch

- Used for fetching cached/offline data.
- Stores results into `globals`.

### fetchData

- Dynamically fetches new data.
- Applies throttling via `FETCH_REST_TIME_MS`.
- Writes results to contexts and globals.

---

# Utils (`utils.ts`)

Contains UI helper functions:

- formatting helpers
- timestamp formatting
- number formatting
- UI-ready computed fields
- toast wrappers (replacing console logs)

---

# RefreshablePages Component

A utility component that triggers:

- `fetchData()`
- summary refresh
- UI refresh

Used to ensure pages automatically update based on timers or user interaction.

---

# Error Handling

There are **three** custom error types.

## IOError

```ts
IOError(type: IOErrorEnum)

enum IOErrorEnum {
    NotConnected,
}
```

---

## HTTPError

```ts
HTTPError(statusCode: number)
```

---

## DownloadError

```ts
DownloadError(type: DownloadErrorEnum)

enum DownloadErrorEnum {
    InvalidName,
    CancelPicking,
    NotFound,
    NoPermission,
    DownloadInProgress,
    UnfinishedDownload,
    NoUnfinishedDownload,
    Unknown,
}
```

---

## Default Error Handler

```ts
function errorHandler(error: Error);
```

---

# Test Case Coverage

## Download Error Test Cases

```
- Invalid name (name > MAX_DOWNLOAD_ID_LENGTH)
- Socket not connected
- User disconnect midway
- User close the app and re-open
- User close the app and re-open but different directory (PermissionError)
- User close the app and re-open but rename file / file is missing (MergeError)
- User try to download but already downloading
- User try to download but there are unfinished downloads
- User try to resume but there are no unfinished downloads
```

---

## HTTP Test Case

```
- Server Down
```

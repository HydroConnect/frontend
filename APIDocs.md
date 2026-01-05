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

API reference can be seen in individual file on `lib/` some has `JSDoc` documentation and have typescript interface.

---

## API Directory Structure

```
lib/                     # Logic, constants, functions
lib/contexts/            # React Context Providers (connection, readings, summaries)
schemas/                 # All schemas used by the frontend
```

---

# Schemas

Below is the **schemas documentation derived strictly from the provided TypeScript interfaces**.
Since **all items are frontend-only TypeScript interfaces**, **only interfaces are documented** (no Zod, no Mongoose).

For items marked **“Sync with BE”**, a **clear, prominent indicator** is added as requested.

---

**SYNC WITH BACKEND (BE)**

---

### `DownloadProgress`

**Description:**
Tracks local download progress and reconnection state on the client.

**Type:**

```ts
interface iDownloadProgress {
    downloadId: string;
    nonce: number;
    lastWritten: string;
    from: string;
    to: string;
    dirUri: string;
}
```

**Fields:**

| Field         | Type           | Description                               |
| ------------- | -------------- | ----------------------------------------- |
| `downloadId`  | `string`       | Unique download identifier.               |
| `nonce`       | `number`       | Number of reconnection attempts.          |
| `lastWritten` | `ISO datetime` | Last successfully written timestamp.      |
| `from`        | `ISO datetime` | Start date of the download range.         |
| `to`          | `ISO datetime` | End date of the download range.           |
| `dirUri`      | `string`       | Local directory URI where data is stored. |

---

### `DownloadRequest`

**_SYNC WITH BACKEND (BE)_**

Request payload for initiating a data download.

```ts
interface iDownloadRequest {
    from: string;
    to: string;
    downloadId: string;
}
```

| Field        | Type           | Description                        |
| ------------ | -------------- | ---------------------------------- |
| `from`       | `ISO datetime` | Start of requested data range.     |
| `to`         | `ISO datetime` | End of requested data range.       |
| `downloadId` | `string`       | Unique identifier for the request. |

---

### `PanduanData`

**_SYNC WITH BACKEND (BE)_**

Instructional guide data displayed in the application.

```ts
interface iPanduanData {
    title: string;
    videoUrl: string;
    thumbnailUrl: string;
    steps: string[];
}
```

| Field          | Type       | Description                 |
| -------------- | ---------- | --------------------------- |
| `title`        | `string`   | Guide title.                |
| `videoUrl`     | `string`   | URL to instructional video. |
| `thumbnailUrl` | `string`   | Thumbnail image URL.        |
| `steps`        | `string[]` | Ordered list of steps.      |

---

### `Readings`

**_SYNC WITH BACKEND (BE)_**

Represents a single IoT sensor reading.

```ts
interface iReadings {
    turbidity: number;
    pH: number;
    tds: number;
    temperature: number;
    control: number;
    percent: number;
    timestamp: string;
}
```

| Field         | Type           | Description                          |
| ------------- | -------------- | ------------------------------------ |
| `turbidity`   | `number`       | Turbidity level of water.            |
| `pH`          | `number`       | pH level of water.                   |
| `tds`         | `number`       | Total dissolved solids.              |
| `temperature` | `number`       | Temperature in Celsius.              |
| `control`     | `number`       | Control bitmask (MSB → LSB).         |
| `percent`     | `number`       | Calculated water quality percentage. |
| `timestamp`   | `ISO datetime` | Time when reading was recorded.      |

---

### `Summaries`

**SYNC WITH BACKEND (BE)**

Daily uptime summary for the system.

```ts
interface iSummaries {
    uptime: number;
    timestamp: string;
}
```

| Field       | Type           | Description                        |
| ----------- | -------------- | ---------------------------------- |
| `uptime`    | `number`       | Uptime in seconds.                 |
| `timestamp` | `ISO datetime` | Summary date (midnight reference). |

---

### `UsageNotification`

**SYNC WITH BACKEND (BE)**

Represents a usage-based notification event.

```ts
const enum UsageNotificationType {
    on = 1,
    off = 0,
}

interface iUsageNotification {
    notificationId: number;
    type: UsageNotificationType;
    timestamp: number;
}
```

| Field            | Type                    | Description                        |
| ---------------- | ----------------------- | ---------------------------------- |
| `notificationId` | `number`                | Unique notification identifier.    |
| `type`           | `UsageNotificationType` | Notification state (`on` / `off`). |
| `timestamp`      | `number`                | Unix timestamp (milliseconds).     |

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

## downloadProgressCTX

```ts
interface iDownloadProgressCTX {
    downloadProgress: number | null;
    setDownloadProgress: (...args: any) => any;
}
```

Used for UI download progress states.

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
const ENVIRONMENT_STATUS = "PRODUCTION"; // On Development change this to "DEVELOPMENT"

const BACKEND_API_BASE_URL = "https://hydroconnect.org"; // On Development change this to server IP
const BACKEND_API_REST_VERSION = "v1";
const BACKEND_API_IO_VERSION = "v1";

const MAX_DOWNLOAD_ID_LENGTH = 50;

const ON_OFF_THRESHOLD_MS = 6000; // For when is considered realtime data
const ON_OFF_THRESHOLD_ERROR_MS = 4000;

const FETCH_REST_TIME_MS = 10000; // Rest time for fetching latest reading (prevent spam)

const IOT_INTERVAL_MS = 2000;

const SUMMARY_GRAPH_PRECISION = 2;
const PROGRESS_SCALING_FACTOR = 2000; // Download Progress percent scaler
const PANDUAN_EXPIRED_D = 7; // When to refetch
```

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

## SystemError

```ts
enum SystemErrorEnum {
    NotificationProjectIdNotFound,
    NotRealDevice,
}
```

---

## Default Error Handler

```ts
function errorHandler(error: Error);
```

This will spawn a toast.

---

# Test Case Coverage (manual test)

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

---

## Notification Test Case

```
- Enable notification and receive
- Disable notification and receive (should not come)
```

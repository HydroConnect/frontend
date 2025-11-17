# Frontend API Reference

## Overview

This document provides an overview of the **Frontend API Reference**, including schemas, constants, and function documentation.

> **Note:** `ApiTest.tsx` is a **development-only** page for API debugging and must be excluded from production.

---

## Directory Structure

```

lib/ # Logic, constants, and functions
schemas/ # All schemas used by the frontend

```

---

## Schemas

### DownloadProgress

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

### DownloadRequest (Sync with BE)

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

### Readings (Sync with BE)

```ts
interface iReadings {
    turbidity: number;
    pH: number;
    tds: number;
    temperature: number; // Degree Celcius
    control: number; // For control info MSB --> LSB (valve, sensor, distribution, resservoir, tank)
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

### Summaries (Sync with BE)

```ts
interface iSummaries {
    min: iReadings;
    max: iReadings;
    timestamp: string;
}

const summariesSample: iSummaries = {
    min: readingsSample,
    max: readingsSample,
    timestamp: "2025-10-21T01:23:54.533+00:00",
};
```

---

## Constants

**Constants.ts**

```ts
export const BACKEND_API_BASE_URL = "http://192.168.1.6:3000"; // Change to server IP on development
export const BACKEND_API_REST_VERSION = "v1";
export const BACKEND_API_IO_VERSION = "v1";
export const MAX_DOWNLOAD_ID_LENGTH = 10;
// SYNC WITH BE!
```

---

## API Reference

### resumeDownload

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

### downloadReports

```ts
/**
 * @description Download Reports
 * @param downloadRequest DownloadRequest data
 * @param {boolean} _resume Resume unfinished download (internal use only)
 * @param {boolean} _forcePick Force file picker (internal use only)
 * @param mergeFailHandler Handler for merge failure
 * @returns {Promise<undefined | Error>}
 */
export async function downloadReports(
    downloadRequest: iDownloadRequest,
    _resume: boolean = false,
    _forcePick: boolean = false,
    mergeFailHandler: (err: Error) => void = errorHandler
): Promise<undefined | Error>;
```

**File:** `downloadReports.ts`

---

### disconnect

```ts
/**
 * @description Disconnect socket.io from server
 * @returns {undefined | Error} Error if not connected
 */
export function disconnect(): undefined | Error;
```

**File:** `io.ts`

---

### \_startDownload

```ts
/**
 * @description Start backend download process (internal use only)
 * @param downloadRequest
 * @param downloadHandler
 * @param finishHandler
 * @returns {undefined | Error} Undefined if success, Error otherwise
 */
export function _startDownload(
    downloadRequest: iDownloadRequest,
    downloadHandler: (readings: iReadings[], downloadId: string) => void | Promise<void>,
    finishHandler: (downloadId: string) => void | Promise<void>
): undefined | Error;
```

**File:** `io.ts`

---

### connectAndListen

```ts
/**
 * @description Connect to socket.io and listen readings
 * @param connectHandler Is suggested to change UI Connection status
 * @param disconnectHandler Is suggested to handle changes in UI and to call connectAndListen() again
 * @param readingsHandler Is suggested to update the UI of the IoT data element
 * @param IOErrorHandler Is suggested to use default ErrorHandler (when receives error event)
 */
export function connectAndListen(
    connectHandler: () => void,
    disconnectHandler: () => void,
    readingsHandler: (readings: iReadings) => void,
    IOErrorHandler: (err: Error) => void = errorHandler
);
```

**File:** `io.ts`

---

### isConnected

```ts
/**
 * @description Get socket connection status
 * @returns {boolean}
 */
export function isConnected(): boolean;
```

**File:** `io.ts`

---

### setIsDownloading

```ts
/**
 * @description Change downloading status (internal use only)
 * @param {boolean} input
 */
export function setIsDownloading(input: boolean);
```

**File:** `io.ts`

---

### getIsDownloading

```ts
/**
 * @description Get current downloading status
 * @returns {boolean}
 */
export function getIsDownloading();
```

**File:** `io.ts`

---

### getSummaries

```ts
/**
 * @description Get last 7 days summaries
 * @returns {Promise<iSummaries[] | Error>}
 */
export async function getSummaries(): Promise<iSummaries[] | Error>;
```

**File:** `rest.ts`

> **Note:** Any undocumented functions are internal only.
> **Warning:** Several functions and parameters are not meant to be sent by the frontend.

---

## Error Handling

There are **three** custom error types:

### IOError

```ts
IOError(type: IOErrorEnum)

enum IOErrorEnum {
    NotConnected,
}
```

Used for **IO-related** errors.

---

### HTTPError

```ts
HTTPError(statusCode: number)
```

Used for **HTTP/REST** related errors.

---

### DownloadError

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

Used for **Download-related** errors.

---

### Default Error Handler

```ts
/**
 * @description Default handler for catching errors
 * @suggestion Show modal or alert to the UI
 */
function errorHandler(error: Error);
```

---

### Test Case

This test case must be checked when implementing new feature
Downloads Error test case:

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

Http Test Case:

```
- Server Down
```

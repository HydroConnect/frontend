export const enum UsageNotificationType {
    on = 1,
    off = 0,
}

interface iUsageNotification {
    type: UsageNotificationType;
    timestamp: number;
}

const usageNotificationSample: iUsageNotification = {
    type: UsageNotificationType.on,
    timestamp: Date.now(),
};

interface iUsageNotificationSQL extends iUsageNotification {
    notification_id: number;
}

const usageNotificationSQLSample: iUsageNotificationSQL = {
    ...usageNotificationSample,
    notification_id: 1,
};

export { usageNotificationSample, usageNotificationSQLSample };
export type { iUsageNotification, iUsageNotificationSQL };

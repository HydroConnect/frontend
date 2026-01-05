// Sync with BE
export const enum UsageNotificationType {
    on = 1,
    off = 0,
}

interface iUsageNotification {
    notificationId: number;
    type: UsageNotificationType;
    timestamp: number;
}

const usageNotificationSample: iUsageNotification = {
    notificationId: 1,
    type: UsageNotificationType.on,
    timestamp: Date.now(),
};

export { usageNotificationSample };
export type { iUsageNotification };

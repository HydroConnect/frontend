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

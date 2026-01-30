import * as Haptics from 'expo-haptics';

export const haptics = {
    tap: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    confirm: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    warn: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
} as const;

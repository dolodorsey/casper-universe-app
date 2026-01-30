import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Trigger a haptic feedback pattern
 * Safely handles platform availability
 */
export const HapticFeedback = {
    // Light tap (selection, toggle)
    light: () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    },

    // Medium tap (button press)
    medium: () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
    },

    // Heavy tap (success, major action)
    heavy: () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
    },

    // Success notification
    success: () => {
        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    },

    // Error notification
    error: () => {
        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    },

    // Warning notification
    warning: () => {
        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
    },

    // Custom selection (like scrolling a picker)
    selection: () => {
        if (Platform.OS !== 'web') {
            Haptics.selectionAsync();
        }
    }
};

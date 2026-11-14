import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Bell } from 'lucide-react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface DashboardHeaderProps {
  timeGreeting: string;
  userFirstName: string;
  avatarUrl?: string | null;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  timeGreeting,
  userFirstName,
  onNotificationPress,
  onProfilePress,
}) => {
  const isReducedMotion = useReducedMotion();

  const initials = userFirstName.slice(0, 2).toUpperCase();

  const Container = isReducedMotion ? View : Animated.View;
  const enteringAnim = isReducedMotion ? undefined : FadeInDown.duration(350);

  return (
    <Container style={styles.header} entering={enteringAnim} testID="dashboard-header">
      <View style={styles.textColumn}>
        <AppText variant="caption" color={colors.textSecondary} style={styles.greetingCaption}>
          {timeGreeting.toUpperCase()}
        </AppText>
        <AppText variant="h1" color={colors.text} style={styles.userName}>
          {timeGreeting}, {userFirstName}
        </AppText>
        <AppText variant="body" color={colors.textSecondary}>
          Ready to get stronger today?
        </AppText>
      </View>

      <View style={styles.actionRow}>
        {/* Notification Icon */}
        <Pressable
          style={styles.iconButton}
          onPress={onNotificationPress}
          accessibilityLabel="Notifications"
          testID="notification-button"
        >
          <Bell size={20} color={colors.text} />
          <View style={styles.notificationDot} />
        </Pressable>

        {/* Profile Avatar */}
        <Pressable
          style={styles.avatarButton}
          onPress={onProfilePress}
          accessibilityLabel="User profile"
          testID="header-avatar-button"
        >
          <AppText variant="caption" color={colors.primaryDeep} style={styles.avatarText}>
            {initials}
          </AppText>
        </Pressable>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  textColumn: {
    flex: 1,
    marginRight: spacing.sm,
  },
  greetingCaption: {
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  userName: {
    marginBottom: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 4,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  notificationDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.accent, // #F3BA60
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.primaryLavender, // #E0DBF3
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  avatarText: {
    fontWeight: '800',
    fontSize: 13,
  },
});


import React from 'react';
import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from './AppText';

export interface SelectionCardProps {
  title: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
  badge?: string;
  style?: ViewStyle;
  testID?: string;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  title,
  description,
  selected,
  onPress,
  icon,
  badge,
  style,
  testID,
}) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${title}${badge ? `, ${badge}` : ''}${description ? `. ${description}` : ''}`}
      testID={testID}
      style={({ pressed }) => [
        styles.card,
        selected ? styles.cardSelected : styles.cardUnselected,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.content}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <AppText variant="h3" style={selected ? styles.titleSelected : styles.titleUnselected}>
              {title}
            </AppText>
            {badge && (
              <View style={styles.badge}>
                <AppText variant="caption" style={styles.badgeText}>
                  {badge}
                </AppText>
              </View>
            )}
          </View>
          {description && (
            <AppText
              variant="body"
              style={selected ? styles.descSelected : styles.descUnselected}
            >
              {description}
            </AppText>
          )}
        </View>
      </View>
      <View style={[styles.indicator, selected && styles.indicatorSelected]}>
        {selected && <View style={styles.indicatorInner} />}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.card,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.xs,
    borderWidth: 2,
  },
  cardUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.borderLight,
  },
  cardSelected: {
    backgroundColor: colors.primaryLavender,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  iconContainer: {
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleUnselected: {
    color: colors.text,
  },
  titleSelected: {
    color: colors.primaryDeep,
    fontWeight: '700',
  },
  descUnselected: {
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  descSelected: {
    color: colors.text,
    marginTop: spacing.xxs,
  },
  badge: {
    backgroundColor: colors.accentMuted,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.full,
    marginLeft: spacing.xs,
  },
  badgeText: {
    color: '#8A5D10',
    fontWeight: '600',
  },
  indicator: {
    width: 22,
    height: 22,
    borderRadius: radii.full,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  indicatorInner: {
    width: 8,
    height: 8,
    borderRadius: radii.full,
    backgroundColor: colors.textInverse,
  },
});


import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { SkillEquipmentRequirement } from '@/domain/models/skill.model';

interface SkillEquipmentNoticeProps {
  equipmentRequired: SkillEquipmentRequirement;
  isAvailable: boolean;
  unavailabilityReason?: string;
}

export const SkillEquipmentNotice: React.FC<SkillEquipmentNoticeProps> = ({
  equipmentRequired,
  isAvailable,
  unavailabilityReason,
}) => {
  if (equipmentRequired === 'none') {
    return (
      <View style={styles.noEquipmentContainer} testID="no-equipment-notice">
        <CheckCircle2 size={16} color={colors.primaryDeep} />
        <View style={styles.textColumn}>
          <AppText variant="caption" color={colors.primaryDeep} style={styles.title}>
            Zero Equipment Required
          </AppText>
          <AppText variant="caption" color={colors.textSecondary} style={styles.subtitle}>
            This skill pathway is 100% floor and bodyweight accessible anywhere.
          </AppText>
        </View>
      </View>
    );
  }

  if (!isAvailable) {
    return (
      <View style={styles.warningContainer} testID="equipment-missing-notice">
        <ShieldAlert size={18} color="#C94F55" />
        <View style={styles.textColumn}>
          <AppText variant="caption" color="#8B2A2F" style={styles.warningTitle}>
            Equipment Notice • {equipmentRequired === 'pull_up_bar' ? 'Pull-up Bar Required' : 'Vertical Pole Support Required'}
          </AppText>
          <AppText variant="caption" color={colors.text} style={styles.warningDesc}>
            {unavailabilityReason ||
              'This skill requires specialized equipment. You can still study the pathway or update equipment in Profile.'}
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.equippedContainer} testID="equipment-available-notice">
      <AlertCircle size={16} color={colors.primaryDeep} />
      <View style={styles.textColumn}>
        <AppText variant="caption" color={colors.primaryDeep} style={styles.title}>
          Equipment Check • {equipmentRequired === 'pull_up_bar' ? 'Pull-up Bar In Use' : 'Vertical Support Anchored'}
        </AppText>
        <AppText variant="caption" color={colors.textSecondary} style={styles.subtitle}>
          Ensure apparatus is firmly mounted and safety-checked before beginning practice.
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  noEquipmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#EDE9FA',
    padding: spacing.sm,
    borderRadius: radii.card,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#D4CCF0',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    backgroundColor: '#FAECEC',
    padding: spacing.sm,
    borderRadius: radii.card,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#E8B4B7',
  },
  equippedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#F3F0FA',
    padding: spacing.sm,
    borderRadius: radii.card,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  textColumn: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 11,
    lineHeight: 15,
  },
  warningTitle: {
    fontWeight: '800',
  },
  warningDesc: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
});


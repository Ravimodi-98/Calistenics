import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';

export interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      accessibilityViewIsModal={true}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View
              style={styles.dialogCard}
              accessible={true}
              accessibilityRole="alert"
              accessibilityLabel={`${title}. ${message}`}
            >
              <AppText variant="h2" color={colors.text} style={styles.title}>
                {title}
              </AppText>
              <AppText
                variant="body"
                color={colors.textSecondary}
                style={styles.message}
              >
                {message}
              </AppText>

              <View style={styles.buttonRow}>
                <View style={styles.buttonFlex}>
                  <AppButton
                    title={cancelLabel}
                    onPress={onCancel}
                    variant="secondary"
                    size="md"
                    disabled={isLoading}
                    testID="confirmation-cancel-btn"
                  />
                </View>
                <View style={styles.buttonFlex}>
                  <AppButton
                    title={confirmLabel}
                    onPress={onConfirm}
                    variant={isDestructive ? 'destructive' : 'primary'}
                    size="md"
                    loading={isLoading}
                    testID="confirmation-confirm-btn"
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(32, 32, 34, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: radii.card,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    marginBottom: spacing.xs,
  },
  message: {
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  buttonFlex: {
    flex: 1,
  },
});

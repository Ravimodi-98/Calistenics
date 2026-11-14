import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { colors, spacing, radii } from '@/theme';
import { AppText, AppButton, AppInput, ScreenContainer } from '@/components';
import { forgotPasswordSchema, ForgotPasswordInput } from '@/domain/schemas/auth.schema';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword, isLoading } = useAuthStore();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordInput) => {
    setServerError(null);
    try {
      await resetPassword(values.email);
      setSubmittedEmail(values.email);
    } catch (err: any) {
      setServerError(err.message || 'Unable to send recovery email. Please try again.');
    }
  };

  const handleResend = async () => {
    if (!submittedEmail) return;
    setServerError(null);
    try {
      await resetPassword(submittedEmail);
    } catch (err: any) {
      setServerError(err.message || 'Failed to resend recovery email.');
    }
  };

  return (
    <ScreenContainer scrollable padded>
      <View style={styles.header}>
        <AppText variant="h1" color={colors.text}>
          Reset Password
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
          Enter your registered email address to receive password recovery instructions.
        </AppText>
      </View>

      {serverError && (
        <View style={styles.errorBanner} accessibilityRole="alert">
          <AppText variant="caption" style={styles.errorBannerText}>
            {serverError}
          </AppText>
        </View>
      )}

      {submittedEmail ? (
        <View style={styles.confirmationCard} accessibilityRole="summary">
          <View style={styles.badge}>
            <AppText variant="caption" style={styles.badgeText}>
              EMAIL SENT
            </AppText>
          </View>
          <AppText variant="h2" color={colors.primaryDeep} style={styles.confirmTitle}>
            Check Your Inbox
          </AppText>
          <AppText variant="body" color={colors.text} style={styles.confirmBody}>
            We sent a password recovery link to{' '}
            <AppText variant="body" style={styles.boldEmail}>
              {submittedEmail}
            </AppText>
            . Open the link to set a new password.
          </AppText>

          <View style={styles.successActions}>
            <AppButton
              title="Resend Recovery Email"
              onPress={handleResend}
              loading={isLoading}
              variant="secondary"
              size="md"
              style={styles.resendButton}
              testID="forgot-resend-button"
            />
            <AppButton
              title="Return to Sign In"
              onPress={() => router.replace('/(auth)/sign-in')}
              variant="primary"
              size="md"
              style={styles.backButton}
              testID="forgot-back-to-signin-button"
            />
          </View>
        </View>
      ) : (
        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Email Address"
                placeholder="alex@example.com"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                keyboardType="email-address"
                error={errors.email?.message}
                testID="forgot-email-input"
              />
            )}
          />

          <AppButton
            title="Send Recovery Link"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            variant="primary"
            size="lg"
            style={styles.submitButton}
            testID="forgot-submit-button"
          />

          <AppButton
            title="Cancel"
            onPress={() => router.back()}
            variant="ghost"
            size="md"
            style={styles.cancelButton}
            testID="forgot-cancel-button"
          />
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  subtitle: {
    marginTop: spacing.xxs,
    lineHeight: 22,
  },
  errorBanner: {
    backgroundColor: colors.errorMuted,
    borderWidth: 1,
    borderColor: colors.error,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  errorBannerText: {
    color: colors.error,
    fontWeight: '600',
    lineHeight: 18,
  },
  form: {
    marginVertical: spacing.xs,
  },
  submitButton: {
    marginTop: spacing.lg,
  },
  cancelButton: {
    marginTop: spacing.xs,
  },
  confirmationCard: {
    backgroundColor: colors.primaryLavender,
    borderRadius: radii.card,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#D4CCF0',
    marginTop: spacing.md,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.full,
    marginBottom: spacing.sm,
  },
  badgeText: {
    color: colors.primaryDeep,
    fontWeight: '700',
  },
  confirmTitle: {
    marginBottom: spacing.xs,
  },
  confirmBody: {
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  boldEmail: {
    fontWeight: '700',
    color: colors.primaryDeep,
  },
  successActions: {
    gap: spacing.sm,
  },
  resendButton: {
    backgroundColor: colors.surface,
  },
  backButton: {
    marginTop: spacing.xxs,
  },
});

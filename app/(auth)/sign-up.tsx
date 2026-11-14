import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { colors, spacing } from '@/theme';
import { AppText, AppButton, AppInput, ScreenContainer } from '@/components';
import { signUpSchema, SignUpInput } from '@/domain/schemas/auth.schema';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, isLoading } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: SignUpInput) => {
    setServerError(null);
    try {
      const result = await signUp(values);
      if (result.needsEmailVerification) {
        router.replace('/(auth)/verify-email');
      } else {
        router.replace('/(onboarding)/experience');
      }
    } catch (err: any) {
      setServerError(err.message || 'Unable to complete registration.');
    }
  };

  return (
    <ScreenContainer scrollable padded>
      <View style={styles.header}>
        <AppText variant="h1" color={colors.text}>
          Create Account
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
          Join Calisthenics Coach to build foundational strength and master bodyweight movements.
        </AppText>
      </View>

      {serverError && (
        <View style={styles.errorBanner} accessibilityRole="alert">
          <AppText variant="caption" style={styles.errorBannerText}>
            {serverError}
          </AppText>
        </View>
      )}

      <View style={styles.form}>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Full Name"
              placeholder="e.g. Alex Hunter"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.fullName?.message}
              testID="signup-fullname-input"
            />
          )}
        />

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
              testID="signup-email-input"
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Password (min 6 characters)"
              placeholder="Create a strong password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              error={errors.password?.message}
              testID="signup-password-input"
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Confirm Password"
              placeholder="Repeat your password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              error={errors.confirmPassword?.message}
              testID="signup-confirmpassword-input"
            />
          )}
        />

        <AppButton
          title="Create Account"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          variant="primary"
          size="lg"
          style={styles.submitButton}
          testID="signup-submit-button"
        />
      </View>

      <View style={styles.footer}>
        <AppText variant="body" color={colors.textSecondary}>
          Already have an account?{' '}
        </AppText>
        <AppButton
          title="Sign In"
          onPress={() => router.push('/(auth)/sign-in')}
          variant="ghost"
          size="sm"
          fullWidth={false}
          testID="signup-go-to-signin"
        />
      </View>
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
});

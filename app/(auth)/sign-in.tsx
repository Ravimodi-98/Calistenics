import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { colors, spacing } from '@/theme';
import { AppText, AppButton, AppInput, ScreenContainer } from '@/components';
import { signInSchema, SignInInput } from '@/domain/schemas/auth.schema';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, isLoading } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: SignInInput) => {
    setServerError(null);
    try {
      await signIn(values);
      const profile = useAuthStore.getState().profile;
      const user = useAuthStore.getState().user;

      // Check email confirmation status if enabled
      if (user && !user.email_confirmed_at && user.confirmed_at === undefined && !user.last_sign_in_at) {
        // Unverified email check
        useAuthStore.getState().setPendingVerificationEmail(user.email || values.email);
        router.replace('/(auth)/verify-email');
        return;
      }

      if (profile?.onboarding_completed) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(onboarding)/welcome');
      }
    } catch (err: any) {
      setServerError(err.message || 'Invalid email or password.');
    }
  };

  return (
    <ScreenContainer scrollable padded>
      <View style={styles.header}>
        <AppText variant="h1" color={colors.text}>
          Welcome Back
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
          Sign in to resume your structured calisthenics training.
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
              testID="signin-email-input"
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Password"
              placeholder="Enter your password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              error={errors.password?.message}
              testID="signin-password-input"
            />
          )}
        />

        <View style={styles.forgotRow}>
          <AppButton
            title="Forgot Password?"
            onPress={() => router.push('/(auth)/forgot-password')}
            variant="ghost"
            size="sm"
            fullWidth={false}
            testID="signin-forgot-password-link"
          />
        </View>

        <AppButton
          title="Sign In"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          variant="primary"
          size="lg"
          style={styles.signInButton}
          testID="signin-submit-button"
        />
      </View>

      <View style={styles.footer}>
        <AppText variant="body" color={colors.textSecondary}>
          Don't have an account?{' '}
        </AppText>
        <AppButton
          title="Sign Up"
          onPress={() => router.push('/(auth)/sign-up')}
          variant="ghost"
          size="sm"
          fullWidth={false}
          testID="signin-go-to-signup"
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
  forgotRow: {
    alignItems: 'flex-end',
    marginVertical: spacing.xxs,
  },
  signInButton: {
    marginTop: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
});

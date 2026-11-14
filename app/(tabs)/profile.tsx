import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  User as UserIcon,
  Bell,
  Sliders,
  Shield,
  LogOut,
  Sparkles,
  Clock,
  Dumbbell,
  Calendar,
  Eye,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Save,
} from 'lucide-react-native';
import { colors, radii, spacing } from '@/theme';
import {
  AppText,
  AppCard,
  AppButton,
  AppInput,
  ScreenContainer,
} from '@/components';
import {
  ConfirmationDialog,
  SuccessBanner,
  LoadingSkeleton,
} from '@/components/feedback';
import { isEquipmentAvailable } from '@/domain/utils/equipment';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useNotificationStore } from '@/features/notifications/store/notificationStore';
import {
  useAccessibilityStore,
  ReducedMotionPreference,
} from '@/features/preferences/store/accessibilityPreferencesStore';
import { ExperienceLevel } from '@/domain/models/user.model';

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Mon' },
  { key: 'tuesday', label: 'Tue' },
  { key: 'wednesday', label: 'Wed' },
  { key: 'thursday', label: 'Thu' },
  { key: 'friday', label: 'Fri' },
  { key: 'saturday', label: 'Sat' },
  { key: 'sunday', label: 'Sun' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, profile, signOut, updateProfile, isLoading: authLoading } = useAuthStore();
  const {
    preferences: notifPrefs,
    permissionStatus,
    initialize: initNotifications,
    requestPermission,
    toggleCategory,
    updateReminderTime,
  } = useNotificationStore();
  const {
    reducedMotionPreference,
    setReducedMotionPreference,
    hapticsEnabled,
    setHapticsEnabled,
    initialize: initAccessibility,
  } = useAccessibilityStore();

  // Local editable state
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel>(
    (profile?.experience_level as ExperienceLevel) || 'beginner'
  );
  const [selectedDays, setSelectedDays] = useState<string[]>(
    profile?.training_days || ['monday', 'wednesday', 'friday']
  );
  const [hasPullUpBar, setHasPullUpBar] = useState<boolean>(
    isEquipmentAvailable(profile?.available_equipment, 'pull_up_bar')
  );
  const [reminderHour, setReminderHour] = useState<number>(notifPrefs?.reminder_hour ?? 8);
  const [reminderMinute, setReminderMinute] = useState<number>(notifPrefs?.reminder_minute ?? 0);

  // UI state
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    initAccessibility();
    if (user?.id) {
      initNotifications(user.id);
    }
  }, [user?.id, initAccessibility, initNotifications]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setSelectedLevel((profile.experience_level as ExperienceLevel) || 'beginner');
      setSelectedDays(profile.training_days || ['monday', 'wednesday', 'friday']);
      setHasPullUpBar(isEquipmentAvailable(profile.available_equipment, 'pull_up_bar'));
    }
  }, [profile]);

  useEffect(() => {
    if (notifPrefs) {
      setReminderHour(notifPrefs.reminder_hour);
      setReminderMinute(notifPrefs.reminder_minute);
    }
  }, [notifPrefs]);

  const handleSavePersonalInfo = async () => {
    if (!fullName.trim()) {
      Alert.alert('Validation Error', 'Full name cannot be blank.');
      return;
    }

    setIsSavingProfile(true);
    try {
      await updateProfile({ full_name: fullName.trim() });
      setIsEditingName(false);
      setSuccessMessage('Profile name updated successfully.');
    } catch {
      Alert.alert('Update Failed', 'Could not save profile name.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleToggleTrainingDay = async (dayKey: string) => {
    let updated: string[];
    if (selectedDays.includes(dayKey)) {
      if (selectedDays.length <= 1) {
        Alert.alert('Minimum Schedule', 'Please select at least 1 training day.');
        return;
      }
      updated = selectedDays.filter((d) => d !== dayKey);
    } else {
      updated = [...selectedDays, dayKey];
    }
    setSelectedDays(updated);
    try {
      await updateProfile({ training_days: updated });
      if (user?.id) {
        useNotificationStore.getState().syncNotificationSchedules(user.id, updated);
      }
      setSuccessMessage('Training schedule updated.');
    } catch {
      // Ignored
    }
  };

  const handleSelectExperience = async (level: ExperienceLevel) => {
    setSelectedLevel(level);
    try {
      await updateProfile({ experience_level: level });
      setSuccessMessage(`Experience level set to ${level.toUpperCase()}.`);
    } catch {
      // Ignored
    }
  };

  const handleToggleEquipment = async (enablePullUpBar: boolean) => {
    setHasPullUpBar(enablePullUpBar);
    const updatedEquipment = enablePullUpBar ? ['none', 'pull_up_bar'] : ['none'];
    try {
      await updateProfile({ available_equipment: updatedEquipment });
      setSuccessMessage(
        enablePullUpBar
          ? 'Pull-up bar added to available equipment.'
          : 'Equipment set to No Equipment (bodyweight only).'
      );
    } catch {
      // Ignored
    }
  };

  const handleHourStep = async (delta: number) => {
    if (!user?.id) return;
    const nextHour = (reminderHour + delta + 24) % 24;
    setReminderHour(nextHour);
    await updateReminderTime(user.id, nextHour, reminderMinute);
    setSuccessMessage(`Reminder time set to ${formatTime(nextHour, reminderMinute)}.`);
  };

  const handleMinuteStep = async (delta: number) => {
    if (!user?.id) return;
    const nextMinute = (reminderMinute + delta + 60) % 60;
    setReminderMinute(nextMinute);
    await updateReminderTime(user.id, reminderHour, nextMinute);
    setSuccessMessage(`Reminder time set to ${formatTime(reminderHour, nextMinute)}.`);
  };

  const formatTime = (h: number, m: number) => {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    const minPadded = m < 10 ? `0${m}` : `${m}`;
    return `${hour12}:${minPadded} ${ampm}`;
  };

  const handleSignOutConfirm = async () => {
    setShowSignOutDialog(false);
    try {
      await signOut();
      router.replace('/(auth)/welcome');
    } catch {
      Alert.alert('Sign Out Failed', 'Unable to sign out. Please check your connection.');
    }
  };

  return (
    <ScreenContainer scrollable>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <AppText variant="h1" color={colors.text}>
            Settings & Profile
          </AppText>
          <AppText variant="body" color={colors.textSecondary} style={styles.headerSubtitle}>
            Manage your credentials, training routines, notifications, and accessibility preferences.
          </AppText>
        </View>

        {/* SUCCESS NOTIFICATION TOAST */}
        {successMessage && (
          <SuccessBanner
            message={successMessage}
            onDismiss={() => setSuccessMessage(null)}
          />
        )}

        {/* ========================================================================= */}
        {/* 1. PERSONAL INFORMATION */}
        {/* ========================================================================= */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <UserIcon size={18} color={colors.primaryDeep} />
            <AppText variant="h2" color={colors.text} style={styles.sectionTitle}>
              Personal Information
            </AppText>
          </View>

          <AppCard variant="lavender" style={styles.userCard}>
            <View style={styles.userRow}>
              <View
                style={styles.avatar}
                accessible={true}
                accessibilityRole="image"
                accessibilityLabel="Athlete profile avatar"
              >
                <AppText variant="h2" color={colors.primaryDeep}>
                  {(fullName || user?.email || 'A').charAt(0).toUpperCase()}
                </AppText>
              </View>

              <View style={styles.userInfo}>
                {isEditingName ? (
                  <View style={styles.editNameRow}>
                    <AppInput
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="Enter full name"
                      containerStyle={styles.nameInputContainer}
                      autoFocus
                    />
                    <AppButton
                      title="Save"
                      onPress={handleSavePersonalInfo}
                      loading={isSavingProfile}
                      size="sm"
                      fullWidth={false}
                      style={styles.saveNameBtn}
                    />
                  </View>
                ) : (
                  <View style={styles.nameRow}>
                    <AppText variant="h3" color={colors.primaryDeep} style={styles.userName}>
                      {fullName || 'Calisthenics Athlete'}
                    </AppText>
                    <Pressable
                      onPress={() => setIsEditingName(true)}
                      style={styles.editPill}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel="Edit profile name"
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <AppText variant="caption" color={colors.primaryDeep} style={styles.editPillText}>
                        Edit
                      </AppText>
                    </Pressable>
                  </View>
                )}

                <AppText variant="body" color={colors.text} style={styles.userEmail}>
                  {user?.email || 'No email attached'}
                </AppText>

                <View style={styles.badgeRow}>
                  <View style={styles.statusPill}>
                    <CheckCircle2 size={12} color="#065F46" />
                    <AppText variant="caption" color="#065F46" style={styles.statusPillText}>
                      Email {user?.email_confirmed_at ? 'Verified' : 'Active'}
                    </AppText>
                  </View>
                </View>
              </View>
            </View>
          </AppCard>
        </View>

        {/* ========================================================================= */}
        {/* 2. TRAINING PREFERENCES */}
        {/* ========================================================================= */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Dumbbell size={18} color={colors.primaryDeep} />
            <AppText variant="h2" color={colors.text} style={styles.sectionTitle}>
              Training Preferences
            </AppText>
          </View>
          <AppText variant="caption" color={colors.textSecondary} style={styles.sectionSubtitle}>
            Customizes your daily recommended routines and progression pathways.
          </AppText>

          {/* Experience Level */}
          <AppCard variant="default" style={styles.prefCard}>
            <AppText variant="h3" color={colors.text} style={styles.itemTitle}>
              Experience Level
            </AppText>
            <View style={styles.segmentedRow}>
              {(['beginner', 'intermediate', 'advanced'] as ExperienceLevel[]).map((level) => {
                const isSelected = selectedLevel === level;
                return (
                  <Pressable
                    key={level}
                    onPress={() => handleSelectExperience(level)}
                    style={[
                      styles.segmentBtn,
                      isSelected && styles.segmentBtnActive,
                    ]}
                    accessible={true}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={`${level} experience level`}
                  >
                    <AppText
                      variant="caption"
                      color={isSelected ? '#FFFFFF' : colors.text}
                      style={styles.segmentText}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </AppCard>

          {/* Training Days */}
          <AppCard variant="default" style={styles.prefCard}>
            <AppText variant="h3" color={colors.text} style={styles.itemTitle}>
              Weekly Training Days
            </AppText>
            <AppText variant="caption" color={colors.textSecondary} style={styles.itemSubtitle}>
              Tap days to schedule routine reminders ({selectedDays.length} days active).
            </AppText>
            <View style={styles.daysRow}>
              {DAYS_OF_WEEK.map(({ key, label }) => {
                const isActive = selectedDays.includes(key);
                return (
                  <Pressable
                    key={key}
                    onPress={() => handleToggleTrainingDay(key)}
                    style={[
                      styles.dayCircle,
                      isActive && styles.dayCircleActive,
                    ]}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                    accessibilityLabel={`${label}, ${isActive ? 'selected' : 'not selected'}`}
                  >
                    <AppText
                      variant="caption"
                      color={isActive ? '#FFFFFF' : colors.textSecondary}
                      style={styles.dayText}
                    >
                      {label}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </AppCard>

          {/* Equipment Selection */}
          <AppCard variant="default" style={styles.prefCard}>
            <View style={styles.switchRow}>
              <View style={styles.switchTextCol}>
                <AppText variant="h3" color={colors.text}>
                  Pull-up Bar Available
                </AppText>
                <AppText variant="caption" color={colors.textSecondary} style={styles.switchSubtext}>
                  {hasPullUpBar
                    ? 'Pull-up and bar progression exercises enabled.'
                    : 'No Equipment First: 100% floor-based bodyweight training.'}
                </AppText>
              </View>
              <Switch
                value={hasPullUpBar}
                onValueChange={handleToggleEquipment}
                trackColor={{ false: '#E5E7EB', true: colors.primary }}
                thumbColor="#FFFFFF"
                accessible={true}
                accessibilityRole="switch"
                accessibilityLabel="Pull-up bar equipment toggle"
              />
            </View>
          </AppCard>
        </View>

        {/* ========================================================================= */}
        {/* 3. NOTIFICATION SETTINGS */}
        {/* ========================================================================= */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Bell size={18} color={colors.primaryDeep} />
            <AppText variant="h2" color={colors.text} style={styles.sectionTitle}>
              Smart Notifications
            </AppText>
          </View>
          <AppText variant="caption" color={colors.textSecondary} style={styles.sectionSubtitle}>
            Helpful, respectful training reminders. Never spammy or shame-based.
          </AppText>

          {/* Permission Status Card */}
          <AppCard variant="default" style={styles.prefCard}>
            <View style={styles.switchRow}>
              <View style={styles.switchTextCol}>
                <AppText variant="h3" color={colors.text}>
                  System Notifications
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  Status: {permissionStatus.toUpperCase()}
                </AppText>
              </View>
              {permissionStatus !== 'granted' && (
                <AppButton
                  title="Enable"
                  onPress={() => user?.id && requestPermission(user.id)}
                  size="sm"
                  fullWidth={false}
                />
              )}
            </View>
          </AppCard>

          {/* Reminder Time Stepper */}
          <AppCard variant="default" style={styles.prefCard}>
            <View style={styles.timeRow}>
              <View style={styles.timeInfoCol}>
                <View style={styles.timeTitleRow}>
                  <Clock size={16} color={colors.primaryDeep} />
                  <AppText variant="h3" color={colors.text}>
                    Reminder Time
                  </AppText>
                </View>
                <AppText variant="caption" color={colors.textSecondary}>
                  Delivered on your scheduled training days.
                </AppText>
              </View>
              <View style={styles.stepperContainer}>
                {/* Hour */}
                <View style={styles.stepperCol}>
                  <Pressable
                    onPress={() => handleHourStep(1)}
                    style={styles.stepBtn}
                    accessible={true}
                    accessibilityLabel="Increase hour"
                  >
                    <AppText variant="body" color={colors.primaryDeep}>+</AppText>
                  </Pressable>
                  <AppText variant="h3" color={colors.text} style={styles.stepperVal}>
                    {reminderHour < 10 ? `0${reminderHour}` : reminderHour}
                  </AppText>
                  <Pressable
                    onPress={() => handleHourStep(-1)}
                    style={styles.stepBtn}
                    accessible={true}
                    accessibilityLabel="Decrease hour"
                  >
                    <AppText variant="body" color={colors.primaryDeep}>-</AppText>
                  </Pressable>
                </View>

                <AppText variant="h3" color={colors.text}>:</AppText>

                {/* Minute */}
                <View style={styles.stepperCol}>
                  <Pressable
                    onPress={() => handleMinuteStep(15)}
                    style={styles.stepBtn}
                    accessible={true}
                    accessibilityLabel="Increase minutes by 15"
                  >
                    <AppText variant="body" color={colors.primaryDeep}>+</AppText>
                  </Pressable>
                  <AppText variant="h3" color={colors.text} style={styles.stepperVal}>
                    {reminderMinute < 10 ? `0${reminderMinute}` : reminderMinute}
                  </AppText>
                  <Pressable
                    onPress={() => handleMinuteStep(-15)}
                    style={styles.stepBtn}
                    accessible={true}
                    accessibilityLabel="Decrease minutes by 15"
                  >
                    <AppText variant="body" color={colors.primaryDeep}>-</AppText>
                  </Pressable>
                </View>
              </View>
            </View>
          </AppCard>

          {/* Category Switches */}
          <AppCard variant="default" style={styles.prefCard}>
            <View style={styles.switchRow}>
              <View style={styles.switchTextCol}>
                <AppText variant="body" color={colors.text} style={styles.switchTitle}>
                  Daily Workout Reminders
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  Calm prompt when today is a scheduled training day.
                </AppText>
              </View>
              <Switch
                value={notifPrefs?.workout_reminders ?? true}
                onValueChange={() => {
                  if (user?.id) {
                    toggleCategory(user.id, 'workout_reminders');
                  }
                }}
                trackColor={{ false: '#E5E7EB', true: colors.primary }}
                thumbColor="#FFFFFF"
                accessible={true}
                accessibilityRole="switch"
                accessibilityLabel="Toggle workout reminders"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={styles.switchTextCol}>
                <AppText variant="body" color={colors.text} style={styles.switchTitle}>
                  Rest & Recovery Reminders
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  Encourages sleep, tendon density growth, and mobility.
                </AppText>
              </View>
              <Switch
                value={notifPrefs?.rest_day_reminders ?? true}
                onValueChange={() => {
                  if (user?.id) {
                    toggleCategory(user.id, 'rest_day_reminders');
                  }
                }}
                trackColor={{ false: '#E5E7EB', true: colors.primary }}
                thumbColor="#FFFFFF"
                accessible={true}
                accessibilityRole="switch"
                accessibilityLabel="Toggle rest day reminders"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={styles.switchTextCol}>
                <AppText variant="body" color={colors.text} style={styles.switchTitle}>
                  Technical Skill Reminders
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  Mid-week nudge to practice active skill hold progression stages.
                </AppText>
              </View>
              <Switch
                value={notifPrefs?.skill_reminders ?? true}
                onValueChange={() => {
                  if (user?.id) {
                    toggleCategory(user.id, 'skill_reminders');
                  }
                }}
                trackColor={{ false: '#E5E7EB', true: colors.primary }}
                thumbColor="#FFFFFF"
                accessible={true}
                accessibilityRole="switch"
                accessibilityLabel="Toggle skill reminders"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={styles.switchTextCol}>
                <AppText variant="body" color={colors.text} style={styles.switchTitle}>
                  Weekly Progress Summaries
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  Sunday summary celebrating genuine training consistency.
                </AppText>
              </View>
              <Switch
                value={notifPrefs?.weekly_summaries ?? true}
                onValueChange={() => {
                  if (user?.id) {
                    toggleCategory(user.id, 'weekly_summaries');
                  }
                }}
                trackColor={{ false: '#E5E7EB', true: colors.primary }}
                thumbColor="#FFFFFF"
                accessible={true}
                accessibilityRole="switch"
                accessibilityLabel="Toggle weekly summaries"
              />
            </View>
          </AppCard>
        </View>

        {/* ========================================================================= */}
        {/* 4. APP & ACCESSIBILITY PREFERENCES */}
        {/* ========================================================================= */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Sliders size={18} color={colors.primaryDeep} />
            <AppText variant="h2" color={colors.text} style={styles.sectionTitle}>
              Accessibility & Motion
            </AppText>
          </View>

          {/* Reduced Motion Setting */}
          <AppCard variant="default" style={styles.prefCard}>
            <AppText variant="h3" color={colors.text} style={styles.itemTitle}>
              Reduced Motion Preference
            </AppText>
            <AppText variant="caption" color={colors.textSecondary} style={styles.itemSubtitle}>
              When enabled, replaces dynamic vector animations with biomechanical alignment diagrams.
            </AppText>
            <View style={styles.segmentedRow}>
              {(
                [
                  { key: 'system', label: 'System Default' },
                  { key: 'always_reduce', label: 'Always Reduce' },
                  { key: 'always_motion', label: 'Full Motion' },
                ] as { key: ReducedMotionPreference; label: string }[]
              ).map(({ key, label }) => {
                const isSelected = reducedMotionPreference === key;
                return (
                  <Pressable
                    key={key}
                    onPress={() => {
                      setReducedMotionPreference(key);
                      setSuccessMessage(`Motion setting: ${label}`);
                    }}
                    style={[
                      styles.segmentBtn,
                      isSelected && styles.segmentBtnActive,
                    ]}
                    accessible={true}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={label}
                  >
                    <AppText
                      variant="caption"
                      color={isSelected ? '#FFFFFF' : colors.text}
                      style={styles.segmentText}
                    >
                      {label}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </AppCard>

          {/* Haptic Feedback */}
          <AppCard variant="default" style={styles.prefCard}>
            <View style={styles.switchRow}>
              <View style={styles.switchTextCol}>
                <AppText variant="h3" color={colors.text}>
                  Haptic Feedback
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  Tactile pulses on timer completions and set logs.
                </AppText>
              </View>
              <Switch
                value={hapticsEnabled}
                onValueChange={(val) => {
                  setHapticsEnabled(val);
                  setSuccessMessage(val ? 'Haptics enabled' : 'Haptics disabled');
                }}
                trackColor={{ false: '#E5E7EB', true: colors.primary }}
                thumbColor="#FFFFFF"
                accessible={true}
                accessibilityRole="switch"
                accessibilityLabel="Toggle haptic feedback"
              />
            </View>
          </AppCard>

          {/* 2D Motion Showcase Link */}
          <AppCard variant="default" style={styles.prefCard}>
            <Pressable
              onPress={() => router.push('/animation-demo')}
              style={styles.navRow}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Open 2D Animation & Design Showcase"
            >
              <View style={styles.navTextCol}>
                <AppText variant="h3" color={colors.text}>
                  Design & 2D Motion Demo
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  Inspect light palette tokens and kinematic loops.
                </AppText>
              </View>
              <ChevronRight size={18} color={colors.primaryDeep} />
            </Pressable>
          </AppCard>
        </View>

        {/* ========================================================================= */}
        {/* 5. ACCOUNT & SECURITY */}
        {/* ========================================================================= */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Shield size={18} color={colors.primaryDeep} />
            <AppText variant="h2" color={colors.text} style={styles.sectionTitle}>
              Privacy & Account
            </AppText>
          </View>

          <AppCard variant="default" style={styles.prefCard}>
            <AppText variant="h3" color={colors.text} style={styles.itemTitle}>
              Data Sovereignty & Privacy
            </AppText>
            <AppText variant="body" color={colors.textSecondary} style={styles.privacyText}>
              Calisthenics Coach enforces PostgreSQL Row-Level Security (RLS) on all user data.
              Your workout logs, skill metrics, and preferences are isolated strictly to your
              authenticated account. Zero third-party advertising trackers.
            </AppText>
          </AppCard>

          {/* Sign Out Trigger */}
          <View style={styles.signOutWrapper}>
            <AppButton
              title="Sign Out"
              onPress={() => setShowSignOutDialog(true)}
              loading={authLoading}
              variant="destructive"
              size="md"
              icon={<LogOut size={18} color="#FFFFFF" />}
              testID="profile-sign-out-button"
            />
          </View>
        </View>

        {/* CONFIRMATION DIALOG FOR SIGN OUT */}
        <ConfirmationDialog
          visible={showSignOutDialog}
          title="Sign Out"
          message="Are you sure you want to sign out? Your training data remains securely saved on Supabase."
          confirmLabel="Sign Out"
          cancelLabel="Cancel"
          isDestructive
          onConfirm={handleSignOutConfirm}
          onCancel={() => setShowSignOutDialog(false)}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl * 2,
  },
  header: {
    marginBottom: spacing.md,
  },
  headerSubtitle: {
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 2,
  },
  sectionTitle: {
    fontWeight: '700',
  },
  sectionSubtitle: {
    marginBottom: spacing.sm,
  },
  userCard: {
    padding: spacing.md,
    borderRadius: radii.card,
    marginTop: spacing.xs,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radii.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: '700',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  nameInputContainer: {
    flex: 1,
    marginVertical: 0,
  },
  saveNameBtn: {
    minHeight: 40,
  },
  editPill: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editPillText: {
    fontWeight: '600',
    fontSize: 10,
  },
  userEmail: {
    marginTop: 2,
    fontSize: 13,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  statusPillText: {
    fontWeight: '600',
    fontSize: 10,
  },
  prefCard: {
    padding: spacing.md,
    borderRadius: radii.card,
    marginBottom: spacing.sm,
  },
  itemTitle: {
    marginBottom: spacing.xxs,
  },
  itemSubtitle: {
    marginBottom: spacing.sm,
  },
  segmentedRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F0F5',
    borderRadius: radii.sm,
    padding: 3,
    gap: 4,
    marginTop: spacing.xs,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.xs,
    minHeight: 44, // Minimum touch target guideline
  },
  segmentBtnActive: {
    backgroundColor: colors.primaryDeep,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontWeight: '600',
    fontSize: 11,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  dayCircle: {
    width: 44, // 44px minimum touch target
    height: 44,
    borderRadius: radii.full,
    backgroundColor: '#F3F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6E4EB',
  },
  dayCircleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDeep,
  },
  dayText: {
    fontWeight: '700',
    fontSize: 11,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchTextCol: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  switchTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  switchSubtext: {
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F0F5',
    marginVertical: spacing.sm,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeInfoCol: {
    flex: 1,
  },
  timeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 2,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#F8F7FC',
    padding: spacing.xs,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  stepperCol: {
    alignItems: 'center',
  },
  stepBtn: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    minHeight: 28,
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperVal: {
    fontWeight: '700',
    fontSize: 16,
    marginVertical: 2,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44, // Minimum touch target guideline
  },
  navTextCol: {
    flex: 1,
  },
  privacyText: {
    lineHeight: 20,
    fontSize: 13,
  },
  signOutWrapper: {
    marginTop: spacing.md,
  },
});

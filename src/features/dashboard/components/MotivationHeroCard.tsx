import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  FadeInDown,
} from 'react-native-reanimated';
import { Sparkles, RefreshCw } from 'lucide-react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ExerciseAnimation } from '@/animations/components/ExerciseAnimation';

// Sample 2D calisthenics animation
const sampleExerciseJson = require('@/animations/assets/sample-exercise.json');

const MOTIVATIONAL_QUOTES = [
  'Every rep brings you closer to becoming stronger.',
  'Master basic bodyweight leverage before adding equipment.',
  'Consistency on the floor builds resilience for a lifetime.',
  'True strength is controlling your own body in space.',
  'Patience and strict form defeat rushed repetitions.',
];

export const MotivationHeroCard: React.FC = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const isReducedMotion = useReducedMotion();

  // Subtle pulsing glow for decorative background shape
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (isReducedMotion) return;

    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [isReducedMotion, pulseScale]);

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  return (
    <Animated.View
      style={styles.card}
      entering={isReducedMotion ? undefined : FadeInDown.delay(100).duration(400)}
      testID="motivation-hero-card"
    >
      {/* Decorative soft circles */}
      <Animated.View style={[styles.circleShape, styles.circleOne, animatedCircleStyle]} />
      <View style={[styles.circleShape, styles.circleTwo]} />

      <View style={styles.contentRow}>
        <View style={styles.textContainer}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Sparkles size={12} color="#8A5D10" />
              <AppText variant="caption" color="#5C3E0A" style={styles.badgeText}>
                BODYWEIGHT MINDSET
              </AppText>
            </View>
          </View>

          <AppText variant="h2" color={colors.primaryDeep} style={styles.title}>
            Your Body Is Your Equipment
          </AppText>

          <AppText variant="body" color={colors.text} style={styles.quoteText}>
            "{MOTIVATIONAL_QUOTES[quoteIndex]}"
          </AppText>

          <Pressable
            style={styles.rotateButton}
            onPress={handleNextQuote}
            accessibilityLabel="Show next motivational quote"
            testID="rotate-quote-button"
          >
            <RefreshCw size={12} color={colors.primaryDeep} />
            <AppText variant="caption" color={colors.primaryDeep} style={styles.rotateText}>
              New Thought
            </AppText>
          </Pressable>
        </View>

        {/* 2D Calisthenics Athlete Animation */}
        <View style={styles.animationWrapper} testID="hero-animation-wrapper">
          <ExerciseAnimation
            source={sampleExerciseJson}
            height={110}
            width={110}
            loop={true}
            autoPlay={true}
            fallbackText="Athlete"
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primaryLavender, // #E0DBF3 Lavender
    borderRadius: radii.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#D4CDEE',
  },
  circleShape: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.25,
  },
  circleOne: {
    width: 160,
    height: 160,
    backgroundColor: colors.primary,
    top: -40,
    right: -20,
  },
  circleTwo: {
    width: 100,
    height: 100,
    backgroundColor: colors.accent,
    bottom: -30,
    left: -20,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  textContainer: {
    flex: 1,
    paddingRight: spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.accentMuted,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  title: {
    marginBottom: 4,
    fontSize: 19,
    lineHeight: 24,
  },
  quoteText: {
    fontStyle: 'italic',
    lineHeight: 18,
    fontSize: 13,
    marginBottom: spacing.xs,
    color: colors.text,
  },
  rotateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingVertical: 2,
  },
  rotateText: {
    fontWeight: '700',
    fontSize: 11,
  },
  animationWrapper: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


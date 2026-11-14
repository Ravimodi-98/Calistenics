import React, { useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';
import { Play, Pause, RotateCcw, Gauge, Layers } from 'lucide-react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { StaticExerciseDiagram, ExerciseDiagramPattern } from './StaticExerciseDiagram';
import { AnimatedVectorAthlete } from './AnimatedVectorAthlete';
import {
  getExerciseAnimationSource,
  getExerciseAnimationMeta,
} from '../registry/exerciseAnimationRegistry';

export interface ExerciseAnimationProps {
  source?: any;
  slug?: string;
  fallbackText?: string;
  exerciseName?: string;
  diagramPattern?: ExerciseDiagramPattern;
  isHold?: boolean;
  isSkill?: boolean;
  progressionStage?: string;
  autoPlay?: boolean;
  loop?: boolean;
  speed?: number;
  height?: number;
  width?: number;
  preferVectorAthlete?: boolean;
  style?: ViewStyle;
}

export const ExerciseAnimation: React.FC<ExerciseAnimationProps> = ({
  source,
  slug,
  fallbackText = 'Exercise Demonstration',
  exerciseName = 'Movement Demonstration',
  diagramPattern,
  isHold: explicitIsHold,
  isSkill: explicitIsSkill,
  progressionStage: explicitProgressionStage,
  autoPlay = true,
  loop = true,
  speed: initialSpeed = 1.0,
  height = 240,
  width,
  preferVectorAthlete = false,
  style,
}) => {
  const animationRef = useRef<LottieView>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [speed, setSpeed] = useState<number>(initialSpeed);
  const [hasError, setHasError] = useState(false);
  const [useVectorMode, setUseVectorMode] = useState(preferVectorAthlete);
  const isReducedMotion = useReducedMotion();

  // Resolve metadata if slug is provided
  const meta = useMemo(() => {
    return slug ? getExerciseAnimationMeta(slug) : null;
  }, [slug]);

  // Resolve animation source
  const resolvedSource = useMemo(() => {
    if (source) return source;
    if (slug) return getExerciseAnimationSource(slug);
    return null;
  }, [source, slug]);

  const effectivePattern: ExerciseDiagramPattern =
    diagramPattern || meta?.diagramPattern || 'push_up';
  const effectiveName = exerciseName || meta?.name || 'Movement Demonstration';
  const isHold = explicitIsHold ?? meta?.isHold ?? false;
  const isSkill = explicitIsSkill ?? meta?.isSkill ?? false;
  const progressionStage = explicitProgressionStage ?? meta?.progressionStage;

  const togglePlayback = () => {
    if (isPlaying) {
      animationRef.current?.pause();
      setIsPlaying(false);
    } else {
      animationRef.current?.resume();
      setIsPlaying(true);
    }
  };

  const replay = () => {
    animationRef.current?.reset();
    animationRef.current?.play();
    setIsPlaying(true);
  };

  const toggleSpeed = () => {
    const nextSpeed = speed === 1.0 ? 0.5 : 1.0;
    setSpeed(nextSpeed);
  };

  const toggleRenderMode = () => {
    setUseVectorMode((prev) => !prev);
  };

  // If reduced motion is enabled or error occurred, render static fallback diagram
  if (isReducedMotion || hasError || (!resolvedSource && !useVectorMode)) {
    return (
      <View
        style={[
          styles.container,
          { height, width: width || '100%' },
          styles.fallbackContainer,
          style,
        ]}
        accessibilityRole="image"
        accessibilityLabel={`${fallbackText} (Static Representation)`}
      >
        <StaticExerciseDiagram
          pattern={effectivePattern}
          exerciseName={effectiveName}
          height={height - 40}
        />
        <AppText variant="caption" style={styles.fallbackLabel}>
          {isReducedMotion ? 'Motion reduced — Biomechanical guide' : fallbackText}
        </AppText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height, width: width || '100%' }, style]}>
      {/* Animation Stage: Vector Engine or Lottie */}
      {useVectorMode ? (
        <View style={styles.vectorStage} testID="vector-athlete-stage">
          <AnimatedVectorAthlete
            pattern={effectivePattern}
            exerciseName={effectiveName}
            isHold={isHold}
            isSkill={isSkill}
            progressionNote={progressionStage}
            speed={speed}
            isPlaying={isPlaying}
            height={height - 48}
          />
        </View>
      ) : (
        <LottieView
          ref={animationRef}
          source={resolvedSource}
          autoPlay={autoPlay}
          loop={loop}
          speed={speed}
          style={styles.lottie}
          onAnimationFailure={() => setHasError(true)}
          testID="lottie-animation-view"
        />
      )}

      {/* Badges Overlay (Skill Progression & Dynamic Tempo) */}
      <View style={styles.badgeRow}>
        {isSkill && (
          <View style={styles.skillPill} testID="skill-progression-badge">
            <AppText variant="caption" color={colors.primaryDeep} style={styles.skillBadgeText}>
              {progressionStage || 'Skill Progression'}
            </AppText>
          </View>
        )}
        <View style={styles.tempoPill} testID="tempo-badge">
          <AppText variant="caption" color={colors.textSecondary} style={styles.tempoBadgeText}>
            {isHold ? 'Isometric Hold' : meta?.loopConfig.tempo || '2-0-1-0 Tempo'}
          </AppText>
        </View>
      </View>

      {/* Control Overlay */}
      <View style={styles.controlsRow}>
        {/* Vector / Lottie Mode Toggle */}
        <Pressable
          onPress={toggleRenderMode}
          accessibilityRole="button"
          accessibilityLabel={useVectorMode ? 'Switch to 2D Lottie Vector' : 'Switch to Articulated Engine'}
          style={({ pressed }) => [
            styles.controlButton,
            pressed && styles.controlButtonPressed,
            useVectorMode && styles.activeModeButton,
          ]}
          testID="render-mode-toggle-button"
        >
          <Layers size={12} color={useVectorMode ? '#FFFFFF' : colors.primaryDeep} />
          <AppText
            variant="caption"
            color={useVectorMode ? '#FFFFFF' : colors.primaryDeep}
            style={styles.controlText}
          >
            {useVectorMode ? 'Kinematic' : 'Vector 2D'}
          </AppText>
        </Pressable>

        {/* Speed Toggle (1.0x vs 0.5x Slow-Mo) */}
        <Pressable
          onPress={toggleSpeed}
          accessibilityRole="button"
          accessibilityLabel={`Speed ${speed}x`}
          style={({ pressed }) => [
            styles.controlButton,
            pressed && styles.controlButtonPressed,
            speed === 0.5 && styles.activeSpeedButton,
          ]}
          testID="speed-toggle-button"
        >
          <Gauge size={12} color={speed === 0.5 ? '#FFFFFF' : colors.primaryDeep} />
          <AppText
            variant="caption"
            color={speed === 0.5 ? '#FFFFFF' : colors.primaryDeep}
            style={styles.controlText}
          >
            {speed}x
          </AppText>
        </Pressable>

        {/* Play/Pause */}
        <Pressable
          onPress={togglePlayback}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pause animation' : 'Play animation'}
          style={({ pressed }) => [
            styles.controlButton,
            pressed && styles.controlButtonPressed,
          ]}
          testID="play-pause-toggle-button"
        >
          {isPlaying ? (
            <Pause size={12} color={colors.primaryDeep} />
          ) : (
            <Play size={12} color={colors.primaryDeep} />
          )}
          <AppText variant="caption" style={styles.controlText}>
            {isPlaying ? 'Pause' : 'Play'}
          </AppText>
        </Pressable>

        {/* Replay */}
        <Pressable
          onPress={replay}
          accessibilityRole="button"
          accessibilityLabel="Replay animation"
          style={({ pressed }) => [
            styles.controlButton,
            pressed && styles.controlButtonPressed,
          ]}
          testID="replay-button"
        >
          <RotateCcw size={12} color={colors.primaryDeep} />
          <AppText variant="caption" style={styles.controlText}>
            Replay
          </AppText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAF8FE',
    borderRadius: radii.card,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  vectorStage: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackContainer: {
    padding: spacing.md,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  fallbackLabel: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  badgeRow: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    zIndex: 10,
  },
  skillPill: {
    backgroundColor: '#EAE5F8',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  skillBadgeText: {
    fontWeight: '700',
    fontSize: 9,
  },
  tempoPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  tempoBadgeText: {
    fontWeight: '600',
    fontSize: 9,
  },
  controlsRow: {
    position: 'absolute',
    bottom: spacing.xs,
    right: spacing.xs,
    flexDirection: 'row',
    gap: spacing.xs,
    zIndex: 10,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  controlButtonPressed: {
    backgroundColor: colors.primaryMuted,
  },
  activeSpeedButton: {
    backgroundColor: colors.primaryDeep,
    borderColor: colors.primaryDeep,
  },
  activeModeButton: {
    backgroundColor: colors.primaryDeep,
    borderColor: colors.primaryDeep,
  },
  controlText: {
    fontWeight: '600',
    fontSize: 10,
  },
});

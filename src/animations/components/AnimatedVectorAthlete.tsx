import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { ExerciseDiagramPattern } from './StaticExerciseDiagram';

interface AnimatedVectorAthleteProps {
  pattern: ExerciseDiagramPattern;
  exerciseName?: string;
  isHold?: boolean;
  isSkill?: boolean;
  progressionNote?: string;
  speed?: number;
  isPlaying?: boolean;
  width?: number;
  height?: number;
}

export const AnimatedVectorAthlete: React.FC<AnimatedVectorAthleteProps> = ({
  pattern,
  exerciseName = 'Movement Demonstration',
  isHold = false,
  isSkill = false,
  progressionNote,
  speed = 1.0,
  isPlaying = true,
  width = 280,
  height = 180,
}) => {
  // Phase progresses from 0 to 1 repeatedly
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 25; // 40fps smooth ticker
    const step = (intervalMs / (isHold ? 3000 : 2400)) * speed;

    const timer = setInterval(() => {
      setPhase((prev) => (prev + step) % 1);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, speed, isHold]);

  // Smooth sinusoidal factor between 0.0 and 1.0
  const t = (Math.sin(phase * Math.PI * 2 - Math.PI / 2) + 1) / 2;

  const athleteColor = colors.primary; // Brand Purple #8B70D6
  const jointColor = colors.primaryDeep; // Deep Purple #6E55B8
  const accentColor = colors.accent; // Orange #F3BA60
  const groundColor = '#B6B1C0'; // Neutral Ground

  const renderAthlete = () => {
    switch (pattern) {
      case 'push_up': {
        // High plank to chest-to-floor descent
        const descentY = 85 + t * 40;
        const elbowY = 105 + t * 25;
        const headY = 78 + t * 40;

        return (
          <Svg width={width} height={height} viewBox="0 0 280 180">
            {/* Ground Line */}
            <Line x1="20" y1="150" x2="260" y2="150" stroke={groundColor} strokeWidth="3" strokeLinecap="round" />
            {/* Feet / Toes pivot */}
            <Circle cx="50" cy="146" r="6" fill={accentColor} />
            {/* Straight Legs */}
            <Line x1="50" y1="146" x2="110" y2={descentY + 15} stroke={athleteColor} strokeWidth="7" strokeLinecap="round" />
            {/* Hips */}
            <Circle cx="110" cy={descentY + 15} r="7" fill={jointColor} />
            {/* Torso */}
            <Line x1="110" y1={descentY + 15} x2="180" y2={descentY} stroke={athleteColor} strokeWidth="9" strokeLinecap="round" />
            {/* Shoulders */}
            <Circle cx="180" cy={descentY} r="7" fill={jointColor} />
            {/* Head */}
            <Circle cx="205" cy={headY} r="10" fill={athleteColor} />
            {/* Arm articulation: shoulder -> elbow -> hand */}
            <Line x1="180" y1={descentY} x2="170" y2={elbowY} stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
            <Line x1="170" y1={elbowY} x2="182" y2="148" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
            <Circle cx="170" cy={elbowY} r="5" fill={jointColor} />
            <Circle cx="182" cy="148" r="5" fill={jointColor} />
          </Svg>
        );
      }

      case 'pull_up': {
        // Dead hang to chin over bar
        const pullY = 110 - t * 65;
        const headY = pullY - 20;

        return (
          <Svg width={width} height={height} viewBox="0 0 280 180">
            {/* Overhead Bar */}
            <Line x1="40" y1="25" x2="240" y2="25" stroke={groundColor} strokeWidth="5" strokeLinecap="round" />
            {/* Grip */}
            <Circle cx="115" cy="25" r="5" fill={accentColor} />
            <Circle cx="165" cy="25" r="5" fill={accentColor} />
            {/* Arms pulling */}
            <Line x1="115" y1="25" x2="128" y2={pullY} stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
            <Line x1="165" y1="25" x2="152" y2={pullY} stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
            {/* Head clearing bar */}
            <Circle cx="140" cy={headY} r="10" fill={athleteColor} />
            {/* Shoulders */}
            <Line x1="125" y1={pullY} x2="155" y2={pullY} stroke={jointColor} strokeWidth="7" strokeLinecap="round" />
            {/* Torso */}
            <Line x1="140" y1={pullY} x2="140" y2={pullY + 50} stroke={athleteColor} strokeWidth="9" strokeLinecap="round" />
            {/* Hips */}
            <Circle cx="140" cy={pullY + 50} r="6" fill={jointColor} />
            {/* Legs with slight forward hollow angle */}
            <Line x1="140" y1={pullY + 50} x2="145" y2={pullY + 95} stroke={athleteColor} strokeWidth="7" strokeLinecap="round" />
            <Circle cx="145" cy={pullY + 97} r="4" fill={accentColor} />
          </Svg>
        );
      }

      case 'squat': {
        // Standing to parallel squat descent
        const hipY = 100 + t * 45;
        const kneeX = 110 - t * 15;
        const headY = 45 + t * 45;

        return (
          <Svg width={width} height={height} viewBox="0 0 280 180">
            {/* Ground */}
            <Line x1="30" y1="160" x2="250" y2="160" stroke={groundColor} strokeWidth="3" strokeLinecap="round" />
            {/* Feet */}
            <Line x1="120" y1="158" x2="145" y2="158" stroke={jointColor} strokeWidth="6" strokeLinecap="round" />
            {/* Shin */}
            <Line x1="135" y1="158" x2={kneeX} y2="130" stroke={athleteColor} strokeWidth="7" strokeLinecap="round" />
            <Circle cx={kneeX} cy="130" r="6" fill={jointColor} />
            {/* Thigh */}
            <Line x1={kneeX} y1="130" x2="155" y2={hipY} stroke={athleteColor} strokeWidth="8" strokeLinecap="round" />
            <Circle cx="155" cy={hipY} r="7" fill={jointColor} />
            {/* Torso */}
            <Line x1="155" y1={hipY} x2="145" y2={headY + 20} stroke={athleteColor} strokeWidth="9" strokeLinecap="round" />
            {/* Head */}
            <Circle cx="145" cy={headY} r="10" fill={athleteColor} />
            {/* Arms extending for counterbalance */}
            <Line x1="145" y1={headY + 25} x2={100 - t * 10} y2={headY + 30} stroke={accentColor} strokeWidth="5" strokeLinecap="round" />
          </Svg>
        );
      }

      case 'lunge': {
        const dropY = 90 + t * 35;
        const headY = 45 + t * 35;

        return (
          <Svg width={width} height={height} viewBox="0 0 280 180">
            <Line x1="20" y1="160" x2="260" y2="160" stroke={groundColor} strokeWidth="3" strokeLinecap="round" />
            {/* Front foot */}
            <Circle cx="180" cy="158" r="5" fill={jointColor} />
            {/* Front shin & knee */}
            <Line x1="180" y1="158" x2="180" y2="120" stroke={athleteColor} strokeWidth="7" strokeLinecap="round" />
            <Line x1="180" y1="120" x2="140" y2={dropY} stroke={athleteColor} strokeWidth="7" strokeLinecap="round" />
            {/* Torso */}
            <Line x1="140" y1={dropY} x2="140" y2={headY + 20} stroke={athleteColor} strokeWidth="9" strokeLinecap="round" />
            <Circle cx="140" cy={headY} r="10" fill={athleteColor} />
            {/* Back leg dropping to 90 deg */}
            <Line x1="140" y1={dropY} x2="100" y2={dropY + 25} stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
            <Line x1="100" y1={dropY + 25} x2="80" y2="158" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
          </Svg>
        );
      }

      case 'plank': {
        // Subtle diaphragmatic breathing expansion
        const breathe = Math.sin(phase * Math.PI * 2) * 2;

        return (
          <Svg width={width} height={height} viewBox="0 0 280 180">
            <Line x1="20" y1="150" x2="260" y2="150" stroke={groundColor} strokeWidth="3" strokeLinecap="round" />
            {/* Toes */}
            <Circle cx="50" cy="146" r="6" fill={accentColor} />
            {/* Legs */}
            <Line x1="50" y1="146" x2="115" y2={125 + breathe} stroke={athleteColor} strokeWidth="7" strokeLinecap="round" />
            <Circle cx="115" cy={125 + breathe} r="7" fill={jointColor} />
            {/* Torso rigid line */}
            <Line x1="115" y1={125 + breathe} x2="185" y2={110 + breathe} stroke={athleteColor} strokeWidth="9" strokeLinecap="round" />
            {/* Shoulders */}
            <Circle cx="185" cy={110 + breathe} r="7" fill={jointColor} />
            {/* Forearm vertical to ground */}
            <Line x1="185" y1={110 + breathe} x2="185" y2="148" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
            <Circle cx="185" cy="148" r="5" fill={jointColor} />
            {/* Head */}
            <Circle cx="210" cy={102 + breathe} r="10" fill={athleteColor} />
          </Svg>
        );
      }

      case 'hollow_body': {
        const breathe = Math.sin(phase * Math.PI * 2) * 2.5;

        return (
          <Svg width={width} height={height} viewBox="0 0 280 180">
            <Line x1="20" y1="155" x2="260" y2="155" stroke={groundColor} strokeWidth="2" strokeDasharray="4 4" />
            {/* Banana curved posture */}
            <Path
              d={`M 55 ${110 + breathe} Q 140 ${145 + breathe * 0.5} 225 ${120 + breathe}`}
              fill="none"
              stroke={athleteColor}
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Lower Back Anchored Highlight */}
            <Circle cx="140" cy={142 + breathe * 0.5} r="7" fill={accentColor} />
            {/* Head & Reach */}
            <Circle cx="220" cy={115 + breathe} r="9" fill={jointColor} />
            <Line x1="215" y1={118 + breathe} x2="250" y2={100 + breathe} stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
          </Svg>
        );
      }

      case 'handstand': {
        const sway = Math.sin(phase * Math.PI * 2) * 1.5;

        return (
          <Svg width={width} height={height} viewBox="0 0 280 180">
            <Line x1="20" y1="160" x2="260" y2="160" stroke={groundColor} strokeWidth="3" />
            {/* Wall Guide */}
            <Line x1="180" y1="15" x2="180" y2="160" stroke={colors.border} strokeWidth="2" strokeDasharray="4 4" />
            {/* Hands */}
            <Circle cx="140" cy="156" r="6" fill={jointColor} />
            {/* Straight Arms */}
            <Line x1="140" y1="156" x2="140" y2="115" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
            <Circle cx="140" cy="115" r="7" fill={jointColor} />
            {/* Head */}
            <Circle cx="140" cy="122" r="9" fill={athleteColor} />
            {/* Torso & Stacked Legs */}
            <Line x1="140" y1="115" x2={142 + sway} y2="65" stroke={athleteColor} strokeWidth="8" strokeLinecap="round" />
            <Line x1={142 + sway} y1="65" x2={144 + sway} y2="25" stroke={athleteColor} strokeWidth="7" strokeLinecap="round" />
            <Circle cx={144 + sway} cy="23" r="5" fill={accentColor} />
          </Svg>
        );
      }

      case 'human_flag': {
        const sway = Math.sin(phase * Math.PI * 2) * 2;
        return (
          <Svg width={width} height={height} viewBox="0 0 280 180">
            {/* Vertical Pole Support */}
            <Line x1="60" y1="20" x2="60" y2="160" stroke={groundColor} strokeWidth="6" strokeLinecap="round" />
            {/* Grip Points */}
            <Circle cx="60" cy="65" r="6" fill={accentColor} />
            <Circle cx="60" cy="130" r="6" fill={jointColor} />
            {/* Top Pull Arm & Bottom Push Arm */}
            <Line x1="60" y1="65" x2="105" y2={95 + sway} stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
            <Line x1="60" y1="130" x2="105" y2={95 + sway} stroke={jointColor} strokeWidth="6" strokeLinecap="round" />
            {/* Shoulders */}
            <Circle cx="105" cy={95 + sway} r="7" fill={jointColor} />
            {/* Head */}
            <Circle cx="100" cy={78 + sway} r="9" fill={athleteColor} />
            {/* Torso Lateral Bridge */}
            <Line x1="105" y1={95 + sway} x2="165" y2={95 + sway} stroke={athleteColor} strokeWidth="9" strokeLinecap="round" />
            <Circle cx="165" cy={95 + sway} r="6" fill={jointColor} />
            {/* Straight Legs */}
            <Line x1="165" y1={95 + sway} x2="235" y2={95 + sway} stroke={athleteColor} strokeWidth="7" strokeLinecap="round" />
            <Circle cx="237" cy={95 + sway} r="5" fill={accentColor} />
          </Svg>
        );
      }

      default: {
        // Dynamic generic motion
        const genericY = 90 + t * 20;
        return (
          <Svg width={width} height={height} viewBox="0 0 280 180">
            <Line x1="30" y1="155" x2="250" y2="155" stroke={groundColor} strokeWidth="3" />
            <Circle cx="140" cy={genericY - 45} r="10" fill={athleteColor} />
            <Line x1="140" y1={genericY - 35} x2="140" y2={genericY + 20} stroke={athleteColor} strokeWidth="8" strokeLinecap="round" />
            <Line x1="140" y1={genericY + 20} x2="120" y2="155" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
            <Line x1="140" y1={genericY + 20} x2="160" y2="155" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
          </Svg>
        );
      }
    }
  };

  return (
    <View style={styles.container} testID="animated-vector-athlete-container">
      {renderAthlete()}
      {/* Skill Progression or Biomechanical Indicator Badge */}
      <View style={styles.badgeRow}>
        {isSkill && (
          <View style={styles.skillPill} testID="skill-progression-pill">
            <AppText variant="caption" color={colors.primaryDeep} style={styles.skillPillText}>
              {progressionNote || 'Skill Progression • Strict Form'}
            </AppText>
          </View>
        )}
        <View style={styles.tempoPill}>
          <AppText variant="caption" color={colors.textSecondary} style={styles.tempoText}>
            {isHold ? 'Isometric Hold • Breathing Waves' : 'Dynamic Concentric / Eccentric'}
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF8FE',
    borderRadius: radii.card,
    padding: spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
    flexWrap: 'wrap',
  },
  skillPill: {
    backgroundColor: '#EAE5F8',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  skillPillText: {
    fontWeight: '700',
    fontSize: 10,
  },
  tempoPill: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  tempoText: {
    fontSize: 10,
  },
});


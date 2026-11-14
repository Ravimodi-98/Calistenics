import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';

export type ExerciseDiagramPattern =
  | 'push_up'
  | 'pull_up'
  | 'prone_floor'
  | 'squat'
  | 'hollow_body'
  | 'plank'
  | 'handstand'
  | 'l_sit'
  | 'lunge'
  | 'pike_pushup'
  | 'dead_hang'
  | 'reverse_crunch'
  | 'planche'
  | 'front_lever'
  | 'back_lever'
  | 'muscle_up'
  | 'crow_pose'
  | 'pistol_squat'
  | 'human_flag'
  | 'generic';

interface StaticExerciseDiagramProps {
  pattern: ExerciseDiagramPattern;
  exerciseName: string;
  width?: number;
  height?: number;
}

export const StaticExerciseDiagram: React.FC<StaticExerciseDiagramProps> = ({
  pattern,
  exerciseName,
  width = 240,
  height = 160,
}) => {
  const athleteColor = colors.primary; // Brand Purple #8B70D6
  const accentColor = colors.accent; // Orange #F3BA60
  const groundColor = '#B6B1C0'; // Secondary Surface #B6B1C0
  const jointColor = colors.primaryDeep; // #6E55B8

  const renderPattern = () => {
    switch (pattern) {
      case 'push_up':
        // High plank pushup alignment: head, torso, arm pushing floor, straight legs
        return (
          <Svg width={width} height={height} viewBox="0 0 240 160">
            <Line x1="20" y1="130" x2="220" y2="130" stroke={groundColor} strokeWidth="3" strokeLinecap="round" />
            <Circle cx="45" cy="126" r="5" fill={accentColor} />
            <Line x1="45" y1="126" x2="95" y2="105" stroke={athleteColor} strokeWidth="6" strokeLinecap="round" />
            <Circle cx="95" cy="105" r="7" fill={jointColor} />
            <Line x1="95" y1="105" x2="160" y2="85" stroke={athleteColor} strokeWidth="8" strokeLinecap="round" />
            <Circle cx="160" cy="85" r="7" fill={jointColor} />
            <Circle cx="180" cy="78" r="9" fill={athleteColor} />
            <Line x1="160" y1="85" x2="162" y2="128" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
            <Circle cx="162" cy="128" r="4" fill={jointColor} />
          </Svg>
        );

      case 'pull_up':
        // Hanging from bar: overhead bar, vertical bodyline, active shoulder engagement
        return (
          <Svg width={width} height={height} viewBox="0 0 240 160">
            <Line x1="40" y1="20" x2="200" y2="20" stroke={groundColor} strokeWidth="5" strokeLinecap="round" />
            <Circle cx="100" cy="20" r="5" fill={accentColor} />
            <Circle cx="140" cy="20" r="5" fill={accentColor} />
            <Line x1="100" y1="20" x2="110" y2="52" stroke={accentColor} strokeWidth="5" strokeLinecap="round" />
            <Line x1="140" y1="20" x2="130" y2="52" stroke={accentColor} strokeWidth="5" strokeLinecap="round" />
            <Circle cx="120" cy="45" r="10" fill={athleteColor} />
            <Line x1="108" y1="52" x2="132" y2="52" stroke={jointColor} strokeWidth="6" strokeLinecap="round" />
            <Line x1="120" y1="52" x2="120" y2="100" stroke={athleteColor} strokeWidth="8" strokeLinecap="round" />
            <Circle cx="120" cy="100" r="6" fill={jointColor} />
            <Line x1="120" y1="100" x2="122" y2="145" stroke={athleteColor} strokeWidth="6" strokeLinecap="round" />
            <Circle cx="122" cy="147" r="4" fill={accentColor} />
          </Svg>
        );

      case 'dead_hang':
        return (
          <Svg width={width} height={height} viewBox="0 0 240 160">
            <Line x1="40" y1="20" x2="200" y2="20" stroke={groundColor} strokeWidth="5" strokeLinecap="round" />
            <Circle cx="105" cy="20" r="5" fill={accentColor} />
            <Circle cx="135" cy="20" r="5" fill={accentColor} />
            <Line x1="105" y1="20" x2="112" y2="55" stroke={accentColor} strokeWidth="5" strokeLinecap="round" />
            <Line x1="135" y1="20" x2="128" y2="55" stroke={accentColor} strokeWidth="5" strokeLinecap="round" />
            <Circle cx="120" cy="50" r="9" fill={athleteColor} />
            <Line x1="120" y1="55" x2="120" y2="110" stroke={athleteColor} strokeWidth="8" strokeLinecap="round" />
            <Line x1="120" y1="110" x2="120" y2="150" stroke={athleteColor} strokeWidth="6" strokeLinecap="round" />
          </Svg>
        );

      case 'prone_floor':
        // Lying flat face down on floor with elevated chest & shoulder retraction
        return (
          <Svg width={width} height={height} viewBox="0 0 240 160">
            <Line x1="20" y1="130" x2="220" y2="130" stroke={groundColor} strokeWidth="3" strokeLinecap="round" />
            <Line x1="40" y1="128" x2="110" y2="128" stroke={athleteColor} strokeWidth="6" strokeLinecap="round" />
            <Circle cx="40" cy="128" r="4" fill={accentColor} />
            <Circle cx="110" cy="128" r="6" fill={jointColor} />
            <Line x1="110" y1="128" x2="160" y2="108" stroke={athleteColor} strokeWidth="7" strokeLinecap="round" />
            <Circle cx="178" cy="102" r="8" fill={athleteColor} />
            <Line x1="155" y1="110" x2="175" y2="85" stroke={accentColor} strokeWidth="5" strokeLinecap="round" />
            <Circle cx="175" cy="85" r="4" fill={jointColor} />
          </Svg>
        );

      case 'squat':
        // Full depth squat: hips below knees, upright torso, flat feet
        return (
          <Svg width={width} height={height} viewBox="0 0 240 160">
            <Line x1="30" y1="140" x2="210" y2="140" stroke={groundColor} strokeWidth="3" strokeLinecap="round" />
            <Line x1="105" y1="138" x2="125" y2="138" stroke={jointColor} strokeWidth="5" strokeLinecap="round" />
            <Line x1="115" y1="138" x2="95" y2="110" stroke={athleteColor} strokeWidth="6" strokeLinecap="round" />
            <Circle cx="95" cy="110" r="6" fill={jointColor} />
            <Line x1="95" y1="110" x2="138" y2="110" stroke={athleteColor} strokeWidth="7" strokeLinecap="round" />
            <Circle cx="138" cy="110" r="7" fill={jointColor} />
            <Line x1="138" y1="110" x2="125" y2="65" stroke={athleteColor} strokeWidth="8" strokeLinecap="round" />
            <Circle cx="125" cy="50" r="9" fill={athleteColor} />
            <Line x1="125" y1="70" x2="85" y2="72" stroke={accentColor} strokeWidth="5" strokeLinecap="round" />
          </Svg>
        );

      case 'lunge':
        return (
          <Svg width={width} height={height} viewBox="0 0 240 160">
            <Line x1="20" y1="140" x2="220" y2="140" stroke={groundColor} strokeWidth="3" strokeLinecap="round" />
            <Circle cx="120" cy="45" r="9" fill={athleteColor} />
            <Line x1="120" y1="55" x2="120" y2="100" stroke={athleteColor} strokeWidth="8" strokeLinecap="round" />
            {/* Front 90/90 leg */}
            <Line x1="120" y1="100" x2="155" y2="105" stroke={athleteColor} strokeWidth="6" strokeLinecap="round" />
            <Line x1="155" y1="105" x2="155" y2="138" stroke={athleteColor} strokeWidth="6" strokeLinecap="round" />
            {/* Back 90/90 leg */}
            <Line x1="120" y1="100" x2="90" y2="125" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
            <Line x1="90" y1="125" x2="65" y2="138" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
          </Svg>
        );

      case 'plank':
        return (
          <Svg width={width} height={height} viewBox="0 0 240 160">
            <Line x1="20" y1="135" x2="220" y2="135" stroke={groundColor} strokeWidth="3" strokeLinecap="round" />
            <Circle cx="50" cy="132" r="5" fill={accentColor} />
            <Line x1="50" y1="132" x2="175" y2="112" stroke={athleteColor} strokeWidth="8" strokeLinecap="round" />
            <Line x1="175" y1="112" x2="175" y2="132" stroke={jointColor} strokeWidth="6" strokeLinecap="round" />
            <Circle cx="190" cy="105" r="9" fill={athleteColor} />
          </Svg>
        );

      case 'hollow_body':
        return (
          <Svg width={width} height={height} viewBox="0 0 240 160">
            <Line x1="20" y1="140" x2="220" y2="140" stroke={groundColor} strokeWidth="2" strokeDasharray="4 4" />
            <Path d="M 45 95 Q 120 135 195 105" fill="none" stroke={athleteColor} strokeWidth="7" strokeLinecap="round" />
            <Circle cx="120" cy="130" r="6" fill={accentColor} />
            <Circle cx="190" cy="100" r="8" fill={jointColor} />
            <Line x1="185" y1="102" x2="215" y2="88" stroke={accentColor} strokeWidth="5" strokeLinecap="round" />
          </Svg>
        );

      case 'pike_pushup':
        return (
          <Svg width={width} height={height} viewBox="0 0 240 160">
            <Line x1="20" y1="135" x2="220" y2="135" stroke={groundColor} strokeWidth="3" strokeLinecap="round" />
            <Circle cx="60" cy="132" r="5" fill={accentColor} />
            <Line x1="60" y1="132" x2="115" y2="70" stroke={athleteColor} strokeWidth="7" strokeLinecap="round" />
            <Circle cx="115" cy="70" r="7" fill={jointColor} />
            <Line x1="115" y1="70" x2="165" y2="132" stroke={athleteColor} strokeWidth="7" strokeLinecap="round" />
            <Circle cx="165" cy="132" r="5" fill={jointColor} />
            <Circle cx="140" cy="95" r="9" fill={athleteColor} />
          </Svg>
        );

      case 'reverse_crunch':
        return (
          <Svg width={width} height={height} viewBox="0 0 240 160">
            <Line x1="20" y1="135" x2="220" y2="135" stroke={groundColor} strokeWidth="3" strokeLinecap="round" />
            <Circle cx="65" cy="130" r="8" fill={athleteColor} />
            <Line x1="75" y1="132" x2="125" y2="125" stroke={athleteColor} strokeWidth="8" strokeLinecap="round" />
            <Path d="M 125 125 Q 135 90 115 75" fill="none" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
          </Svg>
        );

      case 'handstand':
        return (
          <Svg width={width} height={height} viewBox="0 0 240 160">
            <Line x1="20" y1="145" x2="220" y2="145" stroke={groundColor} strokeWidth="3" />
            <Line x1="145" y1="15" x2="145" y2="145" stroke={colors.border} strokeWidth="2" strokeDasharray="3 3" />
            <Circle cx="120" cy="142" r="5" fill={jointColor} />
            <Line x1="120" y1="142" x2="120" y2="105" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
            <Circle cx="120" cy="105" r="7" fill={jointColor} />
            <Line x1="120" y1="105" x2="122" y2="60" stroke={athleteColor} strokeWidth="8" strokeLinecap="round" />
            <Line x1="122" y1="60" x2="124" y2="22" stroke={athleteColor} strokeWidth="6" strokeLinecap="round" />
            <Circle cx="124" cy="20" r="4" fill={accentColor} />
          </Svg>
        );

      case 'planche':
        return (
          <Svg width={width} height={height} viewBox="0 0 240 160">
            <Line x1="20" y1="135" x2="220" y2="135" stroke={groundColor} strokeWidth="3" />
            <Circle cx="45" cy="132" r="5" fill={accentColor} />
            <Line x1="45" y1="132" x2="170" y2="95" stroke={athleteColor} strokeWidth="8" strokeLinecap="round" />
            <Line x1="140" y1="102" x2="125" y2="132" stroke={jointColor} strokeWidth="6" strokeLinecap="round" />
            <Circle cx="125" cy="132" r="5" fill={jointColor} />
            <Circle cx="185" cy="90" r="9" fill={athleteColor} />
          </Svg>
        );

      case 'front_lever':
        return (
          <Svg width={width} height={height} viewBox="0 0 240 160">
            <Line x1="40" y1="20" x2="200" y2="20" stroke={groundColor} strokeWidth="5" strokeLinecap="round" />
            <Circle cx="120" cy="20" r="5" fill={accentColor} />
            <Line x1="120" y1="20" x2="120" y2="75" stroke={jointColor} strokeWidth="6" strokeLinecap="round" />
            <Line x1="75" y1="75" x2="175" y2="75" stroke={athleteColor} strokeWidth="8" strokeLinecap="round" />
            <Circle cx="185" cy="75" r="9" fill={athleteColor} />
            <Circle cx="75" cy="75" r="5" fill={accentColor} />
          </Svg>
        );

      case 'back_lever':
        return (
          <Svg width={width} height={height} viewBox="0 0 240 160">
            <Line x1="40" y1="20" x2="200" y2="20" stroke={groundColor} strokeWidth="5" strokeLinecap="round" />
            <Circle cx="120" cy="20" r="5" fill={accentColor} />
            <Line x1="120" y1="20" x2="120" y2="70" stroke={jointColor} strokeWidth="6" strokeLinecap="round" />
            <Line x1="65" y1="72" x2="165" y2="72" stroke={athleteColor} strokeWidth="8" strokeLinecap="round" />
            <Circle cx="60" cy="72" r="9" fill={athleteColor} />
          </Svg>
        );

      case 'l_sit':
        return (
          <Svg width={width} height={height} viewBox="0 0 240 160">
            <Line x1="20" y1="140" x2="220" y2="140" stroke={groundColor} strokeWidth="3" />
            <Circle cx="105" cy="137" r="5" fill={jointColor} />
            <Line x1="105" y1="137" x2="105" y2="85" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
            <Circle cx="105" cy="85" r="7" fill={jointColor} />
            <Line x1="105" y1="85" x2="107" y2="120" stroke={athleteColor} strokeWidth="8" strokeLinecap="round" />
            <Circle cx="105" cy="65" r="9" fill={athleteColor} />
            <Circle cx="107" cy="120" r="6" fill={jointColor} />
            <Line x1="107" y1="120" x2="185" y2="120" stroke={athleteColor} strokeWidth="6" strokeLinecap="round" />
            <Circle cx="187" cy="120" r="4" fill={accentColor} />
          </Svg>
        );

      case 'muscle_up':
        return (
          <Svg width={width} height={height} viewBox="0 0 240 160">
            <Line x1="40" y1="70" x2="200" y2="70" stroke={groundColor} strokeWidth="5" strokeLinecap="round" />
            <Circle cx="120" cy="70" r="5" fill={accentColor} />
            <Line x1="120" y1="70" x2="120" y2="40" stroke={jointColor} strokeWidth="6" strokeLinecap="round" />
            <Circle cx="120" cy="25" r="9" fill={athleteColor} />
            <Line x1="120" y1="40" x2="120" y2="110" stroke={athleteColor} strokeWidth="8" strokeLinecap="round" />
          </Svg>
        );

      case 'crow_pose':
        return (
          <Svg width={width} height={height} viewBox="0 0 240 160">
            <Line x1="20" y1="140" x2="220" y2="140" stroke={groundColor} strokeWidth="3" />
            <Circle cx="120" cy="138" r="5" fill={jointColor} />
            <Line x1="120" y1="138" x2="130" y2="105" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
            <Circle cx="130" cy="95" r="16" fill={athleteColor} />
            <Circle cx="155" cy="85" r="8" fill={jointColor} />
            <Circle cx="100" cy="110" r="5" fill={accentColor} />
          </Svg>
        );

      case 'pistol_squat':
        return (
          <Svg width={width} height={height} viewBox="0 0 240 160">
            <Line x1="20" y1="140" x2="220" y2="140" stroke={groundColor} strokeWidth="3" />
            <Line x1="100" y1="138" x2="90" y2="110" stroke={athleteColor} strokeWidth="6" strokeLinecap="round" />
            <Circle cx="90" cy="110" r="6" fill={jointColor} />
            <Line x1="90" y1="110" x2="115" y2="110" stroke={athleteColor} strokeWidth="7" strokeLinecap="round" />
            <Circle cx="115" cy="110" r="7" fill={jointColor} />
            <Line x1="115" y1="110" x2="110" y2="65" stroke={athleteColor} strokeWidth="8" strokeLinecap="round" />
            <Circle cx="110" cy="50" r="9" fill={athleteColor} />
            {/* Front horizontal leg */}
            <Line x1="115" y1="110" x2="175" y2="120" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
            <Circle cx="177" cy="120" r="4" fill={accentColor} />
          </Svg>
        );

      case 'human_flag':
        return (
          <Svg width={width} height={height} viewBox="0 0 240 160">
            {/* Vertical Support Pole */}
            <Line x1="50" y1="15" x2="50" y2="145" stroke={groundColor} strokeWidth="5" strokeLinecap="round" />
            {/* Hands Gripping Pole */}
            <Circle cx="50" cy="55" r="5" fill={accentColor} />
            <Circle cx="50" cy="115" r="5" fill={jointColor} />
            {/* Top Pull Arm & Bottom Push Arm */}
            <Line x1="50" y1="55" x2="85" y2="80" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
            <Line x1="50" y1="115" x2="85" y2="85" stroke={jointColor} strokeWidth="6" strokeLinecap="round" />
            {/* Shoulders */}
            <Circle cx="85" cy="82" r="7" fill={jointColor} />
            {/* Head */}
            <Circle cx="82" cy="65" r="8" fill={athleteColor} />
            {/* Torso Horizontal Line */}
            <Line x1="85" y1="82" x2="140" y2="82" stroke={athleteColor} strokeWidth="8" strokeLinecap="round" />
            <Circle cx="140" cy="82" r="6" fill={jointColor} />
            {/* Horizontal Legs */}
            <Line x1="140" y1="82" x2="200" y2="82" stroke={athleteColor} strokeWidth="6" strokeLinecap="round" />
            <Circle cx="202" cy="82" r="4" fill={accentColor} />
          </Svg>
        );

      default:
        // Generic active calisthenics posture
        return (
          <Svg width={width} height={height} viewBox="0 0 240 160">
            <Line x1="30" y1="140" x2="210" y2="140" stroke={groundColor} strokeWidth="3" />
            <Circle cx="120" cy="55" r="10" fill={athleteColor} />
            <Line x1="120" y1="65" x2="120" y2="110" stroke={athleteColor} strokeWidth="8" strokeLinecap="round" />
            <Line x1="120" y1="110" x2="105" y2="140" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
            <Line x1="120" y1="110" x2="135" y2="140" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
          </Svg>
        );
    }
  };

  return (
    <View style={styles.container} testID={`static-diagram-${pattern}`}>
      {renderPattern()}
      <View style={styles.captionBox}>
        <AppText variant="caption" color={colors.primaryDeep} style={styles.captionText}>
          {exerciseName} • Biomechanical Alignment
        </AppText>
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
  captionBox: {
    marginTop: 4,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  captionText: {
    fontWeight: '700',
    fontSize: 10,
  },
});

/**
 * Animation Configuration and Motion Guidelines
 * Source of truth: design.md section 7 & rules.md section 4
 */
export const animationConfig = {
  // Timing
  durations: {
    micro: 150, // Button presses, state toggles (120-220ms)
    short: 220, // Screen transitions, card reveals (180-300ms)
    medium: 350, // Modal presentations
    loop: 2000, // Exercise loop default
  },
  // Easing curves (smooth, not bouncy)
  easings: {
    standard: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
  },
} as const;

export interface AnimationPlaybackOptions {
  autoPlay?: boolean;
  loop?: boolean;
  speed?: number;
}


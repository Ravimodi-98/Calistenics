/**
 * Design tokens: Color Palette from design.md
 * Source of truth: Fitness App Reference (Light Mode)
 */
export const colors = {
  // Core Background & Surfaces
  background: '#F6F6F6', // Cascading White
  surface: '#FFFFFF', // Clean White
  surfaceSecondary: '#B6B1C0', // Dreamland (muted panels, secondary chips)
  surfaceCard: '#FFFFFF', // Default card background
  surfaceElevated: '#FFFFFF',

  // Primary (Purple & Lavender)
  primary: '#8B70D6', // Brand Purple (main actions, buttons, active states)
  primaryLavender: '#E0DBF3', // Chinese Silver (soft cards, selected states)
  primaryDeep: '#6E55B8', // Deep Purple (pressed states, high contrast emphasis)
  primaryMuted: '#EDE9FA', // Subtle lavender tint

  // Accent (Warm Orange)
  accent: '#F3BA60', // Crunch (highlights, badges, challenge accents)
  accentMuted: '#FDF4E7', // Soft orange tint for badges

  // Text & Content (Charcoal & Warm Haze)
  text: '#202022', // Lead (main headings, primary copy)
  textSecondary: '#736A6A', // Warm Haze (secondary labels, metadata)
  textMuted: '#9B9494', // De-emphasized placeholder text
  textInverse: '#FFFFFF', // White text on dark/purple backgrounds

  // Borders & Dividers
  border: '#E7E4EA', // Neutral divider and input border
  borderLight: '#F0EDF3',
  borderFocused: '#8B70D6', // Active input / selected card border

  // Status Colors
  success: '#4D9B75', // Positive confirmation, completed workout
  successMuted: '#EBF6F0',
  error: '#C94F55', // Destructive action, form error
  errorMuted: '#FAECEC',
  warning: '#F3BA60', // Warning alerts
  warningMuted: '#FDF4E7',
} as const;

export type ColorToken = keyof typeof colors;


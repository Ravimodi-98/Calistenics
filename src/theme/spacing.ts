/**
 * Design tokens: Spacing, Radii, and Shadows from design.md
 */
export const spacing = {
  xxs: 4, // icon/text gap
  xs: 8, // compact spacing
  sm: 12, // small component gaps
  md: 16, // standard card padding
  lg: 24, // section spacing
  xl: 32, // major separation
  xxl: 48,
} as const;

export const radii = {
  xs: 6,
  sm: 10,
  input: 14, // 14px radius for text inputs
  button: 16, // 14-18px radius for buttons
  card: 20, // 18-22px radius for cards
  full: 9999, // pill shape
} as const;

export const shadows = {
  subtle: {
    shadowColor: '#202022',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  card: {
    shadowColor: '#202022',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  elevated: {
    shadowColor: '#202022',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
} as const;


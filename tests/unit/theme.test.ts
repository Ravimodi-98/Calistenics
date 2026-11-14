import { colors, radii, spacing, typography } from '../../src/theme';

describe('Theme System Tokens', () => {
  test('includes all reference palette colors', () => {
    // Reference colors from design.md
    expect(colors.background).toBe('#F6F6F6'); // Cascading White
    expect(colors.primaryLavender).toBe('#E0DBF3'); // Chinese Silver
    expect(colors.primary).toBe('#8B70D6'); // Brand Purple
    expect(colors.primaryDeep).toBe('#6E55B8'); // Deep Purple
    expect(colors.accent).toBe('#F3BA60'); // Crunch
    expect(colors.surfaceSecondary).toBe('#B6B1C0'); // Dreamland
    expect(colors.textSecondary).toBe('#736A6A'); // Warm Haze
    expect(colors.text).toBe('#202022'); // Lead
    expect(colors.success).toBe('#4D9B75');
    expect(colors.error).toBe('#C94F55');
  });

  test('radii scale adheres to design guidelines', () => {
    expect(radii.card).toBe(20);
    expect(radii.button).toBe(16);
    expect(radii.input).toBe(14);
    expect(radii.full).toBe(9999);
  });

  test('spacing scale matches specifications', () => {
    expect(spacing.xxs).toBe(4);
    expect(spacing.xs).toBe(8);
    expect(spacing.sm).toBe(12);
    expect(spacing.md).toBe(16);
    expect(spacing.lg).toBe(24);
    expect(spacing.xl).toBe(32);
  });

  test('typography contains all standard styles', () => {
    expect(typography.display).toBeDefined();
    expect(typography.h1).toBeDefined();
    expect(typography.h2).toBeDefined();
    expect(typography.h3).toBeDefined();
    expect(typography.body).toBeDefined();
    expect(typography.caption).toBeDefined();
    expect(typography.button).toBeDefined();
  });
});


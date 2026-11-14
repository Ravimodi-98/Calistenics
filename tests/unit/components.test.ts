import { colors, radii, spacing } from '../../src/theme';

describe('Component System Specifications', () => {
  test('theme tokens adhere to design.md standards', () => {
    // Verified light palette
    expect(colors.background).toBe('#F6F6F6');
    expect(colors.primaryLavender).toBe('#E0DBF3');
    expect(colors.primary).toBe('#8B70D6');
    expect(colors.primaryDeep).toBe('#6E55B8');
    expect(colors.accent).toBe('#F3BA60');
    expect(colors.surfaceSecondary).toBe('#B6B1C0');
    expect(colors.textSecondary).toBe('#736A6A');
    expect(colors.text).toBe('#202022');
  });

  test('radii standards match design specifications', () => {
    // 20px card, 16px button, 14px input
    expect(radii.card).toBe(20);
    expect(radii.button).toBe(16);
    expect(radii.input).toBe(14);
    expect(radii.full).toBe(9999);
  });

  test('spacing scale matches layout specifications', () => {
    expect(spacing.xxs).toBe(4);
    expect(spacing.xs).toBe(8);
    expect(spacing.sm).toBe(12);
    expect(spacing.md).toBe(16);
    expect(spacing.lg).toBe(24);
    expect(spacing.xl).toBe(32);
  });
});


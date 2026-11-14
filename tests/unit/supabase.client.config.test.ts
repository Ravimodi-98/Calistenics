describe('Phase 8.4 — Supabase Environment Configuration Safety', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('throws safe error in production/dev when EXPO_PUBLIC_SUPABASE_URL is missing', () => {
    delete process.env.EXPO_PUBLIC_SUPABASE_URL;
    delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    (process.env as any).NODE_ENV = 'production';

    expect(() => {
      // Re-require module to trigger module initialization check
      require('../../src/services/supabase/client');
    }).toThrow('Missing required Supabase environment configuration');
  });

  test('does not log or expose secret values in configuration errors', () => {
    delete process.env.EXPO_PUBLIC_SUPABASE_URL;
    (process.env as any).NODE_ENV = 'production';

    try {
      require('../../src/services/supabase/client');
      // Should have thrown
      expect(true).toBe(false);
    } catch (err: any) {
      expect(err.message).not.toContain('sb_publishable');
      expect(err.message).not.toContain('eyJ');
      expect(err.message).toContain('Ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set.');
    }
  });

  test('allows safe mock initialization in test environment', () => {
    (process.env as any).NODE_ENV = 'test';
    delete process.env.EXPO_PUBLIC_SUPABASE_URL;
    delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    expect(() => {
      const { supabase } = require('../../src/services/supabase/client');
      expect(supabase).toBeDefined();
    }).not.toThrow();
  });
});

import {
  signUpSchema,
  signInSchema,
  forgotPasswordSchema,
} from '../../src/domain/schemas/auth.schema';

describe('Auth Zod Validation Schemas', () => {
  describe('signUpSchema', () => {
    test('passes for valid registration input', () => {
      const result = signUpSchema.safeParse({
        fullName: 'Alex Hunter',
        email: 'alex@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });
      expect(result.success).toBe(true);
    });

    test('fails when full name is shorter than 2 characters', () => {
      const result = signUpSchema.safeParse({
        fullName: 'A',
        email: 'alex@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Full name must be at least 2 characters');
      }
    });

    test('fails for invalid email format', () => {
      const result = signUpSchema.safeParse({
        fullName: 'Alex Hunter',
        email: 'not-an-email',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid email address');
      }
    });

    test('fails when password is under 6 characters', () => {
      const result = signUpSchema.safeParse({
        fullName: 'Alex Hunter',
        email: 'alex@example.com',
        password: '12345',
        confirmPassword: '12345',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 6 characters');
      }
    });

    test('fails when passwords do not match', () => {
      const result = signUpSchema.safeParse({
        fullName: 'Alex Hunter',
        email: 'alex@example.com',
        password: 'Password123!',
        confirmPassword: 'DifferentPassword123!',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Passwords do not match');
      }
    });
  });

  describe('signInSchema', () => {
    test('passes for valid credentials input', () => {
      const result = signInSchema.safeParse({
        email: 'alex@example.com',
        password: 'AnyPassword',
      });
      expect(result.success).toBe(true);
    });

    test('fails when password is empty', () => {
      const result = signInSchema.safeParse({
        email: 'alex@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('forgotPasswordSchema', () => {
    test('passes for valid email', () => {
      const result = forgotPasswordSchema.safeParse({
        email: 'alex@example.com',
      });
      expect(result.success).toBe(true);
    });

    test('fails for invalid email', () => {
      const result = forgotPasswordSchema.safeParse({
        email: 'bad-email',
      });
      expect(result.success).toBe(false);
    });
  });
});


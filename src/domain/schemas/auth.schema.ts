import { z } from 'zod';

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, { message: 'Full name must be at least 2 characters' })
      .max(60, { message: 'Full name must not exceed 60 characters' }),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email({ message: 'Please enter a valid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(100, { message: 'Password is too long' }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Please enter your password' }),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Please enter a valid email address' }),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;


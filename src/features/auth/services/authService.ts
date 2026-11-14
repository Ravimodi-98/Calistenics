import { supabase } from '@/services/supabase/client';
import { Profile } from '@/domain/models/user.model';
import { SignUpInput, SignInInput } from '@/domain/schemas/auth.schema';

export interface AuthResult {
  user: any;
  session: any;
  needsEmailVerification?: boolean;
}

export class AuthService {
  /**
   * Registers a new user with email and password.
   * Stores full_name in raw_user_meta_data for the database trigger to populate profiles.
   */
  async signUp(input: SignUpInput): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.fullName,
        },
      },
    });

    if (error) {
      throw this.mapAuthError(error);
    }

    const needsEmailVerification = !data.session && !!data.user;

    return {
      user: data.user,
      session: data.session,
      needsEmailVerification,
    };
  }

  /**
   * Authenticates an existing user with email and password.
   */
  async signIn(input: SignInInput): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) {
      throw this.mapAuthError(error);
    }

    return {
      user: data.user,
      session: data.session,
    };
  }

  /**
   * Signs the user out and clears stored session tokens.
   */
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw this.mapAuthError(error);
    }
  }

  /**
   * Requests a password recovery email for the provided address.
   */
  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      throw this.mapAuthError(error);
    }
  }

  /**
   * Resends the signup confirmation email.
   */
  async resendVerificationEmail(email: string): Promise<void> {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    if (error) {
      throw this.mapAuthError(error);
    }
  }

  /**
   * Retrieves the user's profile from the public.profiles table.
   */
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      // If RLS blocked or not found, return null
      return null;
    }

    return data as Profile;
  }

  /**
   * Updates fields on the user's profile.
   */
  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to update profile.');
    }

    return data as Profile;
  }

  /**
   * Fetches the current active session.
   */
  async getCurrentSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw this.mapAuthError(error);
    }
    return data.session;
  }

  /**
   * Securely requests account deletion via trusted server-side Supabase Edge Function.
   * Purges local session and cache upon successful server deletion.
   */
  async deleteAccount(): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('delete-account', {
        method: 'POST',
      });

      if (error) {
        throw new Error(error.message || 'Failed to delete account. Please try again.');
      }

      if (data?.error) {
        throw new Error(data.error);
      }
    } finally {
      // Regardless of remote deletion outcome or network state, purge local session
      await this.signOut();
    }
  }

  /**
   * Listens to auth state changes from Supabase.
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }

  /**
   * Translates backend errors into clear, non-technical, user-facing error messages.
   */
  private mapAuthError(error: any): Error {
    const msg = error?.message?.toLowerCase() || '';

    if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
      return new Error('Invalid email or password. Please verify and try again.');
    }
    if (msg.includes('user already registered') || msg.includes('already exists')) {
      return new Error('An account with this email address already exists. Please sign in instead.');
    }
    if (msg.includes('email not confirmed')) {
      return new Error('Your email address has not been verified yet. Please check your inbox.');
    }
    if (msg.includes('rate limit') || msg.includes('too many requests')) {
      return new Error('Too many requests. Please wait a few moments before trying again.');
    }
    if (msg.includes('network') || msg.includes('fetch')) {
      return new Error('Network connection issue. Please check your internet connection.');
    }

    return new Error(error.message || 'An unexpected authentication error occurred.');
  }
}

export const authService = new AuthService();


import { create } from 'zustand';
import { AuthUser, AuthSession, Profile } from '@/domain/models/user.model';
import { authService } from '../services/authService';
import { SignUpInput, SignInInput } from '@/domain/schemas/auth.schema';

interface AuthStoreState {
  user: AuthUser | null;
  profile: Profile | null;
  session: AuthSession | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  pendingVerificationEmail: string | null;

  // Actions
  initialize: () => Promise<void>;
  signUp: (input: SignUpInput) => Promise<{ needsEmailVerification: boolean }>;
  signIn: (input: SignInInput) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  refreshProfile: () => Promise<Profile | null>;
  updateProfile: (updates: Partial<Profile>) => Promise<Profile>;
  setPendingVerificationEmail: (email: string | null) => void;
  clearError: () => void;
}

let authSubscription: { unsubscribe: () => void } | null = null;

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  user: null,
  profile: null,
  session: null,
  isLoading: false,
  isInitialized: false,
  error: null,
  pendingVerificationEmail: null,

  initialize: async () => {
    // Avoid double initialization
    if (get().isInitialized) return;

    set({ isLoading: true, error: null });

    try {
      const session = await authService.getCurrentSession();

      if (session?.user) {
        let profile = await authService.getProfile(session.user.id);
        set({
          user: session.user,
          session,
          profile,
          isInitialized: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          session: null,
          profile: null,
          isInitialized: true,
          isLoading: false,
        });
      }

      // Single active auth state listener
      if (!authSubscription) {
        const { data } = authService.onAuthStateChange(async (event, newSession) => {
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            if (newSession?.user) {
              const profile = await authService.getProfile(newSession.user.id);
              set({
                user: newSession.user,
                session: newSession,
                profile,
                isLoading: false,
              });
            }
          } else if (event === 'SIGNED_OUT') {
            set({
              user: null,
              session: null,
              profile: null,
              isLoading: false,
              pendingVerificationEmail: null,
            });
          } else if (event === 'USER_UPDATED') {
            if (newSession?.user) {
              const profile = await authService.getProfile(newSession.user.id);
              set({ user: newSession.user, profile });
            }
          }
        });
        authSubscription = data.subscription;
      }
    } catch (err: any) {
      set({
        user: null,
        session: null,
        profile: null,
        isInitialized: true,
        isLoading: false,
        error: err?.message || 'Failed to restore session.',
      });
    }
  },

  signUp: async (input: SignUpInput) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authService.signUp(input);

      if (result.needsEmailVerification) {
        set({
          pendingVerificationEmail: input.email,
          isLoading: false,
        });
        return { needsEmailVerification: true };
      }

      if (result.session?.user) {
        const profile = await authService.getProfile(result.session.user.id);
        set({
          user: result.session.user,
          session: result.session,
          profile,
          isLoading: false,
        });
        return { needsEmailVerification: false };
      }

      set({ isLoading: false });
      return { needsEmailVerification: false };
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  signIn: async (input: SignInInput) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authService.signIn(input);
      let profile = null;
      if (result.session?.user) {
        profile = await authService.getProfile(result.session.user.id);
      }
      set({
        user: result.user,
        session: result.session,
        profile,
        isLoading: false,
        pendingVerificationEmail: null,
      });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.signOut();
      set({
        user: null,
        session: null,
        profile: null,
        isLoading: false,
        pendingVerificationEmail: null,
      });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  deleteAccount: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.deleteAccount();
      set({
        user: null,
        session: null,
        profile: null,
        isLoading: false,
        pendingVerificationEmail: null,
      });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await authService.resetPassword(email);
      set({ isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  resendVerification: async () => {
    const email = get().pendingVerificationEmail || get().user?.email;
    if (!email) {
      throw new Error('No email address available to resend verification.');
    }
    set({ isLoading: true, error: null });
    try {
      await authService.resendVerificationEmail(email);
      set({ isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  refreshProfile: async () => {
    const user = get().user;
    if (!user) return null;
    try {
      const profile = await authService.getProfile(user.id);
      set({ profile });
      return profile;
    } catch {
      return null;
    }
  },

  updateProfile: async (updates: Partial<Profile>) => {
    const user = get().user;
    if (!user) throw new Error('Not authenticated');
    set({ isLoading: true, error: null });
    try {
      const updated = await authService.updateProfile(user.id, updates);
      set({ profile: updated, isLoading: false });
      return updated;
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  setPendingVerificationEmail: (email: string | null) => {
    set({ pendingVerificationEmail: email });
  },

  clearError: () => {
    set({ error: null });
  },
}));


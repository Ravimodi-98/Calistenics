import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isTestEnv = process.env.NODE_ENV === 'test';

const rawUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const rawAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!rawUrl || !rawAnonKey) {
  if (!isTestEnv) {
    throw new Error(
      'Missing required Supabase environment configuration: Ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set.'
    );
  }
}

const supabaseUrl = rawUrl || (isTestEnv ? 'https://test-mock.supabase.co' : '');
const supabaseAnonKey = rawAnonKey || (isTestEnv ? 'test-mock-anon-key' : '');

// Custom storage adapter using SecureStore for native platforms
const ExpoSecureStoreAdapter = {
  getItem: (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        return Promise.resolve(window.localStorage.getItem(key));
      }
      return Promise.resolve(null);
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, value);
      }
      return Promise.resolve();
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      return Promise.resolve();
    }
    return SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});


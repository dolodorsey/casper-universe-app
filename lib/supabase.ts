import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

/**
 * Casper Universe — Supabase client.
 *
 * Reads from EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY env vars.
 * If env vars are missing, falls back to a no-op mock client so the app still
 * boots in development. All real persistence requires the env vars to be set
 * in Vercel + .env.local.
 */

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured =
  supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

const getStorage = () => {
  if (typeof window === 'undefined') return undefined;
  try {
    return AsyncStorage;
  } catch {
    return undefined;
  }
};

const createMockClient = (): SupabaseClient => {
  const error = { message: 'Supabase not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.' };
  const mockAuth = {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signOut: async () => ({ error: null }),
    signInWithOtp: async () => ({ data: null, error }),
    signInWithPassword: async () => ({ data: null, error }),
    signUp: async () => ({ data: null, error }),
  };
  const mockQuery = {
    select: () => mockQuery,
    eq: () => mockQuery,
    in: () => mockQuery,
    gte: () => mockQuery,
    lte: () => mockQuery,
    order: () => mockQuery,
    limit: () => mockQuery,
    single: async () => ({ data: null, error }),
    then: (resolve: (v: { data: any; error: any }) => void) => resolve({ data: [], error: null }),
  };
  const mockFrom = () => ({
    select: () => mockQuery,
    insert: async () => ({ data: null, error }),
    update: async () => ({ data: null, error }),
    upsert: async () => ({ data: null, error }),
    delete: async () => ({ data: null, error }),
  });
  return {
    auth: mockAuth as any,
    from: mockFrom as any,
    rpc: async () => ({ data: null, error }),
  } as unknown as SupabaseClient;
};

let supabaseInstance: SupabaseClient;

if (isSupabaseConfigured) {
  const storage = getStorage();
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      ...(storage ? { storage } : {}),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
} else {
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    console.warn(
      '[Supabase] Not configured — running in offline/mock mode. ' +
        'Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to enable real persistence.',
    );
  }
  supabaseInstance = createMockClient();
}

export const supabase = supabaseInstance;

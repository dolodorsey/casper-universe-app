import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

/**
 * Casper Universe — Supabase client.
 *
 * Reads a public Supabase URL and publishable key from the environment.
 * Missing configuration fails closed: the app can render an explanatory state,
 * but authentication and data operations return an explicit error.
 */

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabasePublishableKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  '';

export const isSupabaseConfigured =
  supabaseUrl.length > 0 && supabasePublishableKey.length > 0;

const getStorage = () => {
  if (typeof window === 'undefined') return undefined;
  try {
    return AsyncStorage;
  } catch {
    return undefined;
  }
};

const createMockClient = (): SupabaseClient => {
  const error = { message: 'Supabase not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY.' };
  const unavailableAuth = {
    getSession: async () => ({ data: { session: null }, error }),
    getUser: async () => ({ data: { user: null }, error }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signOut: async () => ({ error: null }),
    signInWithOtp: async () => ({ data: null, error }),
    signInWithPassword: async () => ({ data: null, error }),
    signUp: async () => ({ data: null, error }),
  };
  const unavailableQuery = {
    select: () => unavailableQuery,
    eq: () => unavailableQuery,
    in: () => unavailableQuery,
    gte: () => unavailableQuery,
    lte: () => unavailableQuery,
    order: () => unavailableQuery,
    limit: () => unavailableQuery,
    single: async () => ({ data: null, error }),
    then: (resolve: (v: { data: any; error: any }) => void) => resolve({ data: null, error }),
  };
  const unavailableFrom = () => ({
    select: () => unavailableQuery,
    insert: async () => ({ data: null, error }),
    update: async () => ({ data: null, error }),
    upsert: async () => ({ data: null, error }),
    delete: async () => ({ data: null, error }),
  });
  return {
    auth: unavailableAuth as any,
    from: unavailableFrom as any,
    rpc: async () => ({ data: null, error }),
  } as unknown as SupabaseClient;
};

let supabaseInstance: SupabaseClient;

if (isSupabaseConfigured) {
  const storage = getStorage();
  supabaseInstance = createClient(supabaseUrl, supabasePublishableKey, {
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
      '[Supabase] Not configured. Set EXPO_PUBLIC_SUPABASE_URL and ' +
        'EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY to enable the app.',
    );
  }
  supabaseInstance = createMockClient();
}

export const supabase = supabaseInstance;

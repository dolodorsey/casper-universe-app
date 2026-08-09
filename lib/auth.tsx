import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';
import { useGameStore } from '@/stores/useGameStore';

/**
 * Casper Universe — Auth context.
 *
 * Provides session/user info to the whole app and wires it into the game store.
 * Uses email OTP (no passwords) — Supabase sends a magic link / 6-digit code.
 */

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  // Actions
  signInWithEmail: (email: string) => Promise<{ error: string | null }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const setUserId = useGameStore((s) => s.setUserId);
  const syncFromServer = useGameStore((s) => s.syncFromServer);
  const reset = useGameStore((s) => s.reset);

  useEffect(() => {
    // 1. Read existing session on mount
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // 2. Listen for auth changes
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      data?.subscription?.unsubscribe?.();
    };
  }, []);

  // Wire session.user.id → game store userId, then trigger sync
  useEffect(() => {
    const userId = session?.user?.id ?? null;
    setUserId(userId);
    if (userId) {
      syncFromServer().catch(() => {});
    }
  }, [session?.user?.id, setUserId, syncFromServer]);

  const signInWithEmail = async (email: string) => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY in env.' };
    }
    const cleaned = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) {
      return { error: 'Please enter a valid email address.' };
    }
    const { error } = await supabase.auth.signInWithOtp({
      email: cleaned,
      options: {
        // Don't auto-create accounts via OTP if you want to gate signups; we want
        // open signup so users can join from any QR scan, so leave shouldCreateUser true.
        shouldCreateUser: true,
      },
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const verifyOtp = async (email: string, token: string) => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase is not configured.' };
    }
    const cleaned = email.trim().toLowerCase();
    const tokenClean = token.trim();
    if (tokenClean.length !== 6 || !/^\d{6}$/.test(tokenClean)) {
      return { error: 'Please enter the 6-digit code from your email.' };
    }
    const { error } = await supabase.auth.verifyOtp({
      email: cleaned,
      token: tokenClean,
      type: 'email',
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    reset();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        signInWithEmail,
        verifyOtp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

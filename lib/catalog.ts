import { supabase, isSupabaseConfigured } from './supabase';

export type CatalogBrand = {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  sort_order: number | null;
};

export type TriviaPack = {
  id: string;
  title: string;
  description: string | null;
  difficulty: string | null;
};

export type TriviaQuestion = {
  id: string;
  pack_id: string;
  question: string;
  choices: string[];
  answer_index: number;
  explanation: string | null;
  sort_order: number | null;
};

export async function loadCatalogBrands(): Promise<CatalogBrand[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('brands')
    .select('id,name,tagline,description,primary_color,secondary_color,sort_order')
    .eq('is_active', true)
    .order('sort_order');
  if (error) throw error;
  return (data ?? []) as CatalogBrand[];
}

export async function loadTrivia(): Promise<{ packs: TriviaPack[]; questions: TriviaQuestion[] }> {
  if (!isSupabaseConfigured) return { packs: [], questions: [] };
  const [{ data: packs, error: packsError }, { data: questions, error: questionsError }] = await Promise.all([
    supabase
      .from('trivia_packs')
      .select('id,title,description,difficulty')
      .eq('is_active', true),
    supabase
      .from('trivia_questions')
      .select('id,pack_id,question,choices,answer_index,explanation,sort_order')
      .eq('is_active', true)
      .order('sort_order'),
  ]);
  if (packsError) throw packsError;
  if (questionsError) throw questionsError;
  return {
    packs: (packs ?? []) as TriviaPack[],
    questions: (questions ?? []) as TriviaQuestion[],
  };
}

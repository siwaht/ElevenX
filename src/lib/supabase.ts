import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase credentials not configured');
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    const client = getSupabaseClient();
    const value = client[prop as keyof SupabaseClient];
    return typeof value === 'function' ? value.bind(client) : value;
  }
});

export interface Agent {
  id: string;
  name: string;
  prompt: string;
  first_message: string;
  language: string;
  voice_id: string | null;
  access_level: string;
  created_at: string;
  updated_at: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  tool_type: string;
  config: Record<string, unknown>;
  created_at: string;
}

export interface PhoneNumber {
  id: string;
  phone_number: string;
  provider: string;
  label: string;
  sid: string | null;
  agent_id: string | null;
  created_at: string;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  type: string;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Conversation {
  id: string;
  agent_id: string | null;
  phone_number: string | null;
  duration_seconds: number;
  status: string;
  transcript: string;
  metadata: Record<string, unknown>;
  started_at: string;
  ended_at: string | null;
}

export interface UsageStats {
  id: string;
  agent_id: string;
  date: string;
  character_count: number;
  call_count: number;
  total_duration_seconds: number;
  created_at: string;
}

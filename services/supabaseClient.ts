import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants';

// NOTE: In a real environment, these keys must be present.
// For this demo generation, we will initialize the client but often rely on local state
// if the keys are missing to ensure the UI renders for the user.
export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

/**
 * Expected Database Schema for 'jobs' table:
 * 
 * create table jobs (
 *   id uuid default gen_random_uuid() primary key,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null,
 *   title text not null,
 *   company text not null,
 *   location text,
 *   status text not null,
 *   description text,
 *   ai_analysis jsonb
 * );
 */
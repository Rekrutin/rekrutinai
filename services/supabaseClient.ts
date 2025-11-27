import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants';

// NOTE: In a real environment, these keys must be present.
// For this demo generation, we will initialize the client but often rely on local state
// if the keys are missing to ensure the UI renders for the user.
export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

/**
 * --- CMS / DATABASE SETUP INSTRUCTIONS ---
 * 
 * To use Supabase as your CMS/Backend for RekrutIn.ai:
 * 
 * 1. Create a new Supabase Project.
 * 2. Go to the SQL Editor and run the following script to create the tables:
 * 
 * -- Table for Job Seekers (Tracker)
 * create table jobs (
 *   id uuid default gen_random_uuid() primary key,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null,
 *   title text not null,
 *   company text not null,
 *   location text,
 *   status text not null,
 *   description text,
 *   ai_analysis jsonb,
 *   user_id uuid default auth.uid()
 * );
 * 
 * -- Table for Employers (Job Posting)
 * create table employer_jobs (
 *   id uuid default gen_random_uuid() primary key,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null,
 *   title text not null,
 *   location text not null,
 *   type text not null,
 *   salary_range text,
 *   applicants_count int default 0,
 *   status text default 'Active',
 *   description text not null,
 *   employer_id uuid default auth.uid()
 * );
 * 
 * 3. Set up Row Level Security (RLS) if you want to secure user data.
 * 4. Get your Project URL and Anon Key from Project Settings > API.
 * 5. Add them to your environment variables or constants.ts.
 */
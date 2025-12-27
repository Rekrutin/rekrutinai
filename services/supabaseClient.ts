
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants.ts';

export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

/**
 * --- SQL MIGRATION SCRIPTS ---
 * Run these in your Supabase SQL Editor:
 * 
 * -- 1. PROFILES TABLE
 * create table profiles (
 *   id uuid references auth.users not null primary key,
 *   email text unique not null,
 *   full_name text,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 * 
 * alter table profiles enable row level security;
 * create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
 * create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
 * create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
 * 
 * -- 2. RESUMES TABLE
 * create table resumes (
 *   id uuid default gen_random_uuid() primary key,
 *   user_id uuid references auth.users not null,
 *   title text not null,
 *   file_path text not null,
 *   extracted_text text,
 *   ats_score int default 0,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null,
 *   updated_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 * 
 * alter table resumes enable row level security;
 * create policy "Users can manage own resumes" on resumes for all using (auth.uid() = user_id);
 * 
 * -- 3. STORAGE BUCKET
 * -- Create a private bucket named 'resumes' in the Supabase Dashboard.
 * -- Then add these storage policies:
 * -- Policy: "Allow authenticated uploads" 
 * -- Target: 'resumes' bucket, for 'INSERT'
 * -- Check: (auth.role() = 'authenticated')
 * 
 * -- Policy: "Allow users to manage their own folder"
 * -- Target: 'resumes' bucket, for 'SELECT', 'DELETE'
 * -- Check: (storage.foldername(name))[1] = auth.uid()::text
 * 
 * -- 4. INDEXES
 * create index resumes_user_id_idx on resumes(user_id);
 * create index profiles_email_idx on profiles(email);
 */

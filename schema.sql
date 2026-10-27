-- My Health App database schema (Supabase PostgreSQL)
-- Run this whole file in Supabase Dashboard -> SQL Editor -> New query.
-- Row Level Security ensures each signed-in user can only access their own entries.

create table if not exists public.health_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null default current_date,
  entry_type text not null default 'Wellness note'
    check (entry_type in ('Wellness note', 'Symptoms to discuss', 'Medication note', 'Appointment note', 'Activity')),
  title text not null check (char_length(title) between 1 and 120),
  content text not null check (char_length(content) between 1 and 5000),
  created_at timestamptz not null default now()
);

create index if not exists health_records_user_date_idx
  on public.health_records (user_id, entry_date desc, created_at desc);

alter table public.health_records enable row level security;

drop policy if exists "Users can read their own health records" on public.health_records;
create policy "Users can read their own health records"
  on public.health_records for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own health records" on public.health_records;
create policy "Users can insert their own health records"
  on public.health_records for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own health records" on public.health_records;
create policy "Users can delete their own health records"
  on public.health_records for delete
  to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, delete on public.health_records to authenticated;

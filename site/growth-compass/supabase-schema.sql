-- Lucille Growth Compass Supabase schema
-- Run this in Supabase SQL Editor.

create table if not exists public.growth_entries (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  pillar text not null,
  note text not null,
  updated_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (user_id, entry_date)
);

alter table public.growth_entries enable row level security;

drop policy if exists "growth_entries_select_own" on public.growth_entries;
drop policy if exists "growth_entries_insert_own" on public.growth_entries;
drop policy if exists "growth_entries_update_own" on public.growth_entries;
drop policy if exists "growth_entries_delete_own" on public.growth_entries;

create policy "growth_entries_select_own"
on public.growth_entries
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "growth_entries_insert_own"
on public.growth_entries
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "growth_entries_update_own"
on public.growth_entries
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "growth_entries_delete_own"
on public.growth_entries
for delete
to authenticated
using ((select auth.uid()) = user_id);

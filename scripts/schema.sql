-- Inaya Debate — full database schema
-- Run once in the Supabase SQL editor when setting up a new project.
-- Before running, replace __SERVER_SECRET__ (bottom) with your SUPABASE_SERVER_SECRET value.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table if not exists public.app_config (
  key   text primary key,
  value text not null
);

create table if not exists public.schools (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  access_code text not null unique,
  created_at  timestamptz not null default now()
);

create table if not exists public.resources (
  id            uuid primary key default gen_random_uuid(),
  section       text not null,
  category      text not null default 'general',
  title         text not null,
  description   text,
  type          text not null,
  url           text,
  storage_path  text,
  content       text,
  debate_format text not null default 'all',
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

create table if not exists public.rounds (
  id            uuid primary key default gen_random_uuid(),
  school_id     uuid references public.schools(id) on delete set null,
  debate_format text not null,
  status        text not null default 'uploaded',
  audio_path    text,
  audio_type    text,
  transcript    text,
  analysis      jsonb,
  error         text,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security — public can only READ educational content.
-- Everything else goes through the SECURITY DEFINER functions below.
-- ---------------------------------------------------------------------------
alter table public.app_config enable row level security;
alter table public.schools    enable row level security;
alter table public.resources  enable row level security;
alter table public.rounds     enable row level security;

drop policy if exists "resources public read" on public.resources;
create policy "resources public read" on public.resources for select using (true);

-- ---------------------------------------------------------------------------
-- Secret guard
-- ---------------------------------------------------------------------------
create or replace function public.check_secret(p_secret text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_secret is null
     or p_secret is distinct from (select value from public.app_config where key = 'server_secret') then
    raise exception 'unauthorized';
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- RPCs
-- ---------------------------------------------------------------------------
create or replace function public.verify_access_code(p_code text)
returns setof public.schools language sql security definer set search_path = public as $$
  select * from public.schools where access_code = p_code limit 1;
$$;

create or replace function public.admin_list_schools(p_secret text)
returns setof public.schools language plpgsql security definer set search_path = public as $$
begin
  perform public.check_secret(p_secret);
  return query select * from public.schools order by created_at desc;
end;
$$;

create or replace function public.admin_create_school(p_secret text, p_name text, p_code text)
returns public.schools language plpgsql security definer set search_path = public as $$
declare r public.schools;
begin
  perform public.check_secret(p_secret);
  insert into public.schools (name, access_code) values (p_name, p_code) returning * into r;
  return r;
end;
$$;

create or replace function public.admin_delete_school(p_secret text, p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public.check_secret(p_secret);
  delete from public.schools where id = p_id;
end;
$$;

create or replace function public.admin_create_resource(
  p_secret text, p_section text, p_category text, p_title text, p_description text,
  p_type text, p_url text, p_storage_path text, p_content text, p_debate_format text, p_sort_order integer
) returns public.resources language plpgsql security definer set search_path = public as $$
declare r public.resources;
begin
  perform public.check_secret(p_secret);
  insert into public.resources
    (section, category, title, description, type, url, storage_path, content, debate_format, sort_order)
  values
    (p_section, p_category, p_title, p_description, p_type, p_url, p_storage_path, p_content,
     coalesce(p_debate_format, 'all'), coalesce(p_sort_order, 0))
  returning * into r;
  return r;
end;
$$;

create or replace function public.admin_delete_resource(p_secret text, p_id uuid)
returns public.resources language plpgsql security definer set search_path = public as $$
declare r public.resources;
begin
  perform public.check_secret(p_secret);
  delete from public.resources where id = p_id returning * into r;
  return r;
end;
$$;

create or replace function public.create_round(p_secret text, p_school_id uuid, p_format text)
returns public.rounds language plpgsql security definer set search_path = public as $$
declare r public.rounds;
begin
  perform public.check_secret(p_secret);
  insert into public.rounds (school_id, debate_format, status)
  values (p_school_id, p_format, 'uploaded') returning * into r;
  return r;
end;
$$;

create or replace function public.get_round(p_secret text, p_id uuid)
returns public.rounds language plpgsql security definer set search_path = public as $$
declare r public.rounds;
begin
  perform public.check_secret(p_secret);
  select * into r from public.rounds where id = p_id;
  return r;
end;
$$;

create or replace function public.update_round(
  p_secret text, p_id uuid, p_status text, p_audio_path text, p_audio_type text,
  p_transcript text, p_analysis jsonb, p_error text
) returns void language plpgsql security definer set search_path = public as $$
begin
  perform public.check_secret(p_secret);
  update public.rounds set
    status     = coalesce(p_status, status),
    audio_path = coalesce(p_audio_path, audio_path),
    audio_type = coalesce(p_audio_type, audio_type),
    transcript = coalesce(p_transcript, transcript),
    analysis   = coalesce(p_analysis, analysis),
    error      = coalesce(p_error, error)
  where id = p_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- Storage buckets + policies
--   library-files: public read; anon manage (admin uploads from the browser)
--   round-audio:   private; anon upload + read (students record from the browser)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('library-files', 'library-files', true),
       ('round-audio',   'round-audio',   false)
on conflict (id) do nothing;

drop policy if exists "library read"   on storage.objects;
drop policy if exists "library write"  on storage.objects;
drop policy if exists "library update" on storage.objects;
drop policy if exists "library delete" on storage.objects;
create policy "library read"   on storage.objects for select using      (bucket_id = 'library-files');
create policy "library write"  on storage.objects for insert with check (bucket_id = 'library-files');
create policy "library update" on storage.objects for update using      (bucket_id = 'library-files');
create policy "library delete" on storage.objects for delete using      (bucket_id = 'library-files');

drop policy if exists "round audio read"   on storage.objects;
drop policy if exists "round audio write"  on storage.objects;
drop policy if exists "round audio update" on storage.objects;
create policy "round audio read"   on storage.objects for select using      (bucket_id = 'round-audio');
create policy "round audio write"  on storage.objects for insert with check (bucket_id = 'round-audio');
create policy "round audio update" on storage.objects for update using      (bucket_id = 'round-audio');

-- ---------------------------------------------------------------------------
-- Server secret (guards the admin/round RPCs). Must equal SUPABASE_SERVER_SECRET.
-- ---------------------------------------------------------------------------
insert into public.app_config (key, value) values ('server_secret', '__SERVER_SECRET__')
on conflict (key) do update set value = excluded.value;

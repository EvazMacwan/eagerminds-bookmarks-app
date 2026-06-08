-- Profiles: one row per auth user, optional unique public handle
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  handle text unique,
  created_at timestamptz not null default now(),
  constraint profiles_handle_format check (
    handle is null
    or (
      handle ~ '^[a-z0-9_]{3,30}$'
      and handle not in ('login', 'signup', 'dashboard', 'auth', 'api', 'admin')
    )
  )
);

create index profiles_handle_idx on public.profiles (handle)
where handle is not null;

-- Bookmarks owned by a user
create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(trim(title)) > 0),
  url text not null check (char_length(trim(url)) > 0),
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index bookmarks_user_id_idx on public.bookmarks (user_id);
create index bookmarks_public_idx on public.bookmarks (user_id, is_public)
where is_public = true;

-- Keep updated_at current on edits
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger bookmarks_set_updated_at
before update on public.bookmarks
for each row
execute function public.set_updated_at();

-- Auto-create a profile when someone signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.bookmarks enable row level security;

-- Profiles: owners can read and update their row
create policy "Users can view own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Profiles: anyone can look up claimed handles (public profile pages)
create policy "Public can view profiles with handles"
on public.profiles
for select
to anon, authenticated
using (handle is not null);

-- Bookmarks: full CRUD for the owner only
create policy "Users can view own bookmarks"
on public.bookmarks
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
on public.bookmarks
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own bookmarks"
on public.bookmarks
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
on public.bookmarks
for delete
to authenticated
using (auth.uid() = user_id);

-- Bookmarks: visitors may read public items only
create policy "Public can view public bookmarks"
on public.bookmarks
for select
to anon, authenticated
using (is_public = true);

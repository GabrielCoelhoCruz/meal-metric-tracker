-- Create profiles table for user data
create table if not exists public.profiles (
  id uuid not null primary key,
  display_name text,
  height_cm numeric,
  gender text,
  birthdate date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy if not exists "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy if not exists "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy if not exists "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy if not exists "Users can delete their own profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- Trigger to update updated_at on profiles
create trigger if not exists trg_profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();

-- Create user preferences table
create table if not exists public.user_preferences (
  user_id uuid not null primary key,
  preferred_calorie_target integer,
  dietary_preferences text[],
  allergies text[],
  dislikes text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_preferences enable row level security;

create policy if not exists "Users can view their own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy if not exists "Users can insert their own preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

create policy if not exists "Users can update their own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy if not exists "Users can delete their own preferences"
  on public.user_preferences for delete
  using (auth.uid() = user_id);

-- Trigger to update updated_at on user_preferences
create trigger if not exists trg_user_preferences_updated_at
before update on public.user_preferences
for each row execute function public.update_updated_at_column();

-- Create body metrics table for progress history
create table if not exists public.body_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  date date not null default current_date,
  weight_kg numeric,
  body_fat_percent numeric,
  waist_cm numeric,
  chest_cm numeric,
  hip_cm numeric,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

create index if not exists idx_body_metrics_user_date on public.body_metrics(user_id, date desc);

alter table public.body_metrics enable row level security;

create policy if not exists "Users can view their own body metrics"
  on public.body_metrics for select
  using (auth.uid() = user_id);

create policy if not exists "Users can insert their own body metrics"
  on public.body_metrics for insert
  with check (auth.uid() = user_id);

create policy if not exists "Users can update their own body metrics"
  on public.body_metrics for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy if not exists "Users can delete their own body metrics"
  on public.body_metrics for delete
  using (auth.uid() = user_id);

-- Trigger to update updated_at on body_metrics
create trigger if not exists trg_body_metrics_updated_at
before update on public.body_metrics
for each row execute function public.update_updated_at_column();
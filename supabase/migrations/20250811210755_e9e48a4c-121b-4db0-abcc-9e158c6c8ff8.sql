-- Create analytics_daily table for aggregated daily metrics per user
create table if not exists public.analytics_daily (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  date date not null,
  total_meals integer not null default 0,
  completed_meals integer not null default 0,
  consumed_calories numeric not null default 0,
  consumed_carbohydrates numeric not null default 0,
  consumed_protein numeric not null default 0,
  consumed_fat numeric not null default 0,
  target_calories integer not null default 0,
  completion_rate integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

-- Enable RLS
alter table public.analytics_daily enable row level security;

-- Policies: users can manage their own analytics rows
create policy "Users can view their own analytics"
  on public.analytics_daily for select
  using (auth.uid() = user_id);

create policy "Users can insert their own analytics"
  on public.analytics_daily for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own analytics"
  on public.analytics_daily for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own analytics"
  on public.analytics_daily for delete
  using (auth.uid() = user_id);

-- Index to speed up queries by user/date
create index if not exists idx_analytics_daily_user_date on public.analytics_daily (user_id, date);

-- Trigger to auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end; $$ language plpgsql;

create trigger analytics_daily_set_updated_at
before update on public.analytics_daily
for each row execute function public.set_updated_at();

-- Function to refresh analytics for a given user and date
create or replace function public.refresh_analytics_for_day(_user_id uuid, _date date)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total_meals integer := 0;
  v_completed_meals integer := 0;
  v_target_calories integer := 0;
  v_calories numeric := 0;
  v_carbs numeric := 0;
  v_protein numeric := 0;
  v_fat numeric := 0;
  v_completion integer := 0;
begin
  -- total and completed meals
  select count(*)::int,
         count(*) filter (where m.is_completed)::int
    into v_total_meals, v_completed_meals
  from public.meals m
  join public.daily_plans dp on dp.id = m.daily_plan_id
  where dp.user_id = _user_id
    and dp.date = _date;

  -- target calories for the day
  select coalesce(max(dp.target_calories), 0)
    into v_target_calories
  from public.daily_plans dp
  where dp.user_id = _user_id and dp.date = _date;

  -- consumed macros: sum of completed meal items for that day
  select 
    coalesce(sum((mf.quantity / nullif(f.default_quantity,0)) * f.calories_per_unit), 0),
    coalesce(sum((mf.quantity / nullif(f.default_quantity,0)) * f.carbohydrates_per_unit), 0),
    coalesce(sum((mf.quantity / nullif(f.default_quantity,0)) * f.protein_per_unit), 0),
    coalesce(sum((mf.quantity / nullif(f.default_quantity,0)) * f.fat_per_unit), 0)
    into v_calories, v_carbs, v_protein, v_fat
  from public.meal_foods mf
  join public.meals m on m.id = mf.meal_id
  join public.daily_plans dp on dp.id = m.daily_plan_id
  join public.foods f on f.id = coalesce(mf.substituted_food_id, mf.food_id)
  where dp.user_id = _user_id
    and dp.date = _date
    and coalesce(mf.is_completed, false) = true;

  -- completion rate
  if v_total_meals > 0 then
    v_completion := round((v_completed_meals::numeric * 100) / v_total_meals)::int;
  else
    v_completion := 0;
  end if;

  -- upsert into analytics_daily
  insert into public.analytics_daily as ad (
    user_id, date, total_meals, completed_meals, consumed_calories, consumed_carbohydrates,
    consumed_protein, consumed_fat, target_calories, completion_rate
  ) values (
    _user_id, _date, v_total_meals, v_completed_meals, v_calories, v_carbs, v_protein, v_fat, v_target_calories, v_completion
  )
  on conflict (user_id, date)
  do update set
    total_meals = excluded.total_meals,
    completed_meals = excluded.completed_meals,
    consumed_calories = excluded.consumed_calories,
    consumed_carbohydrates = excluded.consumed_carbohydrates,
    consumed_protein = excluded.consumed_protein,
    consumed_fat = excluded.consumed_fat,
    target_calories = excluded.target_calories,
    completion_rate = excluded.completion_rate,
    updated_at = now();
end; $$;

-- Trigger functions to hook into updates
create or replace function public.trg_refresh_from_meal_foods()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid;
  v_date date;
  v_meal_id uuid;
begin
  if (tg_op = 'DELETE') then
    v_meal_id := old.meal_id;
  else
    v_meal_id := new.meal_id;
  end if;

  select dp.user_id, dp.date into v_user, v_date
  from public.meals m
  join public.daily_plans dp on dp.id = m.daily_plan_id
  where m.id = v_meal_id;

  if v_user is not null then
    perform public.refresh_analytics_for_day(v_user, v_date);
  end if;
  return null;
end; $$;

create or replace function public.trg_refresh_from_meals()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid;
  v_date date;
  v_meal_id uuid := coalesce(new.id, old.id);
begin
  select dp.user_id, dp.date into v_user, v_date
  from public.meals m
  join public.daily_plans dp on dp.id = m.daily_plan_id
  where m.id = v_meal_id;

  if v_user is not null then
    perform public.refresh_analytics_for_day(v_user, v_date);
  end if;
  return null;
end; $$;

create or replace function public.trg_refresh_from_daily_plans()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.refresh_analytics_for_day(coalesce(new.user_id, old.user_id), coalesce(new.date, old.date));
  return null;
end; $$;

-- Attach triggers
create trigger meal_foods_analytics_refresh
after insert or update or delete on public.meal_foods
for each row execute function public.trg_refresh_from_meal_foods();

create trigger meals_analytics_refresh
after insert or update or delete on public.meals
for each row execute function public.trg_refresh_from_meals();

create trigger daily_plans_analytics_refresh
after insert or update or delete on public.daily_plans
for each row execute function public.trg_refresh_from_daily_plans();
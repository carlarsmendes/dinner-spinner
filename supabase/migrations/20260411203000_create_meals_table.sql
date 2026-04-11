create table if not exists public.meals (
  id text primary key,
  household_id text not null,
  name text not null,
  types text[] not null default '{}'::text[],
  tags text[] not null default '{}'::text[],
  ingredients text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists meals_household_id_idx on public.meals (household_id);

create or replace function public.set_meals_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists meals_set_updated_at on public.meals;
create trigger meals_set_updated_at
before update on public.meals
for each row
execute function public.set_meals_updated_at();

alter table public.meals enable row level security;

drop policy if exists "anon can manage meals" on public.meals;
create policy "anon can manage meals"
on public.meals
for all
to anon
using (true)
with check (true);

create table if not exists public.profiles_candidate (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  area text,
  stack_principal text[] default '{}',
  senioridade text,
  experiencia_anos int,
  preferencia_local text,
  faixa_salarial jsonb default '{}',
  tipo_contrato text,
  soft_skills text[] default '{}',
  keywords_busca text[] default '{}',
  nivel_ingles text,
  perfil_json jsonb default '{}',
  entrevista_completa boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles_candidate enable row level security;

create policy "Users can view own candidate profile"
  on public.profiles_candidate for select
  using (auth.uid() = user_id);

create policy "Users can insert own candidate profile"
  on public.profiles_candidate for insert
  with check (auth.uid() = user_id);

create policy "Users can update own candidate profile"
  on public.profiles_candidate for update
  using (auth.uid() = user_id);

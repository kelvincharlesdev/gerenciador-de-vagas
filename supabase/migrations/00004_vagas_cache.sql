create table if not exists public.vagas_cache (
  id uuid primary key default gen_random_uuid(),
  id_externo text unique not null,
  titulo text not null,
  empresa text,
  local text,
  tipo text,
  fonte text,
  url text,
  salario text,
  senioridade text,
  descricao text,
  keywords_busca text[] default '{}',
  data_publicacao timestamptz,
  raw_json jsonb default '{}',
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '1 hour'
);

create index if not exists idx_vagas_cache_keywords on public.vagas_cache using gin (keywords_busca);
create index if not exists idx_vagas_cache_expires on public.vagas_cache (expires_at);

alter table public.vagas_cache enable row level security;

create policy "Anyone can read vagas_cache"
  on public.vagas_cache for select
  using (true);

create table if not exists public.vagas_favoritas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vaga_id uuid not null references public.vagas_cache(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, vaga_id)
);

alter table public.vagas_favoritas enable row level security;

create policy "Users can view own favorites"
  on public.vagas_favoritas for select
  using (auth.uid() = user_id);

create policy "Users can insert own favorites"
  on public.vagas_favoritas for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own favorites"
  on public.vagas_favoritas for delete
  using (auth.uid() = user_id);

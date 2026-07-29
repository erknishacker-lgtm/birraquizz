-- ==========================================================
-- Schema: rastreamento real do funil quiz-sono (por sessão)
-- Rode este arquivo inteiro no SQL Editor do Supabase
-- (Project: brfgyhdbibhiasuopfry) uma única vez.
-- ==========================================================

create extension if not exists pgcrypto;

-- ---------- Tabelas ----------

create table if not exists public.funnel_sessions (
  session_id uuid primary key,
  visitor_id text,
  funnel text not null default 'quiz-sono',
  started_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  ended_at timestamptz,
  current_step_index int not null default 0,
  current_step_id text,
  current_step_title text,
  total_steps int,
  max_step_index int not null default 0,
  completed boolean not null default false,
  converted boolean not null default false,
  time_on_site_ms bigint not null default 0,
  referrer text,
  landing_url text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  device_type text,
  browser text,
  os text,
  user_agent text,
  language text,
  screen_w int,
  screen_h int,
  created_at timestamptz not null default now()
);

create index if not exists idx_funnel_sessions_started_at on public.funnel_sessions (started_at desc);
create index if not exists idx_funnel_sessions_funnel on public.funnel_sessions (funnel);

create table if not exists public.funnel_events (
  id bigserial primary key,
  session_id uuid not null references public.funnel_sessions(session_id) on delete cascade,
  funnel text not null default 'quiz-sono',
  event_type text not null, -- session_start | step_view | step_exit | answer | button_click | cta_click
  step_index int,
  step_id text,
  step_title text,
  time_on_step_ms int,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_funnel_events_session on public.funnel_events (session_id);
create index if not exists idx_funnel_events_created_at on public.funnel_events (created_at desc);
create index if not exists idx_funnel_events_type on public.funnel_events (event_type);
create index if not exists idx_funnel_events_funnel_type on public.funnel_events (funnel, event_type);

-- ---------- RLS: o front-end (chave publishable/anon) só grava, nunca lê a tabela crua ----------

alter table public.funnel_sessions enable row level security;
alter table public.funnel_events enable row level security;

drop policy if exists "anon insert sessions" on public.funnel_sessions;
create policy "anon insert sessions" on public.funnel_sessions
  for insert to anon with check (true);

drop policy if exists "anon update sessions" on public.funnel_sessions;
create policy "anon update sessions" on public.funnel_sessions
  for update to anon using (true) with check (true);

drop policy if exists "anon insert events" on public.funnel_events;
create policy "anon insert events" on public.funnel_events
  for insert to anon with check (true);

-- (de propósito: nenhuma policy de SELECT para anon — leitura só via as funções abaixo)

-- ---------- Funções de leitura (RPC), únicas portas de entrada do painel ----------

create or replace function public.get_funnel_summary(
  p_funnel text default 'quiz-sono',
  p_from timestamptz default null,
  p_to timestamptz default null
)
returns table (
  total_sessions bigint,
  completed_sessions bigint,
  converted_sessions bigint,
  avg_time_on_site_ms numeric
)
language sql
security definer
set search_path = public
as $$
  select
    count(*) as total_sessions,
    count(*) filter (where completed) as completed_sessions,
    count(*) filter (where converted) as converted_sessions,
    avg(time_on_site_ms) filter (where time_on_site_ms > 0) as avg_time_on_site_ms
  from funnel_sessions
  where funnel = p_funnel
    and (p_from is null or started_at >= p_from)
    and (p_to is null or started_at < p_to);
$$;

create or replace function public.get_funnel_dashboard(
  p_funnel text default 'quiz-sono',
  p_from timestamptz default null,
  p_to timestamptz default null
)
returns table (
  step_index int,
  step_id text,
  step_title text,
  sessions_reached bigint,
  avg_time_ms numeric
)
language sql
security definer
set search_path = public
as $$
  with views as (
    select step_index, step_id, max(step_title) as step_title,
           count(distinct session_id) as sessions_reached
    from funnel_events
    where funnel = p_funnel
      and event_type = 'step_view'
      and step_index is not null
      and (p_from is null or created_at >= p_from)
      and (p_to is null or created_at < p_to)
    group by step_index, step_id
  ),
  exits as (
    select step_index, avg(time_on_step_ms) as avg_time_ms
    from funnel_events
    where funnel = p_funnel
      and event_type = 'step_exit'
      and time_on_step_ms is not null
      and (p_from is null or created_at >= p_from)
      and (p_to is null or created_at < p_to)
    group by step_index
  )
  select v.step_index, v.step_id, v.step_title, v.sessions_reached, e.avg_time_ms
  from views v
  left join exits e using (step_index)
  order by v.step_index;
$$;

create or replace function public.get_funnel_sessions(
  p_funnel text default 'quiz-sono',
  p_from timestamptz default null,
  p_to timestamptz default null,
  p_limit int default 1000
)
returns setof funnel_sessions
language sql
security definer
set search_path = public
as $$
  select *
  from funnel_sessions
  where funnel = p_funnel
    and (p_from is null or started_at >= p_from)
    and (p_to is null or started_at < p_to)
  order by started_at desc
  limit p_limit;
$$;

create or replace function public.get_session_events(p_session_id uuid)
returns setof funnel_events
language sql
security definer
set search_path = public
as $$
  select * from funnel_events where session_id = p_session_id order by created_at asc;
$$;

grant execute on function public.get_funnel_summary(text, timestamptz, timestamptz) to anon;
grant execute on function public.get_funnel_dashboard(text, timestamptz, timestamptz) to anon;
grant execute on function public.get_funnel_sessions(text, timestamptz, timestamptz, int) to anon;
grant execute on function public.get_session_events(uuid) to anon;

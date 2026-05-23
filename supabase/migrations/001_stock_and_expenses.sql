-- =============================================
-- GULAND — Stock por talle + Gastos
-- Correr en Supabase SQL Editor
-- =============================================

-- 1) Stock por talle en products (jsonb: { "M": 5, "L": 3, ... })
alter table public.products
  add column if not exists stock jsonb not null default '{}'::jsonb;

-- 2) Tabla de gastos
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  category text not null default 'general',
  amount integer not null,
  expense_date date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.expenses enable row level security;

drop policy if exists "Admins can do everything on expenses" on public.expenses;
create policy "Admins can do everything on expenses" on public.expenses
  using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- =============================================
-- GULAND — Guía de talles editable por producto
-- Correr en Supabase SQL Editor
-- =============================================

-- Guía de talles por producto (jsonb).
-- Forma: { "measurements": { "M": { "pecho": "92–96", "cintura": "74–78", "cadera": "98–102" }, ... }, "note": "..." }
-- Vacío ('{}') => la tienda usa la guía por defecto.
alter table public.products
  add column if not exists size_guide jsonb not null default '{}'::jsonb;

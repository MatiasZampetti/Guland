-- =============================================
-- GULAND — Configuración de la tienda + Envíos editables
-- Correr en Supabase SQL Editor
-- =============================================

-- 1) Settings escalares (key/value): WhatsApp, umbral envío gratis, descuento, tarifas por defecto
create table if not exists public.store_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);
alter table public.store_settings enable row level security;

drop policy if exists "Anyone can read store settings" on public.store_settings;
create policy "Anyone can read store settings" on public.store_settings
  for select using (true);

drop policy if exists "Admins can manage store settings" on public.store_settings;
create policy "Admins can manage store settings" on public.store_settings
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Valores iniciales (no pisa si ya existen)
insert into public.store_settings (key, value) values
  ('whatsapp_number', '5493573498196'),
  ('free_shipping_threshold', '30000'),
  ('cash_discount_percent', '15'),
  ('default_shipping_domicilio', '7000'),
  ('default_shipping_sucursal', '6000')
on conflict (key) do nothing;

-- 2) Zonas de envío (provincias o zonas propias) con tarifa base
create table if not exists public.shipping_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domicilio integer not null default 0,
  sucursal integer not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.shipping_zones enable row level security;

drop policy if exists "Anyone can read shipping zones" on public.shipping_zones;
create policy "Anyone can read shipping zones" on public.shipping_zones
  for select using (true);

drop policy if exists "Admins can manage shipping zones" on public.shipping_zones;
create policy "Admins can manage shipping zones" on public.shipping_zones
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- 3) Códigos postales puntuales dentro de una zona, con su propio precio
create table if not exists public.shipping_postal_codes (
  id uuid primary key default gen_random_uuid(),
  zone_id uuid not null references public.shipping_zones on delete cascade,
  postal_code text not null,
  domicilio integer not null default 0,
  sucursal integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.shipping_postal_codes enable row level security;

drop policy if exists "Anyone can read shipping postal codes" on public.shipping_postal_codes;
create policy "Anyone can read shipping postal codes" on public.shipping_postal_codes
  for select using (true);

drop policy if exists "Admins can manage shipping postal codes" on public.shipping_postal_codes;
create policy "Admins can manage shipping postal codes" on public.shipping_postal_codes
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Seed de provincias/CABA con tarifas estimadas (editables desde el admin).
-- Solo inserta si la tabla está vacía, para no duplicar en re-ejecuciones.
insert into public.shipping_zones (name, domicilio, sucursal, sort_order)
select * from (values
  ('Córdoba', 4500, 3500, 1),
  ('Buenos Aires', 5500, 4500, 2),
  ('CABA', 5500, 4500, 3),
  ('Santa Fe', 5000, 4000, 4),
  ('Entre Ríos', 5500, 4500, 5),
  ('San Luis', 5500, 4500, 6),
  ('La Pampa', 5500, 4500, 7),
  ('Mendoza', 6000, 5000, 8),
  ('San Juan', 6000, 5000, 9),
  ('La Rioja', 6000, 5000, 10),
  ('Catamarca', 6500, 5500, 11),
  ('Santiago del Estero', 6500, 5500, 12),
  ('Tucumán', 6500, 5500, 13),
  ('Corrientes', 6500, 5500, 14),
  ('Chaco', 6500, 5500, 15),
  ('Salta', 7000, 6000, 16),
  ('Jujuy', 7000, 6000, 17),
  ('Formosa', 7000, 6000, 18),
  ('Misiones', 7000, 6000, 19),
  ('Neuquén', 7500, 6500, 20),
  ('Río Negro', 7500, 6500, 21),
  ('Chubut', 8500, 7500, 22),
  ('Santa Cruz', 9500, 8500, 23),
  ('Tierra del Fuego', 10500, 9500, 24)
) as v(name, domicilio, sucursal, sort_order)
where not exists (select 1 from public.shipping_zones);

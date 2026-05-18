-- =============================================
-- GULAND — Schema inicial
-- Correr en Supabase SQL Editor
-- =============================================

-- Profiles (extiende auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Trigger: crear perfil al registrar usuario
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'Usuario'));
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  label text not null,
  image_url text not null,
  created_at timestamptz not null default now()
);
alter table public.categories enable row level security;
create policy "Anyone can read categories" on public.categories
  for select using (true);
create policy "Admins can insert categories" on public.categories
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );
create policy "Admins can delete categories" on public.categories
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  price integer not null,
  category_slug text not null references public.categories(slug) on update cascade on delete restrict,
  description text not null default '',
  images text[] not null default '{}',
  sizes text[] not null default '{}',
  featured boolean not null default false,
  is_new boolean not null default false,
  is_on_sale boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.products enable row level security;
create policy "Anyone can read products" on public.products
  for select using (true);
create policy "Admins can insert products" on public.products
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );
create policy "Admins can update products" on public.products
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );
create policy "Admins can delete products" on public.products
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Orders
create type order_status as enum ('pendiente', 'en_proceso', 'enviado', 'completado', 'cancelado');
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  customer_name text not null,
  customer_email text not null,
  status order_status not null default 'pendiente',
  total integer not null,
  payment_method text not null default 'whatsapp',
  created_at timestamptz not null default now()
);
alter table public.orders enable row level security;
create policy "Users can read own orders" on public.orders
  for select using (auth.uid() = user_id);
create policy "Admins can read all orders" on public.orders
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );
create policy "Anyone can insert orders" on public.orders
  for insert with check (true);
create policy "Admins can update orders" on public.orders
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Order Items
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders on delete cascade,
  product_id uuid references public.products on delete set null,
  product_name text not null,
  size text not null,
  quantity integer not null,
  price integer not null
);
alter table public.order_items enable row level security;
create policy "Users can read own order items" on public.order_items
  for select using (
    exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
  );
create policy "Admins can read all order items" on public.order_items
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );
create policy "Anyone can insert order items" on public.order_items
  for insert with check (true);

-- Sales (ventas manuales desde admin)
create type payment_method as enum ('efectivo', 'transferencia', 'mercadopago', 'tarjeta');
create table public.sales (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products on delete set null,
  product_name text not null,
  customer_name text not null,
  size text not null,
  quantity integer not null,
  unit_price integer not null,
  total integer not null,
  payment_method payment_method not null,
  created_at timestamptz not null default now()
);
alter table public.sales enable row level security;
create policy "Admins can do everything on sales" on public.sales
  using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- FAQ Categories
create table public.faq_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);
alter table public.faq_categories enable row level security;
create policy "Anyone can read faq categories" on public.faq_categories
  for select using (true);
create policy "Admins can manage faq categories" on public.faq_categories
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- FAQ Items
create table public.faq_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.faq_categories on delete cascade,
  question text not null,
  answer text not null,
  created_at timestamptz not null default now()
);
alter table public.faq_items enable row level security;
create policy "Anyone can read faq items" on public.faq_items
  for select using (true);
create policy "Admins can manage faq items" on public.faq_items
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Storage buckets
insert into storage.buckets (id, name, public) values ('products', 'products', true);
insert into storage.buckets (id, name, public) values ('categories', 'categories', true);

create policy "Anyone can read product images" on storage.objects
  for select using (bucket_id = 'products');
create policy "Admins can upload product images" on storage.objects
  for insert with check (
    bucket_id = 'products' and
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );
create policy "Admins can delete product images" on storage.objects
  for delete using (
    bucket_id = 'products' and
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Anyone can read category images" on storage.objects
  for select using (bucket_id = 'categories');
create policy "Admins can upload category images" on storage.objects
  for insert with check (
    bucket_id = 'categories' and
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );
create policy "Admins can delete category images" on storage.objects
  for delete using (
    bucket_id = 'categories' and
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

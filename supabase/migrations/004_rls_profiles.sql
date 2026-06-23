-- RLS en profiles: cada usuario solo puede leer y editar su propio perfil.
-- Los admins acceden via service role key (bypasea RLS), por eso no hace falta política admin.

alter table public.profiles enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can read own profile'
  ) then
    execute 'create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id)';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can update own profile'
  ) then
    execute 'create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id)';
  end if;
end;
$$;

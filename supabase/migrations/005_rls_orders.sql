-- RLS en orders y order_items: cada usuario solo ve sus propios pedidos.
-- El admin accede via service role key (bypasea RLS).
-- Pedidos de invitados (user_id IS NULL) no son visibles para nadie via RLS.

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'orders' and policyname = 'Users can read own orders'
  ) then
    execute 'create policy "Users can read own orders" on public.orders for select using (auth.uid() = user_id)';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'order_items' and policyname = 'Users can read own order items'
  ) then
    execute $policy$
      create policy "Users can read own order items" on public.order_items
      for select using (
        exists (
          select 1 from public.orders
          where orders.id = order_items.order_id
            and orders.user_id = auth.uid()
        )
      )
    $policy$;
  end if;
end;
$$;

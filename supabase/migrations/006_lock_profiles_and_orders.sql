-- 006: cierra dos agujeros de RLS.
--
-- 1) profiles: la política "Users can update own profile" permitía a cualquier
--    usuario logueado cambiar cualquier columna de su perfil, incluida is_admin
--    (escalada a admin con la anon key). La app nunca actualiza profiles desde
--    el cliente, así que se elimina la política y se quitan los permisos de UPDATE.
--    Los admins siguen operando vía service role (bypasea RLS y grants).
drop policy if exists "Users can update own profile" on public.profiles;
revoke insert, update, delete on public.profiles from anon, authenticated;

-- 2) orders / order_items: "Anyone can insert ..." dejaba crear pedidos falsos
--    o con precios inventados directo con la anon key. Los pedidos se gestionan
--    por WhatsApp y desde el admin (service role), así que no hace falta.
drop policy if exists "Anyone can insert orders" on public.orders;
drop policy if exists "Anyone can insert order items" on public.order_items;
revoke insert, update, delete on public.orders from anon, authenticated;
revoke insert, update, delete on public.order_items from anon, authenticated;

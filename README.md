# Guland

E-commerce de ropa unisex. Next.js (App Router) + Supabase + Tailwind/shadcn.

## Desarrollo

1. Crear `.env.local` con:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
2. Crear la base corriendo `supabase/schema.sql` y luego `supabase/migrations/*.sql` en orden, desde el SQL Editor de Supabase.
3. `npm install && npm run dev`

## Estructura

- `app/(store)` — tienda pública
- `app/admin` — panel de administración (requiere `profiles.is_admin = true`)
- `app/api` — rutas API; las de escritura usan `requireAdmin()` + service role
- `supabase/` — schema y migraciones

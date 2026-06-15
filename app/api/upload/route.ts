import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/supabase/require-admin'
import { NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const formData = await request.formData()
  const file = formData.get('file') as File
  const bucket = formData.get('bucket') as string ?? 'products'

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const inputBuffer = Buffer.from(await file.arrayBuffer())

  // Redimensionamos a un máximo razonable y convertimos a WebP para bajar el peso.
  // Si sharp no puede procesar el archivo (formato no soportado), subimos el original.
  let body: Buffer = inputBuffer
  let contentType = file.type
  let ext = file.name.split('.').pop() ?? 'bin'
  try {
    body = await sharp(inputBuffer)
      .rotate() // respeta la orientación EXIF
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer()
    contentType = 'image/webp'
    ext = 'webp'
  } catch {
    // fallback: se sube el archivo tal cual
  }

  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const admin = createAdminClient()
  const { error } = await admin.storage
    .from(bucket)
    .upload(fileName, body, { contentType, upsert: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = admin.storage.from(bucket).getPublicUrl(fileName)
  return NextResponse.json({ url: publicUrl }, { status: 201 })
}

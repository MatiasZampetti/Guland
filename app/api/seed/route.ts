import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

const seedCategories = [
  { slug: 'buzos', label: 'Buzos', image_url: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80' },
  { slug: 'camperas', label: 'Camperas', image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80' },
  { slug: 'sweaters', label: 'Sweaters', image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80' },
  { slug: 'remeras', label: 'Remeras', image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80' },
  { slug: 'jeans', label: 'Jeans', image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80' },
  { slug: 'bermudas', label: 'Bermudas', image_url: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&q=80' },
]

const seedProducts = [
  { slug: 'buzo-basico-negro', name: 'Buzo Básico Negro', price: 18500, category_slug: 'buzos', description: 'Buzo de algodón premium con corte relajado. Ideal para el día a día.', images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80', 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&q=80'], sizes: ['S', 'M', 'L', 'XL'], featured: true, is_new: true, is_on_sale: false },
  { slug: 'buzo-hoodie-gris', name: 'Hoodie Gris Oversize', price: 22000, category_slug: 'buzos', description: 'Hoodie oversize con capucha doble y bolsillo canguro. Algodón 320g.', images: ['https://images.unsplash.com/photo-1611911813383-67769b37a149?w=800&q=80', 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=800&q=80'], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], featured: true, is_new: false, is_on_sale: true },
  { slug: 'buzo-crew-beige', name: 'Crew Neck Beige', price: 19000, category_slug: 'buzos', description: 'Buzo cuello redondo en tono beige neutro. Perfecto para layering.', images: ['https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=800&q=80', 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80'], sizes: ['S', 'M', 'L'], featured: false, is_new: true, is_on_sale: false },
  { slug: 'campera-rompevientos-negra', name: 'Rompevientos Negro', price: 35000, category_slug: 'camperas', description: 'Rompevientos impermeable con capucha plegable. Ideal para outdoor.', images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80', 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800&q=80'], sizes: ['S', 'M', 'L', 'XL'], featured: true, is_new: true, is_on_sale: false },
  { slug: 'campera-bomber-verde', name: 'Bomber Verde Militar', price: 42000, category_slug: 'camperas', description: 'Campera bomber estilo militar con ribetes y bolsillos frontales.', images: ['https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&q=80', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80'], sizes: ['M', 'L', 'XL', 'XXL'], featured: false, is_new: false, is_on_sale: true },
  { slug: 'campera-denim-lavada', name: 'Campera Denim Lavada', price: 38000, category_slug: 'camperas', description: 'Campera de jean con lavado desgastado. Un clásico reinventado.', images: ['https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&q=80', 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800&q=80'], sizes: ['XS', 'S', 'M', 'L'], featured: false, is_new: true, is_on_sale: false },
  { slug: 'sweater-lana-crudo', name: 'Sweater Lana Crudo', price: 28000, category_slug: 'sweaters', description: 'Sweater de lana merino en tono crudo. Tejido grueso para el invierno.', images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80'], sizes: ['S', 'M', 'L', 'XL'], featured: true, is_new: false, is_on_sale: true },
  { slug: 'sweater-rayado-marino', name: 'Sweater Rayado Marino', price: 24000, category_slug: 'sweaters', description: 'Sweater a rayas en azul marino y blanco. Mezcla de lana y algodón.', images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80'], sizes: ['XS', 'S', 'M', 'L'], featured: false, is_new: true, is_on_sale: false },
  { slug: 'remera-basica-blanca', name: 'Remera Básica Blanca', price: 8500, category_slug: 'remeras', description: 'Remera de algodón peinado 180g. Corte regular. El básico esencial.', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80'], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], featured: true, is_new: false, is_on_sale: true },
  { slug: 'remera-oversize-negra', name: 'Remera Oversize Negra', price: 10000, category_slug: 'remeras', description: 'Remera oversized en negro profundo. 100% algodón, hombros caídos.', images: ['https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], featured: false, is_new: true, is_on_sale: false },
  { slug: 'remera-manga-larga-gris', name: 'Manga Larga Gris', price: 11500, category_slug: 'remeras', description: 'Remera manga larga en gris medio. Ideal para layering en temporadas frías.', images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80', 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80'], sizes: ['XS', 'S', 'M', 'L'], featured: false, is_new: false, is_on_sale: false },
  { slug: 'jean-recto-azul', name: 'Jean Recto Azul', price: 32000, category_slug: 'jeans', description: 'Jean de corte recto en denim azul medio. 5 bolsillos clásicos.', images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80', 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80'], sizes: ['S', 'M', 'L', 'XL'], featured: true, is_new: false, is_on_sale: true },
  { slug: 'jean-negro-slim', name: 'Jean Negro Slim', price: 30000, category_slug: 'jeans', description: 'Jean slim fit en negro. Corte moderno y versátil para cualquier ocasión.', images: ['https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80'], sizes: ['XS', 'S', 'M', 'L', 'XL'], featured: false, is_new: true, is_on_sale: false },
  { slug: 'jean-wide-leg-claro', name: 'Jean Wide Leg Claro', price: 34000, category_slug: 'jeans', description: 'Jean de pierna ancha en denim claro. Tendencia actual con comodidad máxima.', images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80'], sizes: ['S', 'M', 'L'], featured: false, is_new: true, is_on_sale: false },
  { slug: 'bermuda-cargo-kaki', name: 'Bermuda Cargo Kaki', price: 16000, category_slug: 'bermudas', description: 'Bermuda cargo en color kaki con múltiples bolsillos. Tela ripstop liviana.', images: ['https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&q=80', 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=800&q=80'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], featured: true, is_new: false, is_on_sale: true },
  { slug: 'bermuda-denim-azul', name: 'Bermuda Denim Azul', price: 18000, category_slug: 'bermudas', description: 'Bermuda de jean azul con basta cruda. Largo midi.', images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=800&q=80', 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&q=80'], sizes: ['XS', 'S', 'M', 'L'], featured: false, is_new: true, is_on_sale: false },
]

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 })
  }

  const admin = createAdminClient()

  const { error: catError } = await admin
    .from('categories')
    .upsert(seedCategories, { onConflict: 'slug' })

  if (catError) return NextResponse.json({ error: catError.message }, { status: 500 })

  const { error: prodError } = await admin
    .from('products')
    .upsert(seedProducts, { onConflict: 'slug' })

  if (prodError) return NextResponse.json({ error: prodError.message }, { status: 500 })

  return NextResponse.json({ ok: true, categories: seedCategories.length, products: seedProducts.length })
}

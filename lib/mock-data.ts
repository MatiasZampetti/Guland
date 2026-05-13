import { Product } from '@/types'

export const products: Product[] = [
  // BUZOS
  {
    id: '1',
    slug: 'buzo-basico-negro',
    name: 'Buzo Básico Negro',
    price: 18500,
    category: 'buzos',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80',
      'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Buzo de algodón premium con corte relajado. Ideal para el día a día.',
    featured: true,
    isNew: true,
  },
  {
    id: '2',
    slug: 'buzo-hoodie-gris',
    name: 'Hoodie Gris Oversize',
    price: 22000,
    category: 'buzos',
    images: [
      'https://images.unsplash.com/photo-1611911813383-67769b37a149?w=800&q=80',
      'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=800&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Hoodie oversize con capucha doble y bolsillo canguro. Algodón 320g.',
    featured: true,
    isOnSale: true,
  },
  {
    id: '3',
    slug: 'buzo-crew-beige',
    name: 'Crew Neck Beige',
    price: 19000,
    category: 'buzos',
    images: [
      'https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=800&q=80',
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L'],
    description: 'Buzo cuello redondo en tono beige neutro. Perfecto para layering.',
    isNew: true,
  },

  // CAMPERAS
  {
    id: '4',
    slug: 'campera-rompevientos-negra',
    name: 'Rompevientos Negro',
    price: 35000,
    category: 'camperas',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
      'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Rompevientos impermeable con capucha plegable. Ideal para outdoor.',
    featured: true,
    isNew: true,
  },
  {
    id: '5',
    slug: 'campera-bomber-verde',
    name: 'Bomber Verde Militar',
    price: 42000,
    category: 'camperas',
    images: [
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    description: 'Campera bomber estilo militar con ribetes y bolsillos frontales.',
    isOnSale: true,
  },
  {
    id: '6',
    slug: 'campera-denim-lavada',
    name: 'Campera Denim Lavada',
    price: 38000,
    category: 'camperas',
    images: [
      'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&q=80',
      'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Campera de jean con lavado desgastado. Un clásico reinventado.',
    isNew: true,
  },

  // SWEATERS
  {
    id: '7',
    slug: 'sweater-lana-crudo',
    name: 'Sweater Lana Crudo',
    price: 28000,
    category: 'sweaters',
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Sweater de lana merino en tono crudo. Tejido grueso para el invierno.',
    featured: true,
    isOnSale: true,
  },
  {
    id: '8',
    slug: 'sweater-rayado-marino',
    name: 'Sweater Rayado Marino',
    price: 24000,
    category: 'sweaters',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Sweater a rayas en azul marino y blanco. Mezcla de lana y algodón.',
    isNew: true,
  },

  // REMERAS
  {
    id: '9',
    slug: 'remera-basica-blanca',
    name: 'Remera Básica Blanca',
    price: 8500,
    category: 'remeras',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Remera de algodón peinado 180g. Corte regular. El básico esencial.',
    featured: true,
    isOnSale: true,
  },
  {
    id: '10',
    slug: 'remera-oversize-negra',
    name: 'Remera Oversize Negra',
    price: 10000,
    category: 'remeras',
    images: [
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Remera oversized en negro profundo. 100% algodón, hombros caídos.',
    isNew: true,
  },
  {
    id: '11',
    slug: 'remera-manga-larga-gris',
    name: 'Manga Larga Gris',
    price: 11500,
    category: 'remeras',
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80',
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Remera manga larga en gris medio. Ideal para layering en temporadas frías.',
  },

  // JEANS
  {
    id: '12',
    slug: 'jean-recto-azul',
    name: 'Jean Recto Azul',
    price: 32000,
    category: 'jeans',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Jean de corte recto en denim azul medio. 5 bolsillos clásicos.',
    featured: true,
    isOnSale: true,
  },
  {
    id: '13',
    slug: 'jean-negro-slim',
    name: 'Jean Negro Slim',
    price: 30000,
    category: 'jeans',
    images: [
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Jean slim fit en negro. Corte moderno y versátil para cualquier ocasión.',
    isNew: true,
  },
  {
    id: '14',
    slug: 'jean-wide-leg-claro',
    name: 'Jean Wide Leg Claro',
    price: 34000,
    category: 'jeans',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L'],
    description: 'Jean de pierna ancha en denim claro. Tendencia actual con comodidad máxima.',
    isNew: true,
  },

  // BERMUDAS
  {
    id: '15',
    slug: 'bermuda-cargo-kaki',
    name: 'Bermuda Cargo Kaki',
    price: 16000,
    category: 'bermudas',
    images: [
      'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&q=80',
      'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Bermuda cargo en color kaki con múltiples bolsillos. Tela ripstop liviana.',
    featured: true,
    isOnSale: true,
  },
  {
    id: '16',
    slug: 'bermuda-denim-azul',
    name: 'Bermuda Denim Azul',
    price: 18000,
    category: 'bermudas',
    images: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=800&q=80',
      'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Bermuda de jean azul con basta cruda. Largo midi.',
    isNew: true,
  },
]

export const categories = [
  { slug: 'buzos', label: 'Buzos', image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80' },
  { slug: 'camperas', label: 'Camperas', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80' },
  { slug: 'sweaters', label: 'Sweaters', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80' },
  { slug: 'remeras', label: 'Remeras', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80' },
  { slug: 'jeans', label: 'Jeans', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80' },
  { slug: 'bermudas', label: 'Bermudas', image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&q=80' },
]

export const featuredProducts = products.filter((p) => p.featured)

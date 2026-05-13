'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FaqItem {
  id: string
  q: string
  a: string
}

export interface FaqCategory {
  id: string
  category: string
  items: FaqItem[]
}

interface FaqStore {
  categories: FaqCategory[]
  addCategory: (category: string) => void
  updateCategory: (id: string, category: string) => void
  deleteCategory: (id: string) => void
  addItem: (categoryId: string, q: string, a: string) => void
  updateItem: (categoryId: string, itemId: string, q: string, a: string) => void
  deleteItem: (categoryId: string, itemId: string) => void
}

const defaultCategories: FaqCategory[] = [
  {
    id: 'envios',
    category: 'ENVÍOS',
    items: [
      { id: 'e1', q: '¿Cuánto tarda en llegar mi pedido?', a: 'Los envíos a todo el país tardan entre 3 y 7 días hábiles. Para Villa del Rosario y alrededores el plazo es de 1 a 2 días hábiles.' },
      { id: 'e2', q: '¿Cuánto cuesta el envío?', a: 'El envío tiene un costo fijo. Los pedidos que superen los $30.000 tienen envío gratis a todo el país.' },
      { id: 'e3', q: '¿Cómo puedo rastrear mi pedido?', a: 'Una vez despachado tu pedido, te enviamos el número de seguimiento por WhatsApp para que puedas rastrearlo en tiempo real.' },
      { id: 'e4', q: '¿Envían a todo el país?', a: 'Sí, realizamos envíos a toda la Argentina a través de correo y servicios de mensajería.' },
    ],
  },
  {
    id: 'devoluciones',
    category: 'DEVOLUCIONES',
    items: [
      { id: 'd1', q: '¿Puedo devolver un producto?', a: 'Sí. Aceptamos devoluciones dentro de los 10 días corridos desde la recepción del pedido, siempre que el producto esté sin uso, con etiquetas y en su empaque original.' },
      { id: 'd2', q: '¿Cómo inicio una devolución?', a: 'Escribinos por WhatsApp con tu número de pedido y el motivo de la devolución. Te guiamos en todo el proceso.' },
      { id: 'd3', q: '¿Me devuelven el dinero o me dan un cambio?', a: 'Podemos hacer cambio de talla o producto, o acreditar el monto en tu cuenta para usar en tu próxima compra.' },
      { id: 'd4', q: '¿Qué pasa si recibo un producto con defecto?', a: 'Si el producto tiene algún defecto de fabricación, hacemos el cambio sin costo para vos. Escribinos dentro de las 48 hs de recibido el pedido.' },
    ],
  },
  {
    id: 'talles',
    category: 'GUÍA DE TALLES',
    items: [
      { id: 't1', q: '¿Cómo sé qué talle elegir?', a: 'En cada producto encontrás la tabla de medidas. Te recomendamos medir tu pecho, cintura y cadera para comparar con la guía.' },
      { id: 't2', q: '¿Los talles son estándar argentinos?', a: 'Sí, usamos talles S / M / L / XL / XXL. Si estás entre dos talles, recomendamos el más grande para una mejor caída.' },
      { id: 't3', q: '¿Los productos encogen al lavar?', a: 'Nuestras prendas están tratadas para minimizar el encogimiento. Igual, recomendamos lavar en frío y dejar secar al aire.' },
    ],
  },
  {
    id: 'pagos',
    category: 'PAGOS',
    items: [
      { id: 'p1', q: '¿Qué medios de pago aceptan?', a: 'Aceptamos transferencia bancaria, Mercado Pago y efectivo (para entregas locales en Villa del Rosario).' },
      { id: 'p2', q: '¿Puedo pagar en cuotas?', a: 'Sí, a través de Mercado Pago podés abonar en cuotas con tarjeta de crédito según las promociones vigentes.' },
    ],
  },
]

const uid = () => Math.random().toString(36).slice(2, 9)

export const useFaqStore = create<FaqStore>()(
  persist(
    (set) => ({
      categories: defaultCategories,

      addCategory: (category) =>
        set((s) => ({
          categories: [...s.categories, { id: uid(), category, items: [] }],
        })),

      updateCategory: (id, category) =>
        set((s) => ({
          categories: s.categories.map((c) => (c.id === id ? { ...c, category } : c)),
        })),

      deleteCategory: (id) =>
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),

      addItem: (categoryId, q, a) =>
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === categoryId
              ? { ...c, items: [...c.items, { id: uid(), q, a }] }
              : c
          ),
        })),

      updateItem: (categoryId, itemId, q, a) =>
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === categoryId
              ? { ...c, items: c.items.map((i) => (i.id === itemId ? { ...i, q, a } : i)) }
              : c
          ),
        })),

      deleteItem: (categoryId, itemId) =>
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === categoryId
              ? { ...c, items: c.items.filter((i) => i.id !== itemId) }
              : c
          ),
        })),
    }),
    { name: 'guland-faq' }
  )
)

export const mockStats = {
  ingresosMes: 1_248_500,
  pedidosMes: 47,
  totalProductos: 16,
  totalUsuarios: 32,
  ingresosAnterior: 980_000,
  pedidosAnterior: 38,
}

export type OrderStatus = 'pendiente' | 'en_proceso' | 'enviado' | 'completado' | 'cancelado'

export interface MockOrder {
  id: string
  cliente: string
  email: string
  fecha: string
  items: number
  total: number
  estado: OrderStatus
}

export const mockOrders: MockOrder[] = [
  { id: 'ORD-047', cliente: 'Valentina López', email: 'valen@email.com', fecha: '2026-05-09', items: 2, total: 47000, estado: 'pendiente' },
  { id: 'ORD-046', cliente: 'Matías García', email: 'mati@email.com', fecha: '2026-05-08', items: 1, total: 22000, estado: 'en_proceso' },
  { id: 'ORD-045', cliente: 'Lucía Fernández', email: 'lu@email.com', fecha: '2026-05-08', items: 3, total: 78500, estado: 'enviado' },
  { id: 'ORD-044', cliente: 'Tomás Martínez', email: 'tomas@email.com', fecha: '2026-05-07', items: 1, total: 32000, estado: 'completado' },
  { id: 'ORD-043', cliente: 'Sofía Ramírez', email: 'sofi@email.com', fecha: '2026-05-07', items: 2, total: 55000, estado: 'completado' },
  { id: 'ORD-042', cliente: 'Juan Pérez', email: 'juanp@email.com', fecha: '2026-05-06', items: 1, total: 18500, estado: 'cancelado' },
  { id: 'ORD-041', cliente: 'Camila Torres', email: 'cami@email.com', fecha: '2026-05-06', items: 4, total: 98000, estado: 'completado' },
  { id: 'ORD-040', cliente: 'Diego Sánchez', email: 'diego@email.com', fecha: '2026-05-05', items: 2, total: 42000, estado: 'completado' },
]

export interface MockUser {
  id: string
  nombre: string
  email: string
  pedidos: number
  gastado: number
  registro: string
  estado: 'activo' | 'inactivo'
}

export const mockUsers: MockUser[] = [
  { id: 'USR-001', nombre: 'Valentina López', email: 'valen@email.com', pedidos: 3, gastado: 124000, registro: '2026-02-14', estado: 'activo' },
  { id: 'USR-002', nombre: 'Matías García', email: 'mati@email.com', pedidos: 1, gastado: 22000, registro: '2026-04-20', estado: 'activo' },
  { id: 'USR-003', nombre: 'Lucía Fernández', email: 'lu@email.com', pedidos: 5, gastado: 210500, registro: '2025-11-03', estado: 'activo' },
  { id: 'USR-004', nombre: 'Tomás Martínez', email: 'tomas@email.com', pedidos: 2, gastado: 54000, registro: '2026-01-18', estado: 'activo' },
  { id: 'USR-005', nombre: 'Sofía Ramírez', email: 'sofi@email.com', pedidos: 4, gastado: 178000, registro: '2025-12-05', estado: 'activo' },
  { id: 'USR-006', nombre: 'Juan Pérez', email: 'juanp@email.com', pedidos: 1, gastado: 0, registro: '2026-05-01', estado: 'inactivo' },
  { id: 'USR-007', nombre: 'Camila Torres', email: 'cami@email.com', pedidos: 6, gastado: 312000, registro: '2025-10-22', estado: 'activo' },
  { id: 'USR-008', nombre: 'Diego Sánchez', email: 'diego@email.com', pedidos: 2, gastado: 42000, registro: '2026-03-09', estado: 'activo' },
]

// Finanzas
export interface FinanzasMes {
  mes: string
  ventas: number
  costos: number
  ganancia: number
}

export const finanzasMensuales: FinanzasMes[] = [
  { mes: 'Ene', ventas: 780000, costos: 312000, ganancia: 468000 },
  { mes: 'Feb', ventas: 920000, costos: 368000, ganancia: 552000 },
  { mes: 'Mar', ventas: 1050000, costos: 420000, ganancia: 630000 },
  { mes: 'Abr', ventas: 980000, costos: 392000, ganancia: 588000 },
  { mes: 'May', ventas: 1248500, costos: 499400, ganancia: 749100 },
]

export const finanzasResumen = {
  ingresosTotales: 4978500,
  costosTotales: 1991400,
  gananciaTotal: 2987100,
  rentabilidadPct: 60,
  inversionProductos: 380000,
  inversionMarketing: 45000,
  inversionLogistica: 72000,
  inversionOtros: 18000,
}

// Ventas registradas
export type MetodoPago = 'efectivo' | 'transferencia' | 'mercadopago' | 'tarjeta'

export interface VentaRegistrada {
  id: string
  fecha: string
  hora: string
  cliente: string
  producto: string
  talle: string
  cantidad: number
  precioUnitario: number
  total: number
  metodoPago: MetodoPago
}

export const ventasIniciales: VentaRegistrada[] = [
  { id: 'V-031', fecha: '2026-05-13', hora: '14:32', cliente: 'Roberto Álvarez', producto: 'Rompevientos Negro', talle: 'L', cantidad: 1, precioUnitario: 35000, total: 35000, metodoPago: 'mercadopago' },
  { id: 'V-030', fecha: '2026-05-13', hora: '11:15', cliente: 'Ana Gutiérrez', producto: 'Buzo Básico Negro', talle: 'M', cantidad: 2, precioUnitario: 18500, total: 37000, metodoPago: 'transferencia' },
  { id: 'V-029', fecha: '2026-05-12', hora: '18:45', cliente: 'Carlos Medina', producto: 'Hoodie Gris Oversize', talle: 'S', cantidad: 1, precioUnitario: 22000, total: 22000, metodoPago: 'efectivo' },
  { id: 'V-028', fecha: '2026-05-12', hora: '16:20', cliente: 'Martina Vega', producto: 'Crew Neck Beige', talle: 'XL', cantidad: 3, precioUnitario: 19000, total: 57000, metodoPago: 'tarjeta' },
  { id: 'V-027', fecha: '2026-05-11', hora: '12:05', cliente: 'Federico Rojas', producto: 'Rompevientos Negro', talle: 'M', cantidad: 1, precioUnitario: 35000, total: 35000, metodoPago: 'mercadopago' },
  { id: 'V-026', fecha: '2026-05-11', hora: '10:30', cliente: 'Luciana Prieto', producto: 'Buzo Básico Negro', talle: 'S', cantidad: 1, precioUnitario: 18500, total: 18500, metodoPago: 'transferencia' },
  { id: 'V-025', fecha: '2026-05-10', hora: '19:00', cliente: 'Emiliano Costa', producto: 'Hoodie Gris Oversize', talle: 'L', cantidad: 1, precioUnitario: 22000, total: 22000, metodoPago: 'efectivo' },
  { id: 'V-024', fecha: '2026-05-10', hora: '15:45', cliente: 'Valentina López', producto: 'Crew Neck Beige', talle: 'M', cantidad: 2, precioUnitario: 19000, total: 38000, metodoPago: 'mercadopago' },
]

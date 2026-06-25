import Link from 'next/link'
import { AnimatedTitle } from '@/components/ui/animated-title'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-white/10 py-8">
      <p className="mb-3 text-[11px] font-bold tracking-widest text-white/30">{title}</p>
      <div className="space-y-3 text-sm leading-relaxed text-white/60">{children}</div>
    </div>
  )
}

export const metadata = {
  title: 'Política de privacidad — Guland',
}

export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-5 py-8 sm:py-12">
      <div className="mb-8 sm:mb-12">
        <AnimatedTitle as="h1" className="text-3xl sm:text-5xl leading-none md:text-8xl" style={{ fontFamily: 'var(--font-bebas)' }}>
          PRIVACIDAD
        </AnimatedTitle>
        <p className="mt-2 text-xs font-semibold tracking-widest text-white/40">POLÍTICA DE PROTECCIÓN DE DATOS PERSONALES</p>
        <p className="mt-3 text-xs text-white/30">Última actualización: junio de 2026</p>
      </div>

      <div className="space-y-0">
        <Section title="RESPONSABLE DEL TRATAMIENTO">
          <p>
            <strong className="text-white/80">Guland Indumentaria</strong>, con domicilio en Villa del Rosario, Córdoba, Argentina,
            es responsable del tratamiento de los datos personales recopilados a través de este sitio web, de conformidad con la{' '}
            <strong className="text-white/80">Ley 25.326 de Protección de Datos Personales</strong> de la República Argentina
            y la normativa de la Agencia de Acceso a la Información Pública (AAIP).
          </p>
        </Section>

        <Section title="DATOS QUE RECOPILAMOS">
          <p>Al crear una cuenta o realizar un pedido, recopilamos únicamente:</p>
          <ul className="mt-2 space-y-2 pl-4">
            <li className="flex gap-2"><span className="text-white/30">—</span><span><strong className="text-white/70">Nombre</strong>: para personalizar tu cuenta y gestionar tus pedidos.</span></li>
            <li className="flex gap-2"><span className="text-white/30">—</span><span><strong className="text-white/70">Correo electrónico</strong>: para el acceso a tu cuenta y comunicaciones relacionadas con tus compras.</span></li>
            <li className="flex gap-2"><span className="text-white/30">—</span><span><strong className="text-white/70">Historial de pedidos</strong>: productos, tallas, cantidades y montos de tus compras.</span></li>
          </ul>
          <p className="mt-3">
            No recopilamos número de teléfono, dirección física, DNI ni ningún otro dato sensible a través del sitio.
            Las conversaciones de WhatsApp son gestionadas externamente por Meta y no son almacenadas por nosotros.
          </p>
        </Section>

        <Section title="FINALIDAD DEL TRATAMIENTO">
          <p>Utilizamos tus datos exclusivamente para:</p>
          <ul className="mt-2 space-y-2 pl-4">
            <li className="flex gap-2"><span className="text-white/30">—</span><span>Gestionar tu cuenta y autenticarte de forma segura.</span></li>
            <li className="flex gap-2"><span className="text-white/30">—</span><span>Procesar y hacer seguimiento de tus pedidos.</span></li>
            <li className="flex gap-2"><span className="text-white/30">—</span><span>Coordinar el envío o retiro de tus compras.</span></li>
          </ul>
          <p className="mt-3">No compartimos tus datos con terceros ni los utilizamos con fines publicitarios.</p>
        </Section>

        <Section title="ALMACENAMIENTO Y SEGURIDAD">
          <p>
            Tus datos se almacenan de forma segura en servidores en la nube con cifrado y acceso restringido.
            Conservamos tus datos mientras tu cuenta esté activa. Si eliminás tu cuenta, tus datos personales se eliminan de forma permanente.
          </p>
        </Section>

        <Section title="TUS DERECHOS">
          <p>
            De acuerdo con la Ley 25.326, tenés derecho a acceder, rectificar y suprimir tus datos personales.
            Podés ejercer estos derechos de las siguientes formas:
          </p>
          <ul className="mt-3 space-y-3 pl-4">
            <li className="flex gap-2">
              <span className="text-white/30">—</span>
              <span>
                <strong className="text-white/70">Eliminar tu cuenta</strong>: desde tu{' '}
                <Link href="/cuenta" className="underline underline-offset-4 hover:text-white transition-colors">
                  página de cuenta
                </Link>
                {' '}podés eliminar tu cuenta y todos tus datos de forma inmediata.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-white/30">—</span>
              <span>
                <strong className="text-white/70">Contacto directo</strong>: escribinos por{' '}
                <a href="https://wa.me/5493573498196" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-white transition-colors">
                  WhatsApp
                </a>
                {' '}para cualquier consulta sobre tus datos.
              </span>
            </li>
          </ul>
          <p className="mt-3">
            La AAIP (Agencia de Acceso a la Información Pública) es el organismo de control en materia de protección
            de datos personales en Argentina. Podés consultar más información en{' '}
            <span className="text-white/50">www.argentina.gob.ar/aaip</span>.
          </p>
        </Section>

        <Section title="COOKIES">
          <p>
            Este sitio utiliza cookies técnicas estrictamente necesarias para mantener tu sesión activa.
            No utilizamos cookies de seguimiento ni publicidad.
          </p>
        </Section>
      </div>

      <div className="mt-10 text-center">
        <Link href="/" className="text-xs font-semibold tracking-widest text-white/30 underline underline-offset-4 hover:text-white transition-colors">
          ← VOLVER AL INICIO
        </Link>
      </div>
    </div>
  )
}

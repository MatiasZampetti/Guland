import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-black text-white pb-20 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 py-12 sm:py-14">
        <div className="mb-8 sm:mb-10 flex flex-col gap-2">
          <p
            className="text-5xl sm:text-6xl leading-none md:text-8xl"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            GULAND
          </p>
          <p className="text-xs tracking-widest text-white/40">
            STREETWEAR UNISEX — VILLA DEL ROSARIO, CÓRDOBA
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 border-t border-white/10 pt-10 sm:grid-cols-2 md:grid-cols-3">

          <div>
            <p className="mb-4 text-[11px] font-bold tracking-widest text-white/40">NAVEGACIÓN</p>
            <ul className="space-y-2">
              <li>
                <a href="/#hero" className="text-sm text-white/60 hover:text-white transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <Link href="/shop" className="text-sm text-white/60 hover:text-white transition-colors">
                  Tienda
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm text-white/60 hover:text-white transition-colors">
                  Carrito
                </Link>
              </li>
              <li>
                <Link href="/cuenta/registro" className="text-sm text-white/60 hover:text-white transition-colors">
                  Cuenta
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-bold tracking-widest text-white/40">ATENCIÓN AL CLIENTE</p>
            <ul className="space-y-2">
              <li>
                <Link href="/ayuda" className="text-sm text-white/60 hover:text-white transition-colors">
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/5491100000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-bold tracking-widest text-white/40">SEGUINOS</p>
            <ul className="space-y-2">
              {['Instagram', 'TikTok'].map((s) => (
                <li key={s}>
                  <span className="cursor-pointer text-sm text-white/60 hover:text-white transition-colors">
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <p className="mt-10 border-t border-white/10 pt-6 text-xs text-white/20">
          © {new Date().getFullYear()} Guland. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}

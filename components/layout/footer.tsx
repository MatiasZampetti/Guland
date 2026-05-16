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

        <div className="grid grid-cols-1 gap-6 sm:gap-8 border-t border-white/10 pt-10 sm:grid-cols-2 md:grid-cols-3">

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
                  href="https://wa.me/5493573498196"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Contacto por WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-bold tracking-widest text-white/40">SEGUINOS</p>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.instagram.com/guland.indumentaria/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@matigiuliani_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  TikTok
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} Guland. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/guland.indumentaria/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white/30 hover:text-white transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@matigiuliani_"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="text-white/30 hover:text-white transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
              </svg>
            </a>
            <a
              href="https://wa.me/5493573498196"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-white/30 hover:text-white transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 32 32">
                <path d="M16.004 2C8.28 2 2 8.28 2 16.004c0 2.478.65 4.835 1.785 6.885L2 30l7.32-1.752A13.93 13.93 0 0 0 16.004 30C23.72 30 30 23.72 30 16.004 30 8.28 23.72 2 16.004 2zm0 25.54a11.57 11.57 0 0 1-5.9-1.61l-.423-.252-4.346 1.04 1.073-4.23-.276-.435A11.53 11.53 0 0 1 4.46 16.004c0-6.373 5.17-11.544 11.544-11.544 6.373 0 11.544 5.17 11.544 11.544 0 6.373-5.17 11.536-11.544 11.536zm6.327-8.647c-.347-.174-2.054-1.013-2.373-1.13-.32-.115-.552-.174-.784.174-.232.347-.9 1.13-1.103 1.362-.202.232-.405.26-.752.087-.347-.174-1.464-.54-2.788-1.72-1.03-.917-1.725-2.05-1.927-2.397-.202-.347-.022-.535.152-.708.156-.155.347-.405.52-.608.174-.202.232-.347.347-.578.116-.232.058-.435-.029-.608-.087-.174-.784-1.89-1.074-2.587-.283-.68-.57-.587-.784-.597l-.667-.012c-.232 0-.608.087-.927.435-.32.347-1.217 1.188-1.217 2.898s1.246 3.362 1.42 3.594c.173.232 2.453 3.746 5.943 5.252.83.358 1.48.572 1.986.732.834.265 1.594.228 2.194.138.669-.1 2.054-.84 2.345-1.652.29-.812.29-1.507.203-1.652-.086-.144-.318-.23-.666-.405z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

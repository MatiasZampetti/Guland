import Link from 'next/link'

export function Hero() {
  return (
    <section id="hero" className="relative -mt-16 h-[100svh] min-h-[320px] overflow-hidden select-none">

      {/* Fondo */}
      <img
        src="/hero-bg.png"
        alt="Guland hero"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Gradiente: oscurece la izquierda para legibilidad del texto */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      {/* Gradiente sutil abajo */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/50 to-transparent" />

      {/* Contenido principal */}
      <div className="relative flex h-full flex-col justify-between px-5 py-8 md:px-14">

        {/* TEXTO IZQUIERDA */}
        <div className="hero-text-wrap mt-auto flex flex-col pb-16 md:pb-10 max-w-3xl">

          {/* CTA New Drops */}
          <Link
            href="/shop?filter=new-drops"
            className="hero-ver-ahora relative z-10 mb-4 inline-flex w-fit items-center gap-3 border border-red-600 bg-red-700 px-5 py-2 text-xs font-bold tracking-[0.25em] text-white transition-opacity hover:opacity-85 pointer-events-auto"
          >
            VER COLECCIÓN
            <span className="text-sm">↓</span>
          </Link>

          {/* Headline masivo */}
          <h1
            className="hero-h1 leading-[0.88] text-white uppercase"
            style={{ fontFamily: 'var(--font-anton)' }}
          >
            NEW<br />DROPS
          </h1>

          {/* Gu-land — oculto en landscape pequeño */}
          <p
            className="hero-guland mt-6 text-white"
            style={{
              fontFamily: 'var(--font-league)',
              fontSize: 'clamp(20px, 5.5vw, 88px)',
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            Gu-land
          </p>

          {/* Tagline — oculta en landscape pequeño */}
          <p className="hero-tagline mt-5 max-w-xs text-sm leading-relaxed tracking-wide text-white/55">
            Vestí diferente, vestí con Guland.
          </p>

          {/* CTA COMPRAR AHORA */}
          <Link
            href="/shop"
            className="hero-comprar relative z-10 mt-8 inline-flex w-fit items-center gap-3 sm:gap-6 border border-red-600 bg-red-700 px-4 py-2 sm:px-8 sm:py-4 text-xs sm:text-sm font-bold tracking-[0.2em] sm:tracking-[0.25em] text-white transition-opacity hover:opacity-85 pointer-events-auto"
          >
            COMPRAR AHORA
            <span className="sm:text-base">→</span>
          </Link>
        </div>

        {/* DETALLES DERECHA */}
        <div className="absolute bottom-16 right-8 hidden md:flex flex-col items-end gap-3 md:right-14">

          <div className="text-right">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-white/40">
              MODA URBANA SINCE 2020.
            </p>
            <p className="mt-0.5 text-[11px] tracking-[0.3em] text-white/30">STREETWEAR</p>
          </div>

          <div className="flex items-end gap-[2px] h-10">
            {[3,1,4,2,5,1,3,2,4,1,2,3,1,4,2,3,1,5,2,1,3,4,2,1,3].map((h, i) => (
              <div
                key={i}
                className="w-[2px] bg-white/30"
                style={{ height: `${h * 8}px` }}
              />
            ))}
          </div>

          <p
            className="text-[10px] font-semibold tracking-[0.3em] text-white/25"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            GULAND ®
          </p>
        </div>

      </div>

      {/* Ticker inferior */}
      <div className="absolute bottom-0 inset-x-0 overflow-hidden bg-red-700 py-2.5">
        <div className="flex whitespace-nowrap animate-ticker">
          {[...Array(2)].map((_, i) => (
            <span
              key={i}
              className="text-white/90"
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: '0.95rem',
                letterSpacing: '0.15em',
              }}
            >
              {'GULAND CLOTHES • NUEVA COLECCIÓN • INVIERNO 2026 • SIN MOLDES • ENVÍO GRATIS +$30K • '}
              {'GULAND CLOTHES • NUEVA COLECCIÓN • INVIERNO 2026 • SIN MOLDES • ENVÍO GRATIS +$30K • '}
              {'GULAND CLOTHES • NUEVA COLECCIÓN • INVIERNO 2026 • SIN MOLDES • ENVÍO GRATIS +$30K • '}
            </span>
          ))}
        </div>
      </div>

    </section>
  )
}

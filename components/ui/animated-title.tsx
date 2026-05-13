'use client'

import { useEffect, useRef, useState, ElementType } from 'react'

interface Props {
  as?: ElementType
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function AnimatedTitle({ as: Tag = 'h2', children, className = '', style }: Props) {
  const ref = useRef<HTMLElement>(null)
  // Arranca visible — SSR nunca renderiza opacity-0
  const [visible, setVisible] = useState(true)
  // Controla si aplicamos la clase de animación
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    // En dispositivos táctiles: sin animación, siempre visible
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (isTouch) return

    const el = ref.current
    if (!el) return

    requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight

      // Si ya está en el viewport al cargar: no animar
      if (rect.top < vh) return

      // Está debajo del fold: ocultar y preparar animación
      setVisible(false)
      setAnimate(true)

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        },
        { threshold: 0, rootMargin: '0px 0px -5% 0px' }
      )
      observer.observe(el)
      const t = setTimeout(() => setVisible(true), 800)

      return () => { observer.disconnect(); clearTimeout(t) }
    })
  }, [])

  if (!animate) {
    return <Tag className={className} style={style}>{children}</Tag>
  }

  return (
    <Tag
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={style}
    >
      {children}
    </Tag>
  )
}

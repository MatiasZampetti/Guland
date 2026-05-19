import type { Metadata } from 'next'
import { Inter, Bebas_Neue, Anton, Permanent_Marker, Russo_One, League_Spartan } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' })
const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-anton' })
const permanentMarker = Permanent_Marker({ weight: '400', subsets: ['latin'], variable: '--font-marker' })
const russoOne = Russo_One({ weight: '400', subsets: ['latin'], variable: '--font-russo' })
const leagueSpartan = League_Spartan({ weight: '900', subsets: ['latin'], variable: '--font-league' })

export const metadata: Metadata = {
  title: 'Guland',
  description: 'Ropa para los que no siguen tendencias, las crean.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${bebasNeue.variable} ${anton.variable} ${permanentMarker.variable} ${russoOne.variable} ${leagueSpartan.variable} antialiased`}
    >
      <body className="font-[family-name:var(--font-inter)]">
        {children}
      </body>
    </html>
  )
}

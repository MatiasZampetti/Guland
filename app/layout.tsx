import type { Metadata } from 'next'
import { Inter, Bebas_Neue, Anton, League_Spartan } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' })
const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-anton' })
const leagueSpartan = League_Spartan({ weight: '900', subsets: ['latin'], variable: '--font-league' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

export const metadata: Metadata = {
  title: 'Guland',
  description: 'Ropa para los que no siguen tendencias, las crean.',
  openGraph: {
    title: 'Guland',
    description: 'Ropa para los que no siguen tendencias, las crean.',
    url: 'https://guland.com.ar',
    siteName: 'Guland',
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guland',
    description: 'Ropa para los que no siguen tendencias, las crean.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${bebasNeue.variable} ${anton.variable} ${leagueSpartan.variable} antialiased`}
    >
      <head>
        {supabaseUrl && <link rel="preconnect" href={supabaseUrl} crossOrigin="anonymous" />}
      </head>
      <body className="font-[family-name:var(--font-inter)]">
        {children}
      </body>
    </html>
  )
}

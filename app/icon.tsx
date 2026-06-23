import { ImageResponse } from 'next/og'

export const size = { width: 96, height: 96 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 58,
          fontWeight: 900,
          fontFamily: 'sans-serif',
          letterSpacing: '-0.05em',
        }}
      >
        <span style={{ color: '#ffffff' }}>G</span>
        <span style={{ color: '#dc2626' }}>L</span>
      </div>
    ),
    { ...size }
  )
}

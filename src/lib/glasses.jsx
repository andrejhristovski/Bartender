// Glass silhouettes, straight from the design canvas. The CMS "glass" field
// picks one of these keys; anything unknown falls back to a rocks glass.
export const GLASS_PATHS = {
  martini: 'M8 22h8M12 11v11M5 3h14l-7 8z',
  coupe: 'M8 22h8M12 16v6M4 4h16a8 8 0 0 1-8 12A8 8 0 0 1 4 4z',
  rocks: 'M6 4h12l-1.5 16h-9z',
  highball: 'M7 3h10l-1 18H8z',
  flute: 'M8 22h8M12 14v8M8 2h8l-1 8a3 3 0 0 1-6 0z',
}

export const glassPath = (key) => GLASS_PATHS[key] || GLASS_PATHS.rocks

export function GlassIcon({ glass, className, strokeWidth = 1.3, stroke = 'rgba(224,162,96,.62)' }) {
  return (
    <svg
      viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"
    >
      <path d={glassPath(glass)} />
    </svg>
  )
}

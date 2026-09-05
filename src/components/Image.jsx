import { useState } from 'react'

// Lazy, non-blocking images that fade in once decoded. Width/height or an
// aspect-ratio box on the parent keeps the layout from shifting.
export default function Image({ src, alt = '', eager = false, ...rest }) {
  const [loaded, setLoaded] = useState(false)
  if (!src) return null
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : 'auto'}
      onLoad={() => setLoaded(true)}
      style={{ opacity: loaded ? 1 : 0, transition: 'opacity 400ms var(--ease)' }}
      {...rest}
    />
  )
}

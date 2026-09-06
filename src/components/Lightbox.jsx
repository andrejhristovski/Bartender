import { useEffect, useLayoutEffect, useRef } from 'react'

// Each photo is its own framed box, and the boxes sit in a scroll-snap track
// spanning the whole backdrop — so a swipe moves the boxes themselves, with the
// neighbouring one coming in behind. No arrows, no dots; the close button sits
// outside the track so it stays put while the boxes move.
export default function Lightbox({ moments, index, closing, onClose }) {
  const trackRef = useRef(null)

  // Land on the photo that was tapped before first paint.
  useLayoutEffect(() => {
    const track = trackRef.current
    if (track) track.scrollLeft = index * track.clientWidth
  }, [index])

  useEffect(() => {
    const track = trackRef.current

    const onKey = (e) => {
      if (e.key === 'Escape') return onClose()
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault()
        track?.scrollBy({ left: (e.key === 'ArrowRight' ? 1 : -1) * track.clientWidth, behavior: 'smooth' })
      }
    }

    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    track?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  return (
    <div className={`backdrop backdrop--photos${closing ? ' is-closing' : ''}`}>
      <button type="button" className="dialog__close lightbox__close" onClick={onClose} aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Clicking the space around a box closes; the box itself doesn't. */}
      <div
        className="lightbox-track"
        ref={trackRef}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Photos"
        tabIndex={-1}
      >
        {moments.map((m, i) => (
          <div className="lightbox-slide" key={i}>
            <figure className="lightbox" onClick={(e) => e.stopPropagation()}>
              <img
                src={m.image}
                alt={m.label || ''}
                loading={i === index ? 'eager' : 'lazy'}
                decoding="async"
                draggable="false"
              />
              <figcaption className="lightbox__caption">
                <span>{m.label}</span>
                {moments.length > 1 && (
                  <span className="lightbox__count">{i + 1} / {moments.length}</span>
                )}
              </figcaption>
            </figure>
          </div>
        ))}
      </div>
    </div>
  )
}

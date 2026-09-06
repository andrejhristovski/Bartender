import { useEffect, useRef } from 'react'

// A plain image preview for the Moments strip — same backdrop and motion as the
// recipe dialog, but no content of its own beyond the photo and its caption.
export default function Lightbox({ moment, closing, onClose }) {
  const frameRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    frameRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  return (
    <div className={`backdrop${closing ? ' is-closing' : ''}`} onClick={onClose}>
      <figure
        className="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label={moment.label || 'Photo'}
        tabIndex={-1}
        ref={frameRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="dialog__close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        <img src={moment.image} alt={moment.label || ''} />
        {moment.label && <figcaption className="lightbox__caption">{moment.label}</figcaption>}
      </figure>
    </div>
  )
}

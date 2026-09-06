import { useEffect, useRef } from 'react'
import Image from './Image'
import { GlassIcon } from '../lib/glasses.jsx'

export default function RecipeDialog({ recipe, number, closing, onClose }) {
  const dialogRef = useRef(null)

  // Escape to close, and keep the page behind from scrolling.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  return (
    <div className={`backdrop${closing ? ' is-closing' : ''}`} onClick={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-label={recipe.title}
        tabIndex={-1}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="dialog__close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Only this wrapper scrolls, so the close button above it stays put. */}
        <div className="dialog__scroll">
        <div className="dialog__media">
          <div className="dialog__wash" aria-hidden="true" />
          {recipe.image ? (
            <Image src={recipe.image} alt={recipe.title} eager />
          ) : (
            <GlassIcon glass={recipe.glass} className="dialog__icon" strokeWidth={1.1} stroke="rgba(224,162,96,.68)" />
          )}
        </div>

        <div className="dialog__body">
          <p className="eyebrow">{number}</p>
          <h2 className="dialog__name">{recipe.title}</h2>
          {recipe.body && <p className="dialog__long">{recipe.body}</p>}

          {recipe.ingredients?.length > 0 && (
            <>
              <p className="dialog__label">Build</p>
              <div className="build">
                {recipe.ingredients.map((ing, i) => (
                  <div className="build__row" key={i} style={{ animationDelay: `${260 + i * 70}ms` }}>
                    <span>{ing.item}</span>
                    <span>{ing.amount}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {recipe.steps?.length > 0 && (
            <>
              <p className="dialog__label">Method</p>
              <div className="method">
                {recipe.steps.map((step, i) => (
                  <div className="method__row" key={i} style={{ animationDelay: `${520 + i * 80}ms` }}>
                    <span className="method__n">{i + 1}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}

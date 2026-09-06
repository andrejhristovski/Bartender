import { useEffect, useRef } from 'react'
import Image from './Image'
import { has } from '../lib/has'
import { GlassIcon } from '../lib/glasses.jsx'
import '../styles/v2.css'

// The /v2 experiment: the modal IS the photo. Everything the v1 dialog puts in
// a column beside the image is laid over it instead — ingredients stacked one
// per line, the description along the bottom edge.
export default function RecipeDialogV2({ recipe, number, closing, onClose }) {
  const dialogRef = useRef(null)

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

  const ingredients = (recipe.ingredients || []).filter((i) => has(i?.item) || has(i?.amount))
  const blurb = has(recipe.body) ? recipe.body : recipe.description

  return (
    <div className={`backdrop${closing ? ' is-closing' : ''}`} onClick={onClose}>
      <div
        className="shot"
        role="dialog"
        aria-modal="true"
        aria-label={recipe.title}
        tabIndex={-1}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        {recipe.image ? (
          <Image className="shot__photo" src={recipe.image} alt={recipe.title} eager />
        ) : (
          <GlassIcon glass={recipe.glass} className="shot__icon" strokeWidth={1.1} stroke="rgba(224,162,96,.68)" />
        )}

        <div className="shot__scrim" aria-hidden="true" />

        <button type="button" className="dialog__close shot__close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="shot__overlay">
          <header className="shot__head">
            {has(number) && <p className="eyebrow shot__no">{number}</p>}
            {has(recipe.title) && <h2 className="shot__name">{recipe.title}</h2>}
          </header>

          {/* Ingredients and the line about the drink travel together along the
              bottom edge, so the glass itself stays uncovered. */}
          <div className="shot__foot">
            {ingredients.length > 0 && (
              <div className="shot__info">
                <ul className="shot__list">
                  {ingredients.map((ing, i) => (
                    <li className="shot__row" key={i} style={{ animationDelay: `${240 + i * 60}ms` }}>
                      {has(ing.item) && <span className="shot__item">{ing.item}</span>}
                      {has(ing.amount) && <span className="shot__amount">{ing.amount}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {has(blurb) && <p className="shot__note">{blurb}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

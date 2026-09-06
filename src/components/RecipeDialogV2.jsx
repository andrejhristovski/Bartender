import { useEffect, useRef, useState } from 'react'
import Image from './Image'
import { has } from '../lib/has'
import { GlassIcon } from '../lib/glasses.jsx'
import { saveStoryCard } from '../lib/storyCard'
import '../styles/v2.css'

// The /v2 experiment: the modal IS the photo. Everything the v1 dialog puts in
// a column beside the image is laid over it instead — ingredients stacked one
// per line, the description along the bottom edge.
// Three clicks inside the card within two seconds saves the drink as a
// 1080×1920 story image. Undocumented on purpose.
const TAPS = 3
const WINDOW_MS = 2000

export default function RecipeDialogV2({ recipe, number, closing, onClose }) {
  const dialogRef = useRef(null)
  const taps = useRef([])
  const [story, setStory] = useState('idle') // idle | working | done | error

  const onCardClick = (event) => {
    // The backdrop closes on click; the card itself must not.
    event.stopPropagation()
    if (story === 'working') return

    const now = Date.now()
    taps.current = [...taps.current.filter((t) => now - t < WINDOW_MS), now]
    if (taps.current.length < TAPS) return

    taps.current = []
    // Three fast clicks also select a paragraph; drop that highlight.
    window.getSelection?.()?.removeAllRanges()
    setStory('working')
    saveStoryCard(recipe)
      .then((result) => setStory(result === 'cancelled' ? 'idle' : 'done'))
      .catch(() => setStory('error'))
  }

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

  // Clear the little confirmation on its own, the way the contact form does.
  useEffect(() => {
    if (story !== 'done' && story !== 'error') return
    const timer = setTimeout(() => setStory('idle'), 3000)
    return () => clearTimeout(timer)
  }, [story])

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
        onClick={onCardClick}
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

        {story !== 'idle' && (
          <p className="shot__toast" role="status" aria-live="polite">
            {story === 'working' && 'Making the story image…'}
            {story === 'done' && 'Saved — 1080 × 1920, ready to post.'}
            {story === 'error' && 'That one wouldn’t save.'}
          </p>
        )}
      </div>
    </div>
  )
}

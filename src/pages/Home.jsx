import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import Image from '../components/Image'
import CraftVideo from '../components/CraftVideo'
import ContactForm from '../components/ContactForm'
import DrinkCard from '../components/DrinkCard'
import RecipeDialog from '../components/RecipeDialog'
import RecipeDialogV2 from '../components/RecipeDialogV2'
import Lightbox from '../components/Lightbox'
import { useScrollFx, useReveal } from '../lib/useScrollFx'
import { site, recipes, ordered } from '../lib/content'
import { has, hasAny } from '../lib/has'
import { instagramUrl } from '../lib/instagram'

const pad = (n) => String(n).padStart(2, '0')

// The photo-first modal (RecipeDialogV2) is what the site ships. The original
// side-by-side dialog is still here as variant 'v1' — uncomment its route in
// routes.jsx to preview it at /v1, links and all.
export default function Home({ variant }) {
  const base = variant ? `/${variant}` : ''
  const Dialog = variant === 'v1' ? RecipeDialog : RecipeDialogV2
  const { slug } = useParams()
  const navigate = useNavigate()
  const [closing, setClosing] = useState(false)
  const [momentIndex, setMomentIndex] = useState(null)
  const [momentClosing, setMomentClosing] = useState(false)

  const heroBg = useRef(null)
  const heroCopy = useRef(null)
  const heroPour = useRef(null)
  const progress = useRef(null)

  const navVisible = useScrollFx({ heroBg, heroCopy, heroPour, progress })
  useReveal([recipes.length])

  // Look the open drink up in the full ordered list, not the trimmed homepage
  // one — a link to a drink keeps working even when it isn't on the homepage.
  const index = ordered.findIndex((r) => r.slug === slug)
  const active = index >= 0 ? ordered[index] : null

  useEffect(() => {
    document.title = active ? `${active.title} — ${site.name}` : `${site.name} — ${site.kicker}`
  }, [active])

  // A link straight to /#about lands before React has rendered the section,
  // so the browser can't do the scroll itself.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [])

  // A section only renders when the CMS actually has content for it.
  const show = {
    about: hasAny(site.aboutTitle, site.about, site.aboutSecondary, site.portrait),
    craft: has(site.craftVideo),
    cocktails: recipes.length > 0,
    moments: has(site.moments),
    book: hasAny(site.bookTitle, site.bookText, site.instagram, site.cv),
  }

  // Only moments with a photo are swipeable, so the indexes line up.
  const photos = (site.moments || []).filter((m) => m.image)

  const closeMoment = () => {
    if (momentClosing) return
    setMomentClosing(true)
    setTimeout(() => {
      setMomentClosing(false)
      setMomentIndex(null)
    }, 380)
  }

  // Let the close animation play out before we drop the dialog from the tree.
  const close = () => {
    if (closing) return
    setClosing(true)
    setTimeout(() => {
      setClosing(false)
      navigate(base || '/', { replace: true })
    }, 380)
  }

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      {show.cocktails && <a className="skip-link" href="#cocktails">Skip to the cocktails</a>}
      <Nav name={site.name} visible={navVisible} progressRef={progress} show={show} />

      <Hero site={site} bgRef={heroBg} copyRef={heroCopy} pourRef={heroPour} />

      <main>
        {show.about && (
        <section className="wrap about reveal" id="about">
          <div className="about__portrait">
            <div className="about__glow" aria-hidden="true" />
            {site.portrait ? (
              <Image src={site.portrait} alt={site.name} />
            ) : (
              <>
                <svg className="about__icon" viewBox="0 0 24 24" fill="none" stroke="rgba(224,162,96,.5)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
                </svg>
                <span className="about__caption">Portrait</span>
              </>
            )}
          </div>

          <div>
            <p className="eyebrow">About</p>
            <span className="rule reveal" aria-hidden="true" />
            {has(site.aboutTitle) && <h2 className="about__title">{site.aboutTitle}</h2>}
            {has(site.about) && <p className="about__text">{site.about}</p>}
            {has(site.aboutSecondary) && <p className="about__text about__text--soft">{site.aboutSecondary}</p>}
          </div>
        </section>
        )}

        {site.craftVideo && <CraftVideo site={site} />}

        {show.cocktails && (
        <section className="wrap drinks reveal" id="cocktails">
          {hasAny(site.listKicker, site.listTitle, site.listNote) && (
            <div className="drinks__head">
              <div>
                {has(site.listKicker) && <p className="eyebrow">{site.listKicker}</p>}
                {hasAny(site.listKicker, site.listTitle) && (
                  <span className="rule rule--wide reveal" aria-hidden="true" />
                )}
                {has(site.listTitle) && <h2 className="drinks__title">{site.listTitle}</h2>}
              </div>
              {has(site.listNote) && <p className="drinks__note">{site.listNote}</p>}
            </div>
          )}

          <div className="drinks__grid">
            {recipes.map((recipe, i) => (
              <DrinkCard key={recipe.slug} recipe={recipe} number={pad(i + 1)} base={base} />
            ))}
          </div>
        </section>
        )}

        {show.moments && (
          <section className="moments reveal" id="moments">
            {hasAny(site.momentsTitle, site.momentsNote) && (
              <div className="moments__head">
                {has(site.momentsTitle) && <h2>{site.momentsTitle}</h2>}
                {has(site.momentsNote) && <p>{site.momentsNote}</p>}
              </div>
            )}
            <div className="moments__strip">
              {site.moments.map((item, i) => (
                item.image ? (
                  <button
                    type="button"
                    className="moment"
                    key={i}
                    onClick={() => setMomentIndex(photos.indexOf(item))}
                    aria-label={`Open photo: ${item.label || 'untitled'}`}
                  >
                    <div className="moment__glow" aria-hidden="true" />
                    <Image src={item.image} alt={item.label || ''} />
                    {has(item.label) && <span className="moment__label">{item.label}</span>}
                  </button>
                ) : (
                  <figure className="moment" key={i}>
                    <div className="moment__glow" aria-hidden="true" />
                    {has(item.label) && <figcaption className="moment__label">{item.label}</figcaption>}
                  </figure>
                )
              ))}
            </div>
          </section>
        )}

        <section className="wrap book reveal" id="book">
          <div className="book__panel">
            <div className="book__glow" aria-hidden="true" />
            <div className="book__inner">
              <p className="eyebrow">Book</p>
              {has(site.bookTitle) && <h2 className="book__title">{site.bookTitle}</h2>}
              {has(site.bookText) && <p className="book__text">{site.bookText}</p>}
              <div className="book__actions">
                {instagramUrl(site.instagram) && (
                  <a className="btn btn--solid" href={instagramUrl(site.instagram)} target="_blank" rel="noreferrer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <path d="M17.5 6.5h.01" />
                    </svg>
                    Instagram
                  </a>
                )}
                {site.cv && (
                  <a className="btn btn--outline" href={site.cv} download>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 3v12" />
                      <path d="m7 11 5 5 5-5" />
                      <path d="M5 21h14" />
                    </svg>
                    {site.cvLabel || 'Download CV'}
                  </a>
                )}
              </div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      {hasAny(site.name) && (
        <footer className="footer">
          {has(site.name) && <span>{site.name}</span>}
        </footer>
      )}

      {momentIndex !== null && (
        <Lightbox
          moments={photos}
          index={momentIndex}
          closing={momentClosing}
          onClose={closeMoment}
        />
      )}

      {active && (
        <Dialog
          recipe={active}
          number={pad(index + 1)}
          closing={closing}
          onClose={close}
        />
      )}
    </>
  )
}

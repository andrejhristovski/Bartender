import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import Image from '../components/Image'
import CraftVideo from '../components/CraftVideo'
import DrinkCard from '../components/DrinkCard'
import ContactForm from '../components/ContactForm'
import RecipeDialog from '../components/RecipeDialog'
import Lightbox from '../components/Lightbox'
import { useScrollFx, useReveal } from '../lib/useScrollFx'
import { site, recipes, ordered } from '../lib/content'

const pad = (n) => String(n).padStart(2, '0')

export default function Home() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [closing, setClosing] = useState(false)
  const [moment, setMoment] = useState(null)
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

  const closeMoment = () => {
    if (momentClosing) return
    setMomentClosing(true)
    setTimeout(() => {
      setMomentClosing(false)
      setMoment(null)
    }, 380)
  }

  // Let the close animation play out before we drop the dialog from the tree.
  const close = () => {
    if (closing) return
    setClosing(true)
    setTimeout(() => {
      setClosing(false)
      navigate('/', { replace: true })
    }, 380)
  }

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <a className="skip-link" href="#cocktails">Skip to the cocktails</a>
      <Nav name={site.name} visible={navVisible} progressRef={progress} />

      <Hero site={site} bgRef={heroBg} copyRef={heroCopy} pourRef={heroPour} />

      <main>
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
            <h2 className="about__title">{site.aboutTitle}</h2>
            <p className="about__text">{site.about}</p>
            {site.aboutSecondary && <p className="about__text about__text--soft">{site.aboutSecondary}</p>}
          </div>
        </section>

        {site.craftVideo && <CraftVideo site={site} />}

        <section className="wrap drinks reveal" id="cocktails">
          <div className="drinks__head">
            <div>
              <p className="eyebrow">{site.listKicker}</p>
              <span className="rule rule--wide reveal" aria-hidden="true" />
              <h2 className="drinks__title">{site.listTitle}</h2>
            </div>
            <p className="drinks__note">{site.listNote}</p>
          </div>

          <div className="drinks__grid">
            {recipes.map((recipe, i) => (
              <DrinkCard key={recipe.slug} recipe={recipe} number={pad(i + 1)} />
            ))}
          </div>
        </section>

        {site.moments?.length > 0 && (
          <section className="moments reveal" id="moments">
            <div className="moments__head">
              <h2>{site.momentsTitle}</h2>
              <p>{site.momentsNote}</p>
            </div>
            <div className="moments__strip">
              {site.moments.map((item, i) => (
                item.image ? (
                  <button
                    type="button"
                    className="moment"
                    key={i}
                    onClick={() => setMoment(item)}
                    aria-label={`Open photo: ${item.label || 'untitled'}`}
                  >
                    <div className="moment__glow" aria-hidden="true" />
                    <Image src={item.image} alt={item.label || ''} />
                    <span className="moment__label">{item.label}</span>
                  </button>
                ) : (
                  <figure className="moment" key={i}>
                    <div className="moment__glow" aria-hidden="true" />
                    <figcaption className="moment__label">{item.label}</figcaption>
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
              <h2 className="book__title">{site.bookTitle}</h2>
              <p className="book__text">{site.bookText}</p>
              <div className="book__actions">
                {site.instagram && (
                  <a className="btn btn--solid" href={`https://instagram.com/${site.instagram}`} target="_blank" rel="noreferrer">
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
              {site.formEndpoint && <ContactForm endpoint={site.formEndpoint} />}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>{site.name}</span>
        <span>{site.footerNote}</span>
      </footer>

      {moment && (
        <Lightbox moment={moment} closing={momentClosing} onClose={closeMoment} />
      )}

      {active && (
        <RecipeDialog
          recipe={active}
          number={pad(index + 1)}
          closing={closing}
          onClose={close}
        />
      )}
    </>
  )
}

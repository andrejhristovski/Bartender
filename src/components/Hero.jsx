import Image from './Image'

export default function Hero({ site, bgRef, copyRef }) {
  return (
    <header className="hero" id="top">
      <div className="hero__bg" ref={bgRef} aria-hidden="true">
        <div className="hero__blob hero__blob--1" />
        <div className="hero__blob hero__blob--2" />
        <div className="hero__blob hero__blob--3" />
      </div>

      {/* Pour lines — the drifting dashes behind the name. */}
      <svg className="hero__pours" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M-50 520 C 220 380, 380 640, 620 480 S 1020 300, 1260 420" fill="none" stroke="rgba(224,162,96,.45)" strokeWidth="1.5" strokeDasharray="14 22" />
        <path d="M-50 600 C 260 500, 420 700, 700 560 S 1040 420, 1260 500" fill="none" stroke="rgba(224,162,96,.22)" strokeWidth="1" strokeDasharray="6 30" />
        <path d="M-50 430 C 180 330, 460 520, 700 400 S 1060 250, 1260 330" fill="none" stroke="rgba(122,138,94,.25)" strokeWidth="1" strokeDasharray="20 40" />
      </svg>

      {site.heroImage && (
        <div className="hero__photo" aria-hidden="true">
          <Image src={site.heroImage} alt="" eager />
        </div>
      )}

      <div className="hero__copy" ref={copyRef}>
        <p className="hero__eyebrow">{site.kicker}</p>
        <h1 className="hero__title">{site.name}</h1>
        {site.tagline && <p className="hero__line">{site.tagline}</p>}
      </div>

      <div className="hero__cue" aria-hidden="true">
        <span>Scroll</span>
        <i />
      </div>
    </header>
  )
}

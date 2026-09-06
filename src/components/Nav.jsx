import { has } from '../lib/has'
export default function Nav({ name, visible, progressRef, show }) {
  return (
    <nav className={`nav${visible ? ' is-visible' : ''}`} aria-label="Main">
      {has(name) && <a className="nav__brand" href="#top">{name}</a>}
      <div className="nav__links">
        {show?.about && <a href="#about">About</a>}
        {show?.cocktails && <a href="#cocktails">Cocktails</a>}
        {show?.book && <a href="#book" className="is-accent">Book</a>}
      </div>
      <span className="nav__progress" ref={progressRef} aria-hidden="true" />
    </nav>
  )
}

export default function Nav({ name, visible, progressRef }) {
  return (
    <nav className={`nav${visible ? ' is-visible' : ''}`} aria-label="Main">
      <a className="nav__brand" href="#top">{name}</a>
      <div className="nav__links">
        <a href="#about">About</a>
        <a href="#cocktails">Cocktails</a>
        <a href="#book" className="is-accent">Book</a>
      </div>
      <span className="nav__progress" ref={progressRef} aria-hidden="true" />
    </nav>
  )
}

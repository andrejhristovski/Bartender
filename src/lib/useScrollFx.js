import { useEffect, useState } from 'react'

// One passive scroll listener drives the whole page: the nav reveal, the
// progress hairline, and the hero parallax. Everything else is CSS.
export function useScrollFx({ heroBg, heroCopy, heroPour, progress }) {
  const [navVisible, setNavVisible] = useState(false)

  useEffect(() => {
    let ticking = false

    const paint = () => {
      ticking = false
      const y = window.scrollY
      const vh = window.innerHeight || 1

      if (heroBg.current) heroBg.current.style.transform = `translate3d(0,${y * 0.28}px,0)`

      // Hero content does NOT move on scroll. The design's parallax shifted the
      // copy downward, which slid it into the illustration; shifting both
      // together then slid the pair into the scroll cue. Everything in the hero
      // is only ~10px apart, so any drift collides with whatever is below it.
      // It fades on the way out instead — no movement, nothing to collide.
      const t = Math.min(y / vh, 1)
      const fade = String(1 - t * 1.15)
      for (const ref of [heroCopy, heroPour]) {
        if (ref?.current) ref.current.style.opacity = fade
      }
      if (progress.current) {
        const max = document.documentElement.scrollHeight - vh || 1
        progress.current.style.width = `${Math.min(y / max, 1) * 100}%`
      }
    }

    const onScroll = () => {
      setNavVisible(window.scrollY > window.innerHeight * 0.72)
      if (!ticking) {
        ticking = true
        requestAnimationFrame(paint)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [heroBg, heroCopy, heroPour, progress])

  return navVisible
}

// Adds .is-in to every .reveal element the first time it scrolls into view.
export function useReveal(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.is-in)')
    if (!els.length) return

    // No observer support: leave everything visible rather than hiding it.
    if (!('IntersectionObserver' in window)) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-in')
          io.unobserve(entry.target)
        })
      },
      // threshold MUST stay 0. A ratio-based threshold is unsatisfiable for any
      // element taller than viewport / threshold — the cocktails section is
      // ~8000px on a phone, so at 0.12 its ratio peaks around 0.10 and the
      // reveal never fires, leaving a screen of blank space. Firing on first
      // pixel, with the bottom inset below, starts it as soon as it appears.
      { threshold: 0, rootMargin: '0px 0px -8% 0px' }
    )

    els.forEach((el) => {
      el.classList.add('is-armed') // only now is it safe to hide it
      io.observe(el)
    })
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

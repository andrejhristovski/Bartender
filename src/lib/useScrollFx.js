import { useEffect, useState } from 'react'

// One passive scroll listener drives the whole page: the nav reveal, the
// progress hairline, and the hero parallax. Everything else is CSS.
export function useScrollFx({ heroBg, heroCopy, progress }) {
  const [navVisible, setNavVisible] = useState(false)

  useEffect(() => {
    let ticking = false

    const paint = () => {
      ticking = false
      const y = window.scrollY
      const vh = window.innerHeight || 1

      if (heroBg.current) heroBg.current.style.transform = `translate3d(0,${y * 0.28}px,0)`
      if (heroCopy.current) {
        const t = Math.min(y / vh, 1)
        heroCopy.current.style.transform = `translate3d(0,${y * 0.14}px,0)`
        heroCopy.current.style.opacity = String(1 - t * 1.15)
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
  }, [heroBg, heroCopy, progress])

  return navVisible
}

// Adds .is-in to every .reveal element the first time it scrolls into view.
export function useReveal(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.is-in)')
    if (!els.length) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-in')
          io.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )

    els.forEach((el, i) => {
      if (!el.classList.contains('rule')) el.style.transitionDelay = `${(i % 6) * 70}ms`
      io.observe(el)
    })
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

import { useEffect, useRef, useState } from 'react'
import { has, hasAny } from '../lib/has'

// "Watch the build" — a silent 16:9 loop. The placeholder underneath stays
// visible until the video actually has frames, so a slow connection shows the
// designed panel rather than a black box.
export default function CraftVideo({ site }) {
  const videoRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [motionOK, setMotionOK] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const saveData = navigator.connection?.saveData === true
    const update = () => setMotionOK(!mq.matches && !saveData)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // readyState >= 2 is HAVE_CURRENT_DATA: there is a frame to show.
    const markReady = () => {
      if (video.videoWidth > 0 || video.readyState >= 2) setReady(true)
    }

    // The <video> is in the prerendered HTML, so it can already have data by the
    // time this effect runs — in which case 'loadeddata' fired with nothing
    // listening and the placeholder would sit over the video forever. Check the
    // current state first, then listen for the rest.
    markReady()
    const events = ['loadeddata', 'loadedmetadata', 'canplay', 'playing']
    events.forEach((e) => video.addEventListener(e, markReady))

    if (motionOK) video.play?.().catch(() => {})

    return () => events.forEach((e) => video.removeEventListener(e, markReady))
  }, [motionOK])

  return (
    <section className="wrap craft reveal" id="craft">
      {hasAny(site.craftKicker, site.craftTitle, site.craftNote) && (
        <div className="craft__head">
          <div>
            {has(site.craftKicker) && <p className="eyebrow">{site.craftKicker}</p>}
            {hasAny(site.craftKicker, site.craftTitle) && (
              <span className="rule rule--craft reveal" aria-hidden="true" />
            )}
            {has(site.craftTitle) && <h2 className="craft__title">{site.craftTitle}</h2>}
          </div>
          {has(site.craftNote) && <p className="craft__note">{site.craftNote}</p>}
        </div>
      )}

      <div className="craft__frame">
        <video
          ref={videoRef}
          src={site.craftVideo}
          poster={site.craftPoster || undefined}
          loop
          muted
          playsInline
          preload="metadata"
          // Reduced motion or a metered connection: don't autoplay, but still
          // let them watch it if they choose.
          autoPlay={motionOK}
          controls={!motionOK}
        />

        <div className={`craft__placeholder${ready ? ' is-hidden' : ''}`} aria-hidden="true">
          <div className="craft__glow" />
          <div className="craft__ph-inner">
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(224,162,96,.62)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="15" height="14" rx="3" />
              <path d="m17 11 5-3v8l-5-3z" />
            </svg>
            {has(site.craftTitle) && <span className="craft__ph-label">{site.craftTitle}</span>}
          </div>
        </div>

        <div className="craft__vignette" aria-hidden="true" />
      </div>
    </section>
  )
}

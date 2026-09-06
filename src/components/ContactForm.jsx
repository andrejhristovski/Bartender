import { useState } from 'react'

// Posts to a form service (Formspree by default) rather than Netlify Forms,
// which only exists on Netlify. The endpoint is a CMS field, so the address it
// delivers to lives in that service's settings and never in the page source.
export default function ContactForm({ endpoint }) {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const onSubmit = async (event) => {
    event.preventDefault()
    setStatus('sending')

    const form = event.currentTarget
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      })
      if (!res.ok) throw new Error(res.status)
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className="contact" action={endpoint} method="POST" onSubmit={onSubmit}>
      {/* _gotcha is Formspree's honeypot: bots fill it, humans never see it. */}
      <p className="contact__hp">
        <label>
          Don’t fill this in if you’re human
          <input name="_gotcha" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="contact__row">
        <label className="contact__field">
          <span>Your email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="contact__field">
        <span>Message</span>
        <textarea
          name="message"
          required
          rows={4}
          placeholder="A date, a rough guest count, and where."
        />
      </label>

      <div className="contact__foot">
        <button type="submit" className="btn btn--solid" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send'}
        </button>
        <p className="contact__status" role="status" aria-live="polite">
          {status === 'sent' && 'Thanks — that’s been sent.'}
          {status === 'error' && 'That didn’t send. Try again, or reach me on Instagram.'}
        </p>
      </div>
    </form>
  )
}

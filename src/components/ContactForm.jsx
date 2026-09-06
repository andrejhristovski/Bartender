import { useState } from 'react'

// Netlify Forms: the build bot finds this form in the prerendered HTML and
// wires up an endpoint. Antonio's address is set in Netlify's notification
// settings, never in the page source, so nothing here is scrapeable.
export default function ContactForm() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const onSubmit = async (event) => {
    event.preventDefault()
    setStatus('sending')

    const form = event.currentTarget
    const data = new FormData(form)
    data.set('form-name', 'contact')

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      })
      if (!res.ok) throw new Error(res.status)
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form
      className="contact"
      name="contact"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={onSubmit}
    >
      {/* Both hidden inputs are required by Netlify: the first identifies the
          form on submit, the second is the honeypot bots fill in. */}
      <input type="hidden" name="form-name" value="contact" />
      <p className="contact__hp">
        <label>
          Don’t fill this in if you’re human
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
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

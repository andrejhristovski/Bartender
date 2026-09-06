// Vercel equivalent of netlify/functions/callback.js — trades the code for a
// token and hands it to the Decap window that opened the popup.
const page = (status, payload) => `<!doctype html>
<html><body><script>
  (function () {
    function send() {
      window.opener.postMessage(
        'authorization:github:${status}:' + ${JSON.stringify(JSON.stringify(payload))},
        '*'
      )
    }
    window.addEventListener('message', send, { once: true })
    window.opener.postMessage('authorizing:github', '*')
  })()
</script></body></html>`

export default async function handler(req, res) {
  const code = req.query?.code
  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET

  if (!code) return res.status(400).send('Missing ?code from GitHub.')
  if (!clientId || !clientSecret) {
    return res.status(500).send('GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET are not set.')
  }

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  })
  const data = await response.json()

  const body = data.access_token
    ? page('success', { token: data.access_token, provider: 'github' })
    : page('error', { message: data.error_description || 'Could not get a token from GitHub.' })

  res.setHeader('Content-Type', 'text/html')
  res.status(200).send(body)
}

// Step 2: GitHub redirects back here with a code. We trade it for an access token
// and hand that token to the Decap window that opened the popup.
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

export const handler = async (event) => {
  const code = event.queryStringParameters?.code
  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET

  if (!code) return { statusCode: 400, body: 'Missing ?code from GitHub.' }
  if (!clientId || !clientSecret) {
    return { statusCode: 500, body: 'GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET are not set.' }
  }

  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  })
  const data = await res.json()

  const body = data.access_token
    ? page('success', { token: data.access_token, provider: 'github' })
    : page('error', { message: data.error_description || 'Could not get a token from GitHub.' })

  return { statusCode: 200, headers: { 'Content-Type': 'text/html' }, body }
}

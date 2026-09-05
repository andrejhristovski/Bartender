// Step 1 of the GitHub OAuth dance: send the CMS user to GitHub to approve access.
// Decap opens this in a popup as /api/auth?provider=github.
const randomState = () => Math.random().toString(36).slice(2) + Date.now().toString(36)

export const handler = async (event) => {
  const clientId = process.env.GITHUB_CLIENT_ID
  if (!clientId) {
    return { statusCode: 500, body: 'GITHUB_CLIENT_ID is not set in the Netlify environment.' }
  }

  const host = event.headers['x-forwarded-host'] || event.headers.host
  const proto = host?.startsWith('localhost') ? 'http' : 'https'

  const url = new URL('https://github.com/login/oauth/authorize')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', `${proto}://${host}/api/callback`)
  url.searchParams.set('scope', 'repo,user')
  url.searchParams.set('state', randomState())

  return { statusCode: 302, headers: { Location: url.toString() }, body: '' }
}

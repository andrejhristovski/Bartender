// Vercel equivalent of netlify/functions/auth.js — step 1 of the GitHub OAuth
// dance for Decap CMS. Both files exist so the project deploys to either host.
const randomState = () => Math.random().toString(36).slice(2) + Date.now().toString(36)

export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID
  if (!clientId) {
    res.status(500).send('GITHUB_CLIENT_ID is not set in the Vercel environment.')
    return
  }

  const host = req.headers['x-forwarded-host'] || req.headers.host
  const proto = host?.startsWith('localhost') ? 'http' : 'https'

  const url = new URL('https://github.com/login/oauth/authorize')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', `${proto}://${host}/api/callback`)
  url.searchParams.set('scope', 'repo,user')
  url.searchParams.set('state', randomState())

  res.redirect(302, url.toString())
}

import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import AppRoutes from './routes'

// Used only by scripts/prerender.mjs at build time.
export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>
  )
}

// Re-exported so the prerender script uses the exact same slugs and content the
// app uses — no second copy of the slug rules to drift out of sync.
export { ordered as drinks, site } from './lib/content'
export { instagramUrl } from './lib/instagram'

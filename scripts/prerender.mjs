// Build-time prerender. Vite ships an empty <div id="root">, which means every
// URL served identical HTML with no content and no per-page metadata. This
// renders each route to static HTML and writes the head tags, structured data,
// sitemap and robots.txt that a crawler actually reads.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

// Netlify exposes the production URL as $URL at build time.
// Set SITE_URL explicitly for the most reliable result. Otherwise: $URL is
// Netlify's, VERCEL_PROJECT_PRODUCTION_URL is Vercel's stable production host,
// and VERCEL_URL is the per-deployment host (a last resort — on a preview build
// it would bake preview URLs into the canonicals).
const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
const vercelUrl = host ? `https://${host}` : null
const SITE = (process.env.SITE_URL || process.env.URL || vercelUrl || 'https://antonionikolovski.netlify.app').replace(/\/$/, '')

const { render, drinks, site } = await import(path.join(root, 'dist-ssr/entry-server.js'))

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const clamp = (s, n) => {
  const t = String(s ?? '').replace(/\s+/g, ' ').trim()
  return t.length <= n ? t : t.slice(0, t.lastIndexOf(' ', n - 1)).replace(/[,.;:]$/, '') + '…'
}

const abs = (u) => (!u ? null : /^https?:\/\//.test(u) ? u : SITE + (u.startsWith('/') ? u : '/' + u))

function head({ title, description, canonical, image, type = 'website', jsonLd }) {
  const img = abs(image) || abs(site.heroPoster) || abs(site.heroImage)
  const tags = [
    `<link rel="canonical" href="${esc(canonical)}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${esc(canonical)}" />`,
    `<meta property="og:locale" content="en_GB" />`,
    img ? `<meta property="og:image" content="${esc(img)}" />` : '',
    img ? `<meta property="og:image:alt" content="${esc(title)}" />` : '',
    `<meta name="twitter:card" content="${img ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    img ? `<meta name="twitter:image" content="${esc(img)}" />` : '',
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  ]
  return tags.filter(Boolean).join('\n    ')
}

function page(url, { title, description, canonical, image, type, jsonLd }) {
  const body = render(url)
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(description)}" />`)
    .replace('</head>', `  ${head({ title, description, canonical, image, type, jsonLd })}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  return html
}

// Flat files, not <slug>/index.html. Netlify serves /recipes/x from
// recipes/x.html directly, whereas a directory makes it 301 to /recipes/x/ —
// which would mean every canonical tag and every sitemap URL pointed at a
// redirect.
const write = (routePath, html) => {
  const file = routePath === '/' ? path.join(dist, 'index.html') : path.join(dist, routePath + '.html')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, html)
}

// ---- homepage ------------------------------------------------------------
const homeTitle = `${site.name} — ${site.kicker}`
const homeDesc = clamp(`${site.tagline} ${site.about}`, 155)

const person = {
  '@type': 'Person',
  name: site.name,
  jobTitle: 'Bartender',
  description: clamp(site.about, 300),
  url: SITE + '/',
  // No email published here on purpose — scrapers read JSON-LD.
  ...(site.instagram ? { sameAs: [`https://instagram.com/${site.instagram}`] } : {}),
}

write('/', page('/', {
  title: homeTitle,
  description: homeDesc,
  canonical: SITE + '/',
  type: 'profile',
  jsonLd: {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', name: site.name, url: SITE + '/', inLanguage: 'en' },
      person,
      {
        '@type': 'ItemList',
        name: site.listTitle || 'Cocktails',
        numberOfItems: drinks.length,
        itemListElement: drinks.map((d, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: d.title,
          url: `${SITE}/recipes/${d.slug}`,
        })),
      },
    ],
  },
}))

// ---- one page per cocktail ----------------------------------------------
for (const drink of drinks) {
  const canonical = `${SITE}/recipes/${drink.slug}`
  const ingredients = (drink.ingredients || []).map((i) => [i.amount, i.item].filter(Boolean).join(' ').trim())
  write(`/recipes/${drink.slug}`, page(canonical.replace(SITE, ''), {
    title: `${drink.title} — Cocktail Recipe by ${site.name}`,
    description: clamp(drink.description || drink.body, 155),
    canonical,
    image: drink.image,
    type: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: drink.title,
      url: canonical,
      description: clamp(drink.body || drink.description, 300),
      ...(drink.image ? { image: [abs(drink.image)] } : {}),
      author: { '@type': 'Person', name: site.name },
      recipeCategory: 'Cocktail',
      recipeCuisine: 'Cocktail',
      recipeYield: '1 cocktail',
      ...(ingredients.length ? { recipeIngredient: ingredients } : {}),
      ...((drink.steps || []).length
        ? { recipeInstructions: drink.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, text: s })) }
        : {}),
    },
  }))
}

// ---- sitemap + robots ----------------------------------------------------
const urls = ['/', ...drinks.map((d) => `/recipes/${d.slug}`)]
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${SITE}${u}</loc><changefreq>monthly</changefreq></url>`).join('\n') +
    `\n</urlset>\n`
)
fs.writeFileSync(
  path.join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${SITE}/sitemap.xml\n`
)

console.log(`prerendered ${urls.length} pages -> ${SITE}`)
urls.forEach((u) => console.log('  ' + u))

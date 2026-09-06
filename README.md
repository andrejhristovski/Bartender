# Antonio Nikolovski

A bartender portfolio: one page, a signature list, and a build sheet for every
drink. Content lives in Markdown files in this repo and is edited through
Decap CMS in the browser — no code, no database, nothing to pay for.

**Design:** the look comes from the *Bartender Portfolio* canvas on the
*Organic* design system (claude.ai/design). Every colour, typeface, radius and
easing curve is declared once in `src/styles/tokens.css`.

---

## Running it locally

```bash
npm install
npm run dev          # http://localhost:5173
```

To edit content locally with the CMS UI, run this in a second terminal and open
`http://localhost:5173/admin/`:

```bash
npm run cms          # a local git proxy; no login needed
```

`npm run build` produces `dist/`. `npm run preview` serves that build.

---

## Adding a cocktail

**Through the CMS (the normal way).** Go to `/admin/`, choose **Cocktails →
New Cocktail**, fill in the fields and hit **Publish**. That commits a new
Markdown file to `main` and Netlify rebuilds the site within a minute or two.

**By hand.** Add an entry to `src/content/cocktails.yml`. Position in the file
is position on the site:

```yaml
cocktails:
  - title: Ember & Rye
    description: Burnt orange, rye, a long slow stir.  # one line, shown on the card
    image: /images/ember-and-rye.jpg                   # optional; empty = drawn glass
    glass: rocks                                       # rocks | coupe | martini | highball | flute
    ingredients:
      - item: Rye whiskey
        amount: 60 ml
    steps:
      - Char a strip of orange peel over a flame until it blisters.
    body: The longer description, shown when the drink is opened.
```

Photos are optional throughout. Where one is missing the site falls back to the
design's drawn glass on a lit gradient, so a half-filled site never looks broken.

Homepage wording — the name, the line under it, the About text, the Moments
strip and the Book panel — all live in `src/content/site.md` and are editable
under **Site text** in the CMS.

### Which drinks show, and in what order

Open **Cocktails → All cocktails**. Every drink is a row in one list:

- **Reorder** — grab a row by the handle and drag it. Top of the list is first
  on the homepage.
- **Add** — the **Add cocktail** button at the top of the list.
- **Edit** — click a row to expand it.
- **Remove** — the × on the row.
- **How many to show** — the field above the list. Empty shows all of them.

All the drinks live in one file, `src/content/cocktails.yml`, because that's
what makes drag-to-reorder possible — Decap can only reorder items inside a
list, never files in a folder.

A drink's URL comes from its name: "Ember & Rye" becomes `/recipes/ember-and-rye`.
**Renaming a drink therefore changes its link**, and any address shared earlier
stops working. Rename freely before you share a link, carefully afterwards.

Hiding a drink from the homepage does **not** break its link. `/recipes/<slug>`
keeps working for every drink in the folder, so an address shared earlier still
opens the right build sheet.

### The hero background

**Site text → Background video.** An MP4 that plays muted on a loop behind the
name. Keep it short (a few seconds — it loops) and under about 5 MB; it's the
first thing that loads.

- **Video still** is shown while the video downloads, and *instead* of it for
  anyone browsing with reduced motion turned on or with a data saver enabled.
- **Background photo** is the fallback when there's no video at all.
- With all three empty, the hero falls back to the design's own lit-glass
  gradient — which is what the original design specifies, and still looks right.

Video and stills live in `public/media/`. The footage is graded hard in CSS
(`.hero__media` in `global.css`) — desaturated, darkened and warmed — because
stock bar footage is rarely shot in a dark warm room and the name has to stay
readable on top of it.

### Photos

The six drink photos and four event photos are from
[Unsplash](https://unsplash.com) under the Unsplash License, and the hero clip is
from [Pexels](https://pexels.com) under the Pexels License — all free for
commercial use, no attribution required.

The **Moments** strip (the horizontal row of event photos) is also edited under
**Site text**: each entry is a caption plus a photo, and the whole list is
drag-to-reorder. They are
placeholders for Antonio's own photography; replace them through the CMS
(**Cocktails → pick a drink → Photo**) whenever real shots exist.

A drink with no photo falls back to the drawn glass on a lit gradient from the
design, so the grid never looks broken mid-way through a shoot.

---

## Deploying free on Netlify

1. Push this folder to a **GitHub** repository.
2. On [netlify.com](https://netlify.com) → **Add new site → Import an existing
   project** → pick the repo. The build settings come from `netlify.toml`
   (`npm run build`, publish `dist`) — leave them as they are.
3. **Site configuration → Change site name** → set it to `antonio-nikolovski`,
   so the site is at `https://antonio-nikolovski.netlify.app`.

Every push to `main` now redeploys automatically. The free tier covers this
site comfortably.

### Wiring up CMS login (once)

Decap commits through GitHub, so it needs a GitHub OAuth app. Two small steps:

1. **Create the OAuth app.** GitHub → *Settings → Developer settings → OAuth
   Apps → New OAuth App*:
   - Application name: `Antonio Nikolovski CMS`
   - Homepage URL: `https://antonio-nikolovski.netlify.app`
   - Authorization callback URL: `https://antonio-nikolovski.netlify.app/api/callback`

   Generate a client secret and keep both values to hand.

2. **Give them to Netlify.** *Site configuration → Environment variables*, add:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`

   Then redeploy. The two functions in `netlify/functions/` handle the login
   handshake; nothing else is needed.

3. **Nothing to configure for the domain.** `public/admin/index.html` derives
   the login URL from whatever origin the CMS is served from, so renaming the
   Netlify site or adding a custom domain won't break it. The only hardcoded
   value is the repo (`andrejhristovski/Bartender`) in `config.yml`.

   The one thing that *must* track the domain is the OAuth app's callback URL
   on GitHub — if you rename the site, update it to `https://<new
   domain>/api/callback`.

### Giving Antonio access

Repo → *Settings → Collaborators → Add people* → invite his GitHub username. He
accepts the invitation by email. That's the whole permission model: anyone with
write access to the repo can edit the site, and nobody else can.

---

## How Antonio publishes

1. Open `https://antonio-nikolovski.netlify.app/admin/`
2. Click **Login with GitHub** and approve the popup (first time only).
3. Edit under **Site text**, or add a drink under **Cocktails**. Photos are
   drag-and-drop; they're stored in `public/images/`.
4. Hit **Publish**.

Each publish is a commit to `main`, which triggers a Netlify build. The live
site updates a minute or two later. Anything he changes is in git history, so
nothing is ever lost.

---

## How it's put together

```
src/
  content/            Markdown — the entire contents of the site
    site.md             homepage wording
    recipes/*.md        one file per drink
  styles/
    tokens.css          the design system — colours, type, spacing, motion
    global.css          everything else
  components/         Nav, Hero, DrinkCard, RecipeDialog, Image
  lib/
    content.js          turns the .md files into data at build time
    glasses.jsx         glass silhouettes from the design
    useScrollFx.js      nav reveal, scroll progress, hero parallax
vite-plugin-markdown.js Parses frontmatter during the build, so no YAML
                        parser ships to the browser.
```

## Deploying on Vercel

`vercel.json` sets the build (`npm run build`, output `dist`) and
`cleanUrls: true`, so `/recipes/x` is served from `recipes/x.html` with no
redirect — matching the canonical URLs the prerender writes. The Decap OAuth
handshake lives in `api/auth.js` and `api/callback.js`.

**Setup, once:**

1. Import the repo on Vercel. Leave the build settings alone.
2. *Settings → Environment Variables*: add `GITHUB_CLIENT_ID` and
   `GITHUB_CLIENT_SECRET` (CMS login), and `SITE_URL` set to the final domain
   (e.g. `https://antonio-nikolovski.vercel.app`). `SITE_URL` is what the
   canonical tags and sitemap use; without it the build guesses from Vercel's
   own variables.
3. Update the GitHub OAuth app's **Homepage URL** and **Authorization callback
   URL** to `https://<your-domain>` and `https://<your-domain>/api/callback`.
4. Redeploy — functions only pick up environment variables on a fresh build.

The `netlify.toml` and `netlify/functions/` files are still in the repo. Vercel
ignores them; they're kept so the Netlify deploy isn't broken mid-move. Delete
them once the move is finished.

## The contact form

The form posts to whatever URL is in **Contact form endpoint** under Site text.
It's built for [Formspree](https://formspree.io), whose free tier covers 50
submissions a month.

**Setup, once:** create a Formspree account, add a form, point it at Antonio's
email, and paste the endpoint it gives you (`https://formspree.io/f/xxxxxxxx`)
into that CMS field. Leave the field empty and the form is hidden entirely —
the Instagram and CV buttons still show.

His address lives in Formspree's settings, never in the page source. There is no
`mailto:` anywhere on the site and no email in the structured data, because both
get harvested.

The form carries a `_gotcha` honeypot field, hidden off-screen: bots fill it,
humans never see it, and Formspree discards those submissions.

This replaced Netlify Forms, which only works on Netlify.

## SEO

`npm run build` runs three steps: the normal Vite build, an SSR build, then
`scripts/prerender.mjs`, which writes a real HTML file for every URL. Without
that last step the site is a single empty `<div id="root">` — every URL served
identical markup with no title, no description and no content, which is close to
invisible to a crawler.

What the prerender produces:

- **A page per URL** — `dist/index.html` plus `dist/recipes/<slug>/index.html`,
  each with the fully rendered content in the HTML.
- **Per-page metadata** — unique `<title>`, description, and a canonical URL.
- **Open Graph + Twitter cards** so links shared on Instagram, WhatsApp or
  Slack show the drink's photo, name and description instead of nothing.
- **Recipe structured data** — JSON-LD `Recipe` on every cocktail (ingredients,
  numbered steps, photo, author), which is what makes Google's recipe rich
  results possible. The homepage carries `WebSite`, `Person` and an `ItemList`
  of the drinks.
- **`sitemap.xml` and `robots.txt`**, both listing the real URLs.

The drink cards are `<a href>` links, not buttons — without an href there is
nothing for a crawler to follow, and the recipe URLs would only be discoverable
through the sitemap.

The browser hydrates that prerendered markup rather than replacing it, so the
page is visible before JavaScript runs and there's no flash on load.

### The site URL

Canonical tags, OG tags and the sitemap need absolute URLs. The prerender uses
`$URL`, which Netlify sets to the production address at build time, and falls
back to `https://antonionikolovski.netlify.app`. **If you move to a custom
domain, no code change is needed** — Netlify updates `$URL` — but do rerun a
deploy so the tags regenerate.

### After deploying

1. Confirm a recipe URL serves its own title:
   `curl -s https://<your-domain>/recipes/ember-and-rye | grep '<title>'`
2. Add the site to [Google Search Console](https://search.google.com/search-console)
   and submit `https://<your-domain>/sitemap.xml`.
3. Check a drink page in the
   [Rich Results Test](https://search.google.com/test/rich-results) to confirm
   the Recipe markup is picked up.

Note that `npm run preview` is patched to serve the prerendered pages the way
Netlify does; without that patch its SPA fallback answers every route with the
homepage and hides the whole thing.

Notes on the build:

- **Dependencies:** React, React Router. Nothing else at runtime. The bundle is
  ~57 KB gzipped.
- **Images** are lazy-loaded and fade in; every frame has a fixed aspect ratio,
  so nothing shifts as they arrive.
- **Routing:** the site is one page. `/recipes/<slug>` renders that page with
  the drink's build sheet open, so every recipe still has a shareable link.
- **Motion** honours `prefers-reduced-motion`.

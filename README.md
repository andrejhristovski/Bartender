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

**By hand.** Drop a new `.md` file into `src/content/recipes/`. The filename
becomes the URL (`ember-and-rye.md` → `/recipes/ember-and-rye`). Copy the
example:

```markdown
---
title: Ember & Rye
description: Burnt orange, rye, a long slow stir.   # one line, shown on the card
image: ''                                            # optional; empty = drawn glass
glass: rocks                                         # rocks | coupe | martini | highball | flute
date: 2026-09-05                                     # newest first on the homepage
ingredients:
  - item: Rye whiskey
    amount: 60 ml
steps:
  - Char a strip of orange peel over a flame until it blisters.
---
The longer description, shown when the drink is opened.
```

Photos are optional throughout. Where one is missing the site falls back to the
design's drawn glass on a lit gradient, so a half-filled site never looks broken.

Homepage wording — the name, the line under it, the About text, the Moments
strip and the Book panel — all live in `src/content/site.md` and are editable
under **Site text** in the CMS.

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

Notes on the build:

- **Dependencies:** React, React Router. Nothing else at runtime. The bundle is
  ~57 KB gzipped.
- **Images** are lazy-loaded and fade in; every frame has a fixed aspect ratio,
  so nothing shifts as they arrive.
- **Routing:** the site is one page. `/recipes/<slug>` renders that page with
  the drink's build sheet open, so every recipe still has a shareable link.
- **Motion** honours `prefers-reduced-motion`.

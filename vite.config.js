import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import markdown from './vite-plugin-markdown.js'

// Vite's SPA fallback answers /admin/ with the site shell, because a directory
// URL matches no file in public/. Point it at the CMS page explicitly.
function adminIndex() {
  return {
    name: 'admin-index',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const path = req.url.split('?')[0]
        if (path === '/admin' || path === '/admin/') req.url = '/admin/index.html'
        next()
      })
    },
  }
}

// vite preview's SPA fallback answers /recipes/<slug> with the homepage, hiding
// the prerendered pages and making local preview disagree with production.
// Netlify serves a matching file before applying its catch-all; mirror that.
function servePrerendered() {
  return {
    name: 'serve-prerendered',
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url.split('?')[0]
        if (!path.extname(url)) {
          const candidate = path.join('dist', url, 'index.html')
          if (fs.existsSync(candidate)) {
            req.url = path.posix.join(url, 'index.html')
          }
        }
        next()
      })
    },
  }
}

// markdown() parses frontmatter at BUILD time, so no YAML parser ships to the browser.
export default defineConfig({
  plugins: [react(), markdown(), adminIndex(), servePrerendered()],
  build: { target: 'es2020' },
})

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

// markdown() parses frontmatter at BUILD time, so no YAML parser ships to the browser.
export default defineConfig({
  plugins: [react(), markdown(), adminIndex()],
  build: { target: 'es2020' },
})

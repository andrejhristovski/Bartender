import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

// Shared by the browser entry (BrowserRouter) and the build-time prerender
// (StaticRouter), so both produce the same markup for a given URL.
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/recipes/:slug" element={<Home />} />
      {/* The previous side-by-side recipe modal, kept for comparison.
          Uncomment to preview the whole page with it at /v1.
      <Route path="/v1" element={<Home variant="v1" />} />
      <Route path="/v1/recipes/:slug" element={<Home variant="v1" />} /> */}
      <Route path="*" element={<Home />} />
    </Routes>
  )
}

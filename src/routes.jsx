import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

// Shared by the browser entry (BrowserRouter) and the build-time prerender
// (StaticRouter), so both produce the same markup for a given URL.
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/recipes/:slug" element={<Home />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}

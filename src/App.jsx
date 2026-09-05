import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

// One page. /recipes/:slug renders the same page with that drink's build sheet
// open, so every recipe still has a shareable URL.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes/:slug" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

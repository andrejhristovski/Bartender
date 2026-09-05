import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'

const container = document.getElementById('root')
const tree = (
  <StrictMode>
    <App />
  </StrictMode>
)

// The build prerenders every route, so adopt that markup instead of throwing it
// away and repainting — createRoot would clear the container and flash.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}

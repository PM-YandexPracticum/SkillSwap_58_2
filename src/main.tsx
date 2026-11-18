import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import { applyTheme, getInitialTheme } from './shared/lib/theme'

applyTheme(getInitialTheme())

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found. Make sure <div id="root"> exists in index.html')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

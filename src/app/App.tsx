import { StoreProvider } from './providers/StoreProvider'
import { AppRouter } from './providers/RouterProvider'
import { ThemeProvider } from './providers/ThemeProvider'
import './styles/global.css'

export function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <AppRouter />
      </StoreProvider>
    </ThemeProvider>
  )
}

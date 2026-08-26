import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'
import { CartProvider } from './cartState'
import BrandSync from './BrandSync.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <BrandSync />
      <App />
    </CartProvider>
  </StrictMode>,
)

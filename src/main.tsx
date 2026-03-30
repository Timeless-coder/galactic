import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import './index.scss'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { CartProvider } from './contexts/CartContext.tsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
          <CartProvider>
            <Toaster />
            <App />
          </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
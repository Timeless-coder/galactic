import { useContext } from 'react'

import type { CartContextType } from '../contexts/CartContext'
import { CartContext } from '../contexts/CartContext'

export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}

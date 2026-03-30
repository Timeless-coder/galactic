import { AiOutlineShoppingCart } from 'react-icons/ai'

import { useCart } from '../../../hooks/useCart'

import styles from './HeaderCartIcon.module.scss'

export const CartIcon = () => {
  const { cartItems, setCartDropdownCollapsed, cartDropdownCollapsed } = useCart()

  return (
    <button
      className={styles.cartIconContainer}
      onClick={() => setCartDropdownCollapsed(!cartDropdownCollapsed)}
      aria-label="Toggle cart dropdown"
      type="button"
    >
      <AiOutlineShoppingCart className={styles.icon} aria-hidden="true" />
      <span className={styles.count} aria-label={`Cart items: ${cartItems.length}`}>{cartItems.length}</span>
    </button>
  )
}

export default CartIcon

import { AiOutlineShoppingCart } from 'react-icons/ai'

import { useCart } from '../../../hooks/useCart'

import styles from './HeaderCartIcon.module.scss'

export const HeaderCartIcon = () => {
  const { cartItems, setCartDropdownOpen } = useCart()

  const toggleCartDropdown = () => setCartDropdownOpen(prev => !prev)

  return (
    <button
      className={styles.cartIconContainer}
      onClick={toggleCartDropdown}
      aria-label="Toggle cart dropdown"
      type="button"
    >
      <AiOutlineShoppingCart className={styles.icon} aria-hidden="true" />
      <span className={styles.count} aria-label={`Cart items: ${cartItems.length}`}>{cartItems.length}</span>
    </button>
  )
}

export default HeaderCartIcon

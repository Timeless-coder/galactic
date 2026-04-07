import { AiOutlineShoppingCart } from 'react-icons/ai'

import { useCart } from '../../../hooks/useCart'

import styles from './HeaderCartIcon.module.scss'

type HeaderCartIconProps = {
  onToggle?: () => void
}

export const HeaderCartIcon = ({ onToggle }: HeaderCartIconProps) => {
  const { cartItems, cartDropdownOpen, setCartDropdownOpen } = useCart()

  const toggleCartDropdown = () => {
    onToggle?.()
    setCartDropdownOpen(prev => !prev)
  }
  const itemCountLabel = `${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'}`

  return (
    <button
      className={styles.cartIconContainer}
      onClick={toggleCartDropdown}
      aria-label={`Shopping cart, ${itemCountLabel}`}
      aria-expanded={cartDropdownOpen}
      aria-controls="header-cart-dropdown"
      type="button"
    >
      <AiOutlineShoppingCart className={styles.icon} aria-hidden="true" />
      <span className={styles.count} aria-hidden="true">{cartItems.length}</span>
    </button>
  )
}

export default HeaderCartIcon

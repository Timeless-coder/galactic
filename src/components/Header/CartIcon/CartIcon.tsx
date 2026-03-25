import { AiOutlineShoppingCart } from 'react-icons/ai'

import { useCart } from '../../../hooks/useCart'

import styles from './CartIcon.module.scss'

export const CartIcon = () => {
  const { cartItems, setCartDropdownCollapsed, cartDropdownCollapsed } = useCart()

  return (
    <div className={styles.cartIconContainer} onClick={() => setCartDropdownCollapsed(!cartDropdownCollapsed)}> 
      <AiOutlineShoppingCart className={styles.icon} />
      <p className={styles.count}>{cartItems.length}</p>
    </div>
  )
}

export default CartIcon

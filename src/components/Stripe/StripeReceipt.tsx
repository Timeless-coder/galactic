import { useEffect, useRef, useState } from 'react'
import { format, isValid, parseISO } from 'date-fns'
import { useReactToPrint } from 'react-to-print'
import toast from 'react-hot-toast'

import { useAuth } from '../../hooks/useAuth'

import type { CartItem } from '../../contexts/CartContext'

import ReceiptTour from '../ReceiptCartItem/ReceiptCartItem'

import styles from './StripeReceipt.module.scss'

const isValidCartItems = (data: unknown): data is CartItem[] => {
  if (!Array.isArray(data)) return false
  return data.every(item =>
    item &&
    typeof item === 'object' &&
    typeof item.booking?.id === 'string' &&
    typeof item.booking?.departureDate === 'string' &&
    typeof item.booking?.people === 'number' &&
    typeof item.tour?.id === 'string' &&
    typeof item.tour?.name === 'string'
  )
}

const StripeReceipt = () => {
  const { currentUser } = useAuth()
  const contentRef = useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({ contentRef })
  const [total, setTotal] = useState(0)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const parsedNow = parseISO(new Date().toString())
  const formattedDate = isValid(parsedNow) ? format(parsedNow, 'PPPP') : 'Invalid date'

  useEffect(() => {
    try {
      const storageTotal = localStorage.getItem('galacticCartReceiptTotal')
      const storageCartItems = localStorage.getItem('galacticCartReceiptItems')
      if (storageTotal && storageCartItems) {
        const parsedTotal = Number(storageTotal)
        const parsedItems: unknown = JSON.parse(storageCartItems)
        if (isNaN(parsedTotal) || !isValidCartItems(parsedItems)) {
          toast.error('Receipt data is invalid or outdated.')
          return
        }
        setTotal(parsedTotal)
        setCartItems(parsedItems)
      }
    }
    catch(err: any) {
      toast.error(`${err.message ?? err}`)
    }
  }, [])

    return (
      <>
        <div className={styles.receipt} ref={contentRef}>          
          <h1><strong><em>Thank you so much for choosing GalacticTours&#8482;</em></strong></h1>
          <h3>Date of Sale: <em><strong>{formattedDate}</strong></em></h3>
          <p>Traveler: <em><strong>{currentUser?.displayName}</strong></em></p>
          <p>Email: <em><strong>{currentUser?.email}</strong></em></p>
          <h2 className={styles.enjoy}>Tours Booked:</h2>
          {cartItems.map(cartItem => (
            <ReceiptTour key={cartItem.booking.id} cartItem={cartItem} />
          ))}
          <h3 className={styles.cost}>Total Paid: <em><strong>${total}</strong></em></h3>
          <p>with card **** **** **** 4242</p>

          <div>
            <h2>Galactic Tours&#8482;</h2>
            <p>Address: <em><strong>4573 West Park Drive</strong></em></p>
            <p>Sector: <em><strong>Epison</strong></em></p>
            <p>Planet: <em><strong>OGLE-2017-BLG-0364Lb</strong></em></p>
            <p>Galaxy: <em><strong>Vitgurn</strong></em></p>
            <p>Universe: <em><strong>Kkl-45ex-kk444</strong></em></p>
            <p>Timeline: <em><strong>Darkest</strong></em></p>
            <p>Phone: <em><strong>5-355-212-57645-393-1</strong></em></p>
          </div>
        </div>
        <button type='button' onClick={reactToPrintFn}>Print Receipt</button>

        
      </>
    )
  }  

  export default StripeReceipt
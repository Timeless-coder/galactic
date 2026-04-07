import { useRef } from 'react'
import { format, isValid } from 'date-fns'
import { useReactToPrint } from 'react-to-print'

import { useAuth } from '../../hooks/useAuth'

import ReceiptTour, { type ReceiptItem } from '../ReceiptCartItem/ReceiptCartItem'

import styles from './StripeReceipt.module.scss'

type StripeReceiptProps = {
  receiptItems: ReceiptItem[]
  total: number
  saleDate: Date
}

const StripeReceipt = ({ receiptItems, total, saleDate }: StripeReceiptProps) => {
  const { currentUser } = useAuth()
  const contentRef = useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({ contentRef })

  const formattedDate = isValid(saleDate) ? format(saleDate, 'PPPP') : 'Invalid date'

  return (
    <>
      <div className={styles.receipt} ref={contentRef}>
        <h1><strong><em>Thank you so much for choosing GalacticTours&#8482;</em></strong></h1>
        <h3>Date of Sale: <em><strong>{formattedDate}</strong></em></h3>
        <p>Traveler: <em><strong>{currentUser?.displayName}</strong></em></p>
        <p>Email: <em><strong>{currentUser?.email}</strong></em></p>
        <h2 style={{ marginBottom: '10px', marginTop: '30px' }}>Tours Booked:</h2>
        {receiptItems.map(receiptItem => (
          <ReceiptTour key={`${receiptItem.tourId}-${receiptItem.departureDate}`} receiptItem={receiptItem} />
        ))}
        <h3 className={styles.cost}>Total Paid: <em><strong>${total}</strong></em></h3>
        <p>with card **** **** **** 4242</p>

        <div>
          <h2 style={{ marginTop: '50px', marginBottom: 0 }}>Galactic Tours&#8482;</h2>
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
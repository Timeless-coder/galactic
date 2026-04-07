import { format, isValid, parseISO } from 'date-fns'

import styles from './ReceiptCartItem.module.scss'

export type ReceiptItem = {
  tourId: string
  tourName: string
  departureDate: string
  people: number
}

type ReceiptTourProps = {
  receiptItem: ReceiptItem
}

const ReceiptTour = ({ receiptItem }: ReceiptTourProps) => {
  const parsedDate = parseISO(receiptItem.departureDate)
  const formattedDate = isValid(parsedDate) ? format(parsedDate, 'PPPP') : 'Invalid date'

  return (
    <article className={styles.receiptContainer}>
      <header>
        <h3>{receiptItem.tourName}</h3>
      </header>
      <dl className={styles.tourDetailsList}>
        <div className={styles.tourDetailsText}>
          <dt>Departure Date: </dt>
          <dd><strong><em>{formattedDate}</em></strong></dd>
        </div>
        <div className={styles.tourDetailsText}>
          <dt>People:</dt>
          <dd><strong><em>{receiptItem.people}</em></strong></dd>
        </div>
      </dl>
    </article>
  )
}
 
export default ReceiptTour
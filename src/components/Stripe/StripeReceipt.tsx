import { Component } from 'react'
import ReceiptTour from '../../Tours/ReceiptTour/ReceiptTour'

import styles from './StripeReceipt.module.scss'

export default class StripeReceipt extends Component {
  render() {
    return (
      <div className={styles.receipt}>
        <h2>GalacticTours</h2>
        {this.props.receipt.map(tour => (
          <ReceiptTour key={tour.string} tour={tour} />
        ))}
        <h3 className={styles.cost}>Total Cost: ${this.props.total}</h3>
      </div>
    )
  }  
}
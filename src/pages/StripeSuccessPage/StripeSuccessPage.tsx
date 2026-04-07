import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import toast from 'react-hot-toast'

import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { getBookingsByPaymentIntentId } from '../../services/firebase/bookingsService'

import CustomButton from '../../elements/CustomButton/CustomButton'
import StripeReceipt from '../../components/Stripe/StripeReceipt'
import type { ReceiptItem } from '../../components/ReceiptCartItem/ReceiptCartItem'

import styles from './StripeSuccess.module.scss'

const StripeSuccessPage = () => {
  const { clearCart } = useCart()
  const { currentUser, loading } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isPaymentVerified, setIsPaymentVerified] = useState(false)
  const [isCheckingPayment, setIsCheckingPayment] = useState(true)
  const [receiptItems, setReceiptItems] = useState<ReceiptItem[]>([])
  const [receiptTotal, setReceiptTotal] = useState(0)
  const [saleDate, setSaleDate] = useState<Date | null>(null)

  useEffect(() => {
    const verifyPayment = async () => {
      if (loading) return

      if (!currentUser) {
        toast.error("We're sorry. No one is currently logged in. Please contact customer service.")
        setIsCheckingPayment(false)
        return
      }

      const redirectStatus = searchParams.get('redirect_status')
      const paymentIntentId = searchParams.get('payment_intent')

      if (redirectStatus !== 'succeeded' || !paymentIntentId) {
        toast.error('We could not verify your payment confirmation. Please contact customer service.')
        setIsCheckingPayment(false)
        return
      }

      try {
        const bookings = await getBookingsByPaymentIntentId(paymentIntentId, currentUser.id)

        if (!bookings || bookings.length === 0) {
          toast.error('Your payment was received but your receipt is not ready yet. Check your bookings shortly.')
          setIsCheckingPayment(false)
          return
        }

        const items: ReceiptItem[] = bookings.map(b => ({
          tourId: b.tourId,
          tourName: b.tourName ?? b.tourId,
          departureDate: b.departureDate,
          people: b.people,
        }))

        const total = bookings.reduce((sum, b) => sum + b.lineAmountCents, 0) / 100

        setReceiptItems(items)
        setReceiptTotal(total)
        setSaleDate(bookings[0].createdAt.toDate())
        setIsPaymentVerified(true)
        toast.success(`Thank you for your purchase, ${currentUser.displayName}! Your receipt is ready to print.`)
        clearCart()
      } catch (err: any) {
        console.error(err.message)
        toast.error('We could not verify your payment confirmation. Please contact customer service.')
      } finally {
        setIsCheckingPayment(false)
      }
    }

    void verifyPayment()
  }, [currentUser, loading, searchParams])

  return (
    <section className={styles.paymentSuccessContainer} aria-labelledby="stripe-success-title">
      <header>
        <h1 id="stripe-success-title">{isPaymentVerified ? 'Payment Successful!' : 'Payment Confirmation'}</h1>
      </header>

      {isCheckingPayment && <p>Verifying your payment...</p>}

      {!isCheckingPayment && isPaymentVerified && saleDate && (
        <StripeReceipt receiptItems={receiptItems} total={receiptTotal} saleDate={saleDate} />
      )}

      {!isCheckingPayment && !isPaymentVerified && (
        <p>We could not verify your payment confirmation. Please contact customer service if your card was charged.</p>
      )}

      <div className={styles.continue}>
        <CustomButton onClick={() => navigate('/tours')}>Continue Shopping</CustomButton>
      </div>
    </section>
  )
}

export default StripeSuccessPage

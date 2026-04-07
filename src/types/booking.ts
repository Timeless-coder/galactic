import type { Timestamp } from 'firebase/firestore'

export type Booking = {
  id: string
  createdAt: Timestamp
  tourId: string
  tourName?: string
  bookingUserId: string
  departureDate: string
  people: number
  paymentIntentId: string
  lineAmountCents: number
  currency: string
}
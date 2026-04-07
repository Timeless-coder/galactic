import { collection, addDoc, getDoc, doc, setDoc, where, getDocs, query, serverTimestamp, type Timestamp } from 'firebase/firestore'

import { db } from './firebaseConfig'
import type { Booking } from '../../types/booking'

type BookingDocument = Omit<Booking, 'id' | 'createdAt'> & {
	createdAt: Timestamp
}

export const getBookingsByUserId = async (userId: string): Promise<Booking[] | undefined> => {
	const bookingsQuery = await getDocs(query(collection(db, 'bookings'), where('bookingUserId', '==', userId)))
	if (bookingsQuery.empty) {
		return undefined;
	}
	return bookingsQuery.docs.map(doc => {
		const data = doc.data() as BookingDocument
		return {
			id: doc.id,
			...data,
		}
	})
}

export const getBookingsByPaymentIntentId = async (paymentIntentId: string, userId: string): Promise<Booking[] | undefined> => {
	const bookingsQuery = await getDocs(
		query(
			collection(db, 'bookings'),
			where('paymentIntentId', '==', paymentIntentId),
			where('bookingUserId', '==', userId)
		)
	)
	if (bookingsQuery.empty) return undefined
	return bookingsQuery.docs.map(doc => {
		const data = doc.data() as BookingDocument
		return { id: doc.id, ...data }
	})
}

// *** Legacy ***
const createNewBooking = async (booking: Omit<Booking, 'id' | 'createdAt'>): Promise<string> => {
	const docRef = await addDoc(collection(db, 'bookings'), {
		createdAt: serverTimestamp(),
		tourId: booking.tourId,
		bookingUserId: booking.bookingUserId,
		departureDate: booking.departureDate,
		people: booking.people,
		paymentIntentId: booking.paymentIntentId,
		lineAmountCents: booking.lineAmountCents,
		currency: booking.currency
	})
	return docRef.id
}

export const addBookingsFromCart = async (bookings: any): Promise<string[]> => {
	const bookingIds: string[] = await Promise.all(bookings.map((booking:any) => createNewBooking(booking)))
	return bookingIds
}

export const addPersonToBooking = async (bookingId: string): Promise<void> => {
	const bookingRef = doc(db, 'bookings', bookingId)
	const bookingSnap = await getDoc(bookingRef)
	if (!bookingSnap.exists()) {
		throw new Error('Booking not found')
	}
	const bookingData = bookingSnap.data() as BookingDocument
	await setDoc(bookingRef, { people: bookingData.people + 1 }, { merge: true })
}
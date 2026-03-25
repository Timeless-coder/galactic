import { collection, addDoc, getDoc, doc, setDoc, where, getDocs, query } from 'firebase/firestore'

import { db } from './firebaseConfig'
import type { Booking } from '../../types/booking'

export const createNewBooking = async (booking: Omit<Booking, 'id' | 'createdAt'>): Promise<string> => {
	const docRef = await addDoc(collection(db, 'bookings'), {
		createdAt: new Date(),
		tourId: booking.tourId,
		bookingUserId: booking.bookingUserId,
		departureDate: booking.departureDate,
		people: booking.people,
	})
	return docRef.id
}

export const addPersonToBooking = async (bookingId: string): Promise<void> => {
	const bookingRef = doc(db, 'bookings', bookingId)
	const bookingSnap = await getDoc(bookingRef)
	if (!bookingSnap.exists()) {
		throw new Error('Booking not found')
	}
	const bookingData = bookingSnap.data() as Booking
	await setDoc(bookingRef, { people: bookingData.people + 1 }, { merge: true })
}

export const getBookingsByUserId = async (userId: string): Promise<Booking[]> => {
	const bookingsQuery = await getDocs(query(collection(db, 'bookings'), where('bookingUserId', '==', userId)))
	return bookingsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking))
}
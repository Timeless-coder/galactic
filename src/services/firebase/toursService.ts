import { doc, getDoc, collection, query, where, getDocs, addDoc, setDoc, deleteDoc, updateDoc, deleteField } from 'firebase/firestore'

import { db } from './firebaseConfig'
import { getRole } from './authService'
import type { Tour } from '../../types/tour'
import { Role } from '../../types/user'

export const getAllToursService = async (): Promise<Tour[]> => {
	const toursSnapshot = await getDocs(collection(db, 'tours'))
	return toursSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tour))
}

export const getTourById = async (id: string): Promise<Tour> => {
	const tourRef = doc(db, 'tours', id)
	const tourSnap = await getDoc(tourRef)
	if (!tourSnap.exists()) {
		throw new Error('Tour not found')
	}
	return { id: tourSnap.id, ...tourSnap.data() } as Tour
}

export const getTourBySlug = async (slug: string): Promise<Tour> => {
	const q = query(collection(db, 'tours'), where('slug', '==', slug))
	const querySnapshot = await getDocs(q)
	if (querySnapshot.empty) {
		throw new Error('Tour not found')
	}
	return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Tour
}

// *** ADMIN ***
// Omit the secondary 'id' property - see note in type.
export const createTourService = async (tour: Omit<Tour, 'id' | 'index'>, email: string): Promise<string> => {
	const userRole = await getRole(email)
	if (userRole !== Role.Admin) {
		throw new Error('There was an issue verifying your Admin credentials')
	}
  const docRef = await addDoc(collection(db, 'tours'), { ...tour })
  return docRef.id
}

export const updateTourService = async (id: string, tour: Partial<Tour>, email: string): Promise<void> => {
	const userRole = await getRole(email)
	if (userRole !== Role.Admin) {
		throw new Error('There was an issue verifying your Admin credentials')
	}
	const tourRef = doc(db, 'tours', id)
	await setDoc(tourRef, tour, { merge: true })
}

export const deleteTourService = async (id: string): Promise<void> => {
	const tourRef = doc(db, 'tours', id)
	await getDoc(tourRef) // Check if the document exists
	await deleteDoc(tourRef)
}

// *** Migrations ***
export const migrateTourDepartureDates = async (): Promise<void> => {
	const toursSnap = await getDocs(collection(db, 'tours'))
	for (const tourDoc of toursSnap.docs) {
		const data = tourDoc.data()
		const startDates = data.startDates
		const newStartDates: string[] = []
		startDates.forEach((date: string) => {
			const parts = date.split(' ')
			newStartDates.push(`${(Number(parts[0]) + 5).toString()} ${parts[1]} ${parts[2]}`)
		})
		await updateDoc(doc(db, 'tours', tourDoc.id), {
					startDates: newStartDates
				})
	}
}

export const removeFieldFromTour = async (fieldLabel: string): Promise<void> => {
	const toursSnapshot = await getDocs(collection(db, 'tours'))
	for (const tourDoc of toursSnapshot.docs) {
		const data = tourDoc.data()
		if (fieldLabel in data) {
			await updateDoc(doc(db, 'tours', tourDoc.id), {
				[fieldLabel]: deleteField(),
			})
		}
	}
}
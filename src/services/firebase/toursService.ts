import { doc, getDoc, collection, query, where, getDocs, addDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore'

import { db } from './firebaseConfig'
import type { Tour } from '../../types/tour'

const TOUR_INDEX_DOC = 'qiiJ5kJFuSM32hXW6Z1g'

export const getNewTourIndexService = async (): Promise<number> => {
	const snap = await getDoc(doc(db, 'newTourIndex', TOUR_INDEX_DOC))
	return (snap.data() as { index: number }).index
}

export const incrementNewTourIndexService = async (current: number): Promise<void> => {
	await updateDoc(doc(db, 'newTourIndex', TOUR_INDEX_DOC), { index: current + 1 })
}

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

export const deleteTourService = async (id: string): Promise<void> => {
	const tourRef = doc(db, 'tours', id)
	await getDoc(tourRef) // Check if the document exists
	await deleteDoc(tourRef)
}

// *** ADMIN ***
// Omit the secondary 'id' property - see note in type.
export const createTourService = async (tour: Omit<Tour, 'id' | 'index'>): Promise<string> => {
  const index = await getNewTourIndexService()
  const docRef = await addDoc(collection(db, 'tours'), { ...tour, index })
  await incrementNewTourIndexService(index)
  return docRef.id
}

export const updateTourService = async (id: string, tour: Partial<Tour>): Promise<void> => {
	const tourRef = doc(db, 'tours', id)
	await setDoc(tourRef, tour, { merge: true })
}
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'

import { db } from './firebaseConfig'
import type { Review } from '../../types/review'

const mapFirebaseReview = (doc: any): Review => ({
	id: doc.id,
	rating: doc.data().rating,
	text: doc.data().review,
	tourId: doc.data().tour,
	userId: doc.data().user,
})

export const getReviewsByTourId = async (tourId: string): Promise<Review[]> => {
	const q = query(collection(db, 'reviews'), where('tour', '==', tourId))
	const querySnapshot = await getDocs(q)
	return querySnapshot.docs.map(mapFirebaseReview)
}

export const getReviewsByUserId = async (userId: string): Promise<Review[]> => {
	const q = query(collection(db, 'reviews'), where('user', '==', userId))
	const querySnapshot = await getDocs(q)
	return querySnapshot.docs.map(mapFirebaseReview)
}

export const createReviewService = async (review: Omit<Review, 'id'>): Promise<string> => {
	const docRef = await addDoc(collection(db, 'reviews'), {
		rating: review.rating,
		review: review.text,
		tour: review.tourId,
		user: review.userId,
	})
	return docRef.id
}
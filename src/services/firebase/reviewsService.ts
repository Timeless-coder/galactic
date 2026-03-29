import { collection, query, where, getDocs, addDoc, getDoc, doc, orderBy, serverTimestamp, updateDoc, deleteField, Timestamp } from 'firebase/firestore'

import { db } from './firebaseConfig'
import type { Review, ReviewWithUser, ReviewWithTour } from '../../types/review'
import type { User } from '../../types/user'
import type { Tour } from '../../types/tour'

const mapFirebaseReview = (doc: any): Review => ({
	id: doc.id,
	rating: doc.data().rating,
	text: doc.data().review,
	tourId: doc.data().tour,
	userId: doc.data().user,
  createdAt: serverTimestamp().toString()
})

// Not used in app - I went with a compound query for performance.
// This would have required that each Review do its own query to get User info.
export const getReviewsByTourId = async (tourId: string): Promise<Review[]> => {
	const q = query(collection(db, 'reviews'), where('tour', '==', tourId))
	const querySnapshot = await getDocs(q)
	return querySnapshot.docs.map(mapFirebaseReview)
}

export async function fetchReviewsForTour(tourId: string): Promise<ReviewWithUser[]> {
  // 1. Fetch reviews for this tour
  const reviewQuery = query(
    collection(db, "reviews"),
    where("tourId", "==", tourId),
    orderBy("createdAt", "desc")
  );
  const reviewSnap = await getDocs(reviewQuery);
  const reviews: Review[] = reviewSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));

  // 2. Collect unique userIds
  const userIds = [...new Set(reviews.map(r => r.userId))];

  // 3. Batch fetch users
  const userDocs = await Promise.all(
    userIds.map(uid => getDoc(doc(db, "users", uid)))
  );
  const users: Record<string, User> = Object.fromEntries(
    userDocs.filter(u => u.exists()).map(u => [u.id, u.data() as User])
  );

  // 4. Map into nested type
  return reviews.map(r => ({
    review: r,
    user: users[r.userId] || null
  }));
}

// Not used in app - this would have required each Review to do its own query to get Tour info.
export const getReviewsByUserId = async (userId: string): Promise<Review[]> => {
	const q = query(collection(db, 'reviews'), where('user', '==', userId))
	const querySnapshot = await getDocs(q)
	return querySnapshot.docs.map(mapFirebaseReview)
}

export async function fetchReviewsByUser(userId: string): Promise<ReviewWithTour[]> {
  // 1. Fetch reviews by this user
  const reviewQuery = query(
    collection(db, "reviews"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const reviewSnap = await getDocs(reviewQuery);
  const reviews: Review[] = reviewSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));

  // 2. Collect unique tourIds
  const tourIds = [...new Set(reviews.map(r => r.tourId))];

  // 3. Batch fetch tours
  const tourDocs = await Promise.all(
    tourIds.map(tid => getDoc(doc(db, "tours", tid)))
  );
  const tours: Record<string, Tour> = Object.fromEntries(
    tourDocs.filter(t => t.exists()).map(t => [t.id, t.data() as Tour])
  );

  // 4. Map into nested type
  return reviews.map(r => ({
    review: r,
    tour: tours[r.tourId] || null
  }));
}

export const createReviewService = async (review: Omit<Review, 'id' | 'createdAt'>): Promise<string> => {
	const docRef = await addDoc(collection(db, 'reviews'), {
		rating: review.rating,
		review: review.text,
		tour: review.tourId,
		user: review.userId,
		createdAt: serverTimestamp(),
	})
	return docRef.id
}

// *** Migrations ***

const createRandomNumber = (lowest: number, highest: number) => {
  return Math.floor(Math.random() * (highest - lowest + 1)) + lowest
}

export const migrateReviewFields = async (): Promise<void> => {
  const reviewsSnap = await getDocs(collection(db, 'reviews'))
  for (const reviewDoc of reviewsSnap.docs) {
     await updateDoc(doc(db, 'reviews', reviewDoc.id), {
        createdAt: `${createRandomNumber(2021, 2025)} ${createRandomNumber(1, 12)} ${createRandomNumber(1, 28)}`
      })
  }
}

export const addCreatedAtToReviews = async (): Promise<void> => {
  const reviewsSnap = await getDocs(collection(db, 'reviews'))
  for (const reviewDoc of reviewsSnap.docs) {
    const now = Date.now()
    const randomOffset = Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 720) // up to 2 years ago
    const createdAt = Timestamp.fromMillis(now - randomOffset)
    await updateDoc(doc(db, 'reviews', reviewDoc.id), {
      createdAt
    })
  }
}
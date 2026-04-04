import toast from 'react-hot-toast'

import type { ReviewWithTour } from '../../../types/review'

import { useAuth } from '../../../hooks/useAuth'
import { fetchReviewsByUser } from '../../../services/firebase/reviewsService'

import Spinner from '../../../elements/Spinner/Spinner'
import UserReviewCard from '../UserReviews/UserReviewCard'

import styles from './UserReviews.module.scss'
import { useFirestoreReadService } from '../../../hooks/useFirestoreReadService'
import { useEffect } from 'react'

const UserReviews = () => {
  const { currentUser } = useAuth()
  const { data: myReviews, loading, error } =
    useFirestoreReadService<ReviewWithTour[]>(() => fetchReviewsByUser(currentUser?.id || ''))
  
  useEffect(() => {
    if (error) toast.error(`Error fetching reviews: ${error.message}`)
  }, [error])

  return (
    <section aria-labelledby="my-reviews-title" className={styles.reviewsContainer}>
      {loading && <Spinner />}
      {error && <h2>Unable to fetch reviews</h2>}
      {!loading && !error && (!myReviews || myReviews?.length === 0) && (
        <header>
          <h2>You have not reviewed any tours yet.</h2>
        </header>
      )}
      {myReviews && myReviews.length > 0 && (
        <>
          <header>
            <h2 id="my-reviews-title">My Reviews</h2>
          </header>
          {myReviews.map(item => (
            <UserReviewCard
              key={item.review.id}
              rating={item.review.rating}
              text={item.review.text}
              tour={item.tour}
              createdAt={item.review.createdAt}
            />
          ))}
        </>
      )}
    </section>
  )
}

export default UserReviews

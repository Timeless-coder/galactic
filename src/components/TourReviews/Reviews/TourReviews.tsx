import { format } from 'date-fns/format'

import type { ReviewWithUser } from '../../../types/review'
import type { Tour } from '../../../types/tour'

import { fetchReviewsForTour } from '../../../services/firebase/reviewsService'
import { useFirestoreReadService } from '../../../hooks/useFirestoreReadService'

import ReviewCard from '../ReviewCard/ReviewCard'
import Spinner from '../../../elements/Spinner/Spinner'

import styles from './TourReviews.module.scss'

type ReviewsProps = {
  tour: Tour
}

const firestoreServiceOptions = {
  silent: true
}

export const TourReviews = ({ tour }: ReviewsProps) => {
  const { data: reviews, loading } = useFirestoreReadService<ReviewWithUser[] | null>(() => fetchReviewsForTour(tour.id), firestoreServiceOptions)

  return (
    <section className={styles.reviewsContainer} aria-label="Tour reviews">
      {loading && <Spinner />}
      {!loading && (!reviews || reviews?.length === 0) && (
        <header>
          <h3 className={styles.empty}>
            No reviews for this tour yet.
          </h3>
        </header>
      )}
      {reviews?.map(item => (
        <ReviewCard
          key={item.review.id}
          rating={item.review.rating}
          text={item.review.text}
          userName={item.user?.displayName}
          userPhoto={item.user?.photoURL}
          createdAt={format(item.review.createdAt, 'PPPP')}
          tour={tour}
        />
      ))}
    </section>
  )
}

export default TourReviews

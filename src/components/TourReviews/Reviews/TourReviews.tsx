import { useEffect, useState } from 'react'
import { format } from 'date-fns/format'
import toast from 'react-hot-toast'

import type { Review, ReviewWithUser } from '../../../types/review'
import type { Tour } from '../../../types/tour'

import { fetchReviewsForTour } from '../../../services/firebase/reviewsService'

import ReviewCard from '../ReviewCard/ReviewCard'
import Spinner from '../../../elements/Spinner/Spinner'

import styles from './TourReviews.module.scss'

type ReviewsProps = {
  tour: Tour
  id: string
}

export const TourReviews = ({ tour, id }: ReviewsProps) => {
  const [reviews, setReviews] = useState<ReviewWithUser[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true

    const fetchTourReviews = async () => {
      setLoading(true)
      
      try {
        const fetchedReviews: ReviewWithUser[] = await fetchReviewsForTour(id)
        if (mounted) setReviews(fetchedReviews)
      }
      catch (err) {
        console.error(err)
        toast.error('Failed to fetch reviews for this tour')
        if (mounted) setReviews([])
      }
      finally {
        if (mounted) setLoading(false)
      }
    }

    fetchTourReviews()

    return () => {
      mounted = false
    }
  }, [id])


  return (
    <div className={styles.reviewsContainer}>
      {loading && <Spinner />}
      {reviews.map(item => (
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
      {reviews.length === 0 && !loading && (
        <h3 className={styles.empty}>
          No reviews for this tour yet.
        </h3>
      )}
    </div>
  )
}

export default TourReviews

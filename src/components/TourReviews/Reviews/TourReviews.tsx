import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import type { Review } from '../../../types/review'
import type { Tour } from '../../../types/tour'

import { getReviewsByTourId } from '../../../services/firebase/reviewsService'

import ReviewCard from '../ReviewCard/ReviewCard'
import Spinner from '../../../elements/Spinner/Spinner'

import styles from './TourReviews.module.scss'

type ReviewsProps = {
  tour: Tour
  id: string
}

export const TourReviews = ({ tour, id }: ReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true

    const fetchTourReviews = async () => {
      setLoading(true)
      
      try {
        const fetchedReviews = await getReviewsByTourId(id)
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
      {reviews.map(review => (
        <ReviewCard
          key={review.id}
          tour={tour}
          review={review}
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

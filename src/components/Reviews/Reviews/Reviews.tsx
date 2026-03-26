import { useEffect, useState } from 'react'

import type { Review } from '../../../types/review'
import type { Tour } from '../../../types/tour'

import { getReviewsByTourId } from '../../../services/firebase/reviewsService'

import ReviewCard from '../ReviewCard/ReviewCard'

import styles from './Reviews.module.scss'

type ReviewsProps = {
  tour: Tour
  id: string
}

export const Reviews = ({ tour, id }: ReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    let mounted = true
    getReviewsByTourId(id)
      .then(fetchedReviews => {
        if (mounted) setReviews(fetchedReviews)
      })
      .catch(err => console.error(err))
    return () => {
      mounted = false
    }
  }, [id])

  return (
    <div className={styles.reviewsContainer}>
      {reviews?.map(review => (
        <ReviewCard
          key={review.id}
          tour={tour}
          review={review}
        />
      ))}
      {reviews.length === 0 && (
        <h3 className={styles.empty}>
          No reviews for this tour yet.
        </h3>
      )}
    </div>
  )
}

export default Reviews

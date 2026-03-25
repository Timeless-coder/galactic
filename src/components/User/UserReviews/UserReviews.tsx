import React, { useState, useEffect } from 'react'

import type { Review } from '../../../types/review'
import { useAuth } from '../../../hooks/useAuth'
import Spinner from '../../../elements/Spinner/Spinner'
import UserReviewCard from '../UserReviews/UserReviewCard'
import styles from './UserReviews.module.scss'
import { getReviewsByUserId } from '../../../services/firebase/reviewsService'

const UserReviews = () => {
  const { currentUser } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true;
    const getReviews = async () => {
      setLoading(true);
      try {
        if (!currentUser?.id) {
          setReviews([]);
          setLoading(false);
          return;
        }
        const myReviews: Review[] = await getReviewsByUserId(currentUser.id)
        if (mounted && myReviews?.length > 0) setReviews(myReviews)
      } catch (err) {
        if (mounted) setReviews([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    getReviews();
    return () => {
      mounted = false;
    };
  }, [currentUser]);

  return (
    <>
      {loading && <Spinner />}
      <div className={styles.reviewsContainer}>
        {reviews.length > 0
          ? reviews.map(review => (<UserReviewCard key={review.id} review={review} />))
          : <h2>You have not reviewed any tours yet.</h2>
        }
      </div>
    </>
  )
}

export default UserReviews

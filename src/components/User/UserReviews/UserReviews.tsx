import { useState, useEffect } from 'react'

import type { ReviewWithTour } from '../../../types/review'

import { useAuth } from '../../../hooks/useAuth'
import { fetchReviewsByUser } from '../../../services/firebase/reviewsService'

import Spinner from '../../../elements/Spinner/Spinner'
import UserReviewCard from '../UserReviews/UserReviewCard'

import styles from './UserReviews.module.scss'
import { useFirestoreReadService } from '../../../hooks/useFirestoreReadService'

const UserReviews = () => {
  const { currentUser } = useAuth()
  const { data: myReviews, loading } =
    useFirestoreReadService<ReviewWithTour[]>(() => fetchReviewsByUser(currentUser?.id || ''))

  return (
    <section aria-labelledby="my-reviews-title" className={styles.reviewsContainer}>
      {loading && <Spinner />}
      {!loading && (!myReviews || myReviews?.length === 0) && (
        <header>
          <h2 id="my-reviews-title">You have not reviewed any tours yet.</h2>
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

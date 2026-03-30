import { useState, useEffect } from 'react'

import type { ReviewWithTour, Review } from '../../../types/review'

import { useAuth } from '../../../hooks/useAuth'
import { fetchReviewsByUser, getReviewsByUserId } from '../../../services/firebase/reviewsService'

import Spinner from '../../../elements/Spinner/Spinner'
import UserReviewCard from '../UserReviews/UserReviewCard'

import styles from './UserReviews.module.scss'

const UserReviews = () => {
  const { currentUser } = useAuth()
  const [myReviews, setReviews] = useState<ReviewWithTour[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    
    if (!currentUser?.id) {
      console.log('no user')
      return
    }

    const getReviews = async () => {
      setLoading(true)

      try {
          const myReviews: ReviewWithTour[] = await fetchReviewsByUser(currentUser.id)
          if (mounted && myReviews.length > 0) setReviews(myReviews)
      }
      catch (err: any) {
          console.log(err.message)
        }
      finally {
          if (mounted) setLoading(false)
        }
    }

    getReviews()
    
    return () => {
      mounted = false
    }
  }, [currentUser])

  return (
    <>
      {loading && <Spinner />}
      {!loading && myReviews?.length == 0 && <h2>You have not reviewed any tours yet.</h2>}
      <div className={styles.reviewsContainer}>
        {myReviews.length > 0 && (
          <>
          <h2>My Reviews</h2>
          {myReviews.map(item => (<UserReviewCard key={item.review.id} rating={item.review.rating} text={item.review.text} tour={item.tour} />))}
          </>
        )
        }
      </div>
    </>
  )
}

export default UserReviews

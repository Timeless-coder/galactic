import { useEffect, useState } from 'react'

import { getUserById } from '../../../services/firebase/usersService'

import type { Review } from '../../../types/review'
import type { Tour } from '../../../types/tour'
import type { User } from '../../../types/user'

import Spinner from '../../../elements/Spinner/Spinner'

import styles from './ReviewCard.module.scss'

type ReviewCardProps = {
  review: Review
  tour: Tour
} 

const ReviewCard = ({ review, tour }: ReviewCardProps) => {
  const [reviewUser, setReviewUser] = useState<User | null>(null)

  useEffect(() => {
    let mounted = true

    getUserById(review.userId)
      .then(fetchedUser => {
        if (mounted) setReviewUser(fetchedUser)
      })
      .catch(err => console.error(err))
      
    return () => {
      mounted = false
    }
  }, [review.userId])

  return (
    <div className={styles.reviewCard}>
      {review && reviewUser
        ? <>
            <img className={styles.backgroundImage} src={tour.imageCover} alt={tour.planet}/>
            <div className={styles.content}>
              <div className={styles.userImage}>
                <img src={reviewUser!.photoURL} alt={reviewUser!.name} />
              </div>            
              <h3>{reviewUser!.name}</h3>
              <p>{review.text}</p>
              <h2>{review.rating} / 100</h2>
            </div>
          </>
        : <Spinner />
      }
    </div>
  )
}

export default ReviewCard
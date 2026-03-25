import { useEffect, useState } from 'react'
import { getUserById } from '../../../services/firebase/usersService'

import type { Review } from '../../../types/review'
import type { Tour } from '../../../types/tour'
import type { User } from '../../../types/user'

// import Spinner from '../../../elements/Spinner/Spinner'

import styles from './ReviewCard.module.scss'

type ReviewCardProps = {
  review: Review
  tour: Tour
} 

const ReviewCard = ({ review, tour }: ReviewCardProps) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    let mounted = true
    getUserById(review.userId)
      .then(fetchedUser => {
        if (mounted) setUser(fetchedUser)
      })
      .catch(err => console.error(err))
    return () => {
      mounted = false
    }
  }, [review.userId])

  return (
    <div className={styles.reviewCard}>
      {review && user
        ? <>
            <img className={styles.backgroundImage} src={tour.imageCover} alt={tour.planet}/>
            <div className={styles.content}>
              <div className={styles.userImage}>
                <img src={user!.photoURL} alt={user!.name} />
              </div>            
              <h3>{user!.name}</h3>
              <p>{review.text}</p>
              <h2>{review.rating} / 100</h2>
            </div>
          </>
        : <h1>Loading...</h1>
      }
    </div>
  )
}

export default ReviewCard
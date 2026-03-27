import { useEffect, useState } from 'react'

import { getUserById } from '../../../services/firebase/usersService'

import type { Review } from '../../../types/review'
import type { Tour } from '../../../types/tour'
import type { User } from '../../../types/user'

import Spinner from '../../../elements/Spinner/Spinner'

import styles from './ReviewCard.module.scss'
import anonymousImage from '../../../assets/Anonymous.jpg'

const defaultUserImageURL = anonymousImage

type ReviewCardProps = {
  review: Review
  tour: Tour
} 

const ReviewCard = ({ review, tour }: ReviewCardProps) => {
  const [reviewUser, setReviewUser] = useState<User | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchReviewUser = async () => {
      try {
        const fetchedUser = await getUserById(review.userId)
        if (mounted) setReviewUser(fetchedUser)
      }
      catch(err) {
        console.error(err)
        const placeholderUser: User = {
          id: 'unknown',
          name: 'Anonymous',
          email: "unknown@example.com",
          photoURL: defaultUserImageURL,
          role: 'user'
        }
        if (mounted) setReviewUser(placeholderUser)
      }
    }

    fetchReviewUser()
    
    return () => {
      mounted = false
    }
  }, [review.userId])

  return (
    <div className={styles.reviewCard}>
      {reviewUser
        ? <>
            <img className={styles.backgroundImage} src={tour.imageCover} alt={tour.planet}/>
            <div className={styles.content}>
              <div className={styles.userImage}>
                <img src={reviewUser.photoURL || defaultUserImageURL} alt={reviewUser.name} />
              </div>            
              <h3>{reviewUser.name}</h3>
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
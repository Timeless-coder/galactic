import { useEffect, useState } from 'react'
import type { Review } from '../../../types/review'
import type { Tour } from '../../../types/tour'
import { useAuth } from '../../../hooks/useAuth'
import Spinner from '../../../elements/Spinner/Spinner'
import styles from './UserReviewCard.module.scss'
import { getTourById } from '../../../services/firebase/toursService'

type UserReviewCardProps = {
  review: Review
}

const UserReviewCard = ({ review }: UserReviewCardProps) => {
  const { currentUser } = useAuth()
  const [tour, setTour] = useState<Tour | null>(null)

  useEffect(() => {
    let mounted = true

    const getTour = async () => {
      try {
        if (!review?.tourId) {
          setTour(null)
          return
        }
        const tourData = await getTourById(review.tourId)
        if (mounted) setTour(tourData)
      } catch {
        if (mounted) setTour(null)
      }
    }

    getTour()

    return () => {
      mounted = false
    }
  }, [review])
  
  return (
    <div className={styles.reviewCard}>
      {!review || !tour
        ? <Spinner />
        : (
          <>
            <img className={styles.backgroundImage} src={tour.imageCover} alt={tour.planet} />
            <div className={styles.content}>
              <div className={styles.userImage}>
                <img src={currentUser?.photoURL || ''} alt={currentUser?.name || 'User'} />
              </div>
              <h3>{currentUser?.name || 'User'}</h3>
              <p>{review.text}</p>
              <h2>{review.rating} / 100</h2>
            </div>
          </>
          )
      }
    </div>
  )
}

export default UserReviewCard

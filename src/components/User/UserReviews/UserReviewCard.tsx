import type { Tour } from '../../../types/tour'

import { useAuth } from '../../../hooks/useAuth'

import styles from './UserReviewCard.module.scss'

type UserReviewCardProps = {
  rating: number
  text: string
  tour: Tour
}

const UserReviewCard = ({ rating, text, tour }: UserReviewCardProps) => {
  const { currentUser } = useAuth()
  
  return (
    <div className={styles.reviewCard}>
     <img className={styles.backgroundImage} src={tour.imageCover} alt={tour.planet} />
      <div className={styles.content}>
        <div className={styles.userImage}>
          <img src={currentUser?.photoURL || ''} alt={currentUser?.displayName || 'Anonymous'} />
        </div>
        <h3>{currentUser?.displayName || 'Anonymous'}</h3>
        <p>{text}</p>
        <h3>{tour.name}</h3>
        <p>{tour.planet}</p>
        <h2>{rating} / 100</h2>
      </div>
  </div>
  )
}

export default UserReviewCard

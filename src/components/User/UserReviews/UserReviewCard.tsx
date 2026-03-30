import type { Tour } from '../../../types/tour'

import { useAuth } from '../../../hooks/useAuth'

import styles from './UserReviewCard.module.scss'

type UserReviewCardProps = {
  rating: number
  text: string
  tour: Tour
  createdAt: string
}

const UserReviewCard = ({ rating, text, tour, createdAt }: UserReviewCardProps) => {
  const { currentUser } = useAuth()
  
  return (
    <article className={styles.reviewCard}>
      <figure>
        <img className={styles.backgroundImage} src={tour.imageCover} alt={tour.planet} />
      </figure>
      <section className={styles.content}>
        <header>
          <figure className={styles.userImage}>
            <img src={currentUser?.photoURL} alt={currentUser?.displayName} />
          </figure>
          <h3>{currentUser?.displayName}</h3>
          <p style={{ fontSize: '12px' }}>Reviewed: <em>{createdAt}</em></p>
        </header>
        <p>{text}</p>
        <h2>{rating} / 100</h2>
      </section>
    </article>
  )
}

export default UserReviewCard

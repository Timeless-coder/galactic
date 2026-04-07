import type { Tour } from '../../../types/tour'

import styles from './ReviewCard.module.scss'
import anonymousImage from '../../../assets/Anonymous.jpg'

const defaultUserImageURL = anonymousImage

type ReviewCardProps = {
  rating: number
  text: string
  userName: string
  userPhoto: string
  createdAt: string
  tour: Tour
} 

const ReviewCard = ({ rating, text, userName, userPhoto, createdAt, tour }: ReviewCardProps) => {

  return (
    <article className={styles.reviewCard} style={{ backgroundImage: `url(${tour.imageCover})` }}>
      <section className={styles.content}>
        <header className={styles.headerContainer}>
          <div className={styles.userContainer}>
            <img src={userPhoto || defaultUserImageURL} alt={userName} className={styles.userImage} />
            <h3>{userName || 'Anonymous'}</h3>
          </div>
          <h3>{rating} / 100</h3>
        </header>
        <p style={{ fontSize: '12px' }}>Reviewed: <em>{createdAt}</em></p>
        <p>{text}</p>
      </section>
    </article>
  )
}

export default ReviewCard
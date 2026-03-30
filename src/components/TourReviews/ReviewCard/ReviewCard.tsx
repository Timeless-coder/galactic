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
    <article className={styles.reviewCard}>
      <figure>
        <img className={styles.backgroundImage} src={tour.imageCover} alt={tour.planet} />
      </figure>
      <section className={styles.content}>
        <header>
          <figure className={styles.userImage}>
            <img src={userPhoto || defaultUserImageURL} alt={userName} />
          </figure>
          <h3>{userName || 'Anonymous'}</h3>
          <p style={{ fontSize: '12px' }}>Reviewed: <em>{createdAt}</em></p>
        </header>
        <p>{text}</p>
        <h2>{rating} / 100</h2>
      </section>
    </article>
  )
}

export default ReviewCard
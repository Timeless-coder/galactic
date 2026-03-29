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
    <div className={styles.reviewCard}>
     <img className={styles.backgroundImage} src={tour.imageCover} alt={tour.planet}/>
      <div className={styles.content}>
        <div className={styles.userImage}>
          <img src={userPhoto || defaultUserImageURL} alt={userName} />
        </div>            
        <h3>{userName || 'Anonymous'}</h3>
        <p style={{  fontSize: '12px' }}>Reviewed: <em>{createdAt}</em></p>
        <p>{text}</p>
        <h2>{rating} / 100</h2>
      </div>
    </div>
  )
}

export default ReviewCard
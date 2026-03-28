import { Link } from 'react-router'
import { IoArrowForwardCircleOutline } from 'react-icons/io5'

import type { Tour } from '../../types/tour'

import styles from './TourCard.module.scss'

type TourCardProps = {
  tour: Tour
  mode: "user" | "all"
  setShowSection: React.Dispatch<React.SetStateAction<string>>
  setReviewTour: React.Dispatch<React.SetStateAction<Tour | null>>
  hasReview?: boolean
}

export const TourCard = ({ tour, mode, setShowSection, setReviewTour, hasReview }: TourCardProps) => {
  
  return (
  <div className={styles.card}>
    {tour && (
      <>
      <div className={styles.cardHeader}>
        <div className={styles.cardPicture}>
          <img src={tour.imageCover} alt={tour.name} />
        </div>
        <h1>{tour.planet}</h1>
      </div>

      <div className={`${styles.cardDetails} ${styles.one}`}>
        <h2>{tour.name}</h2>
        <div className={styles.cardDetailsText}>
          <h3>Difficulty:</h3> <h3>{tour.difficulty} / 100</h3>
        </div>
        <div className={styles.cardDetailsText}>
          <h3>Average Rating:</h3> <h3>{tour.averageRating} / 100</h3>
        </div>
        <div className={styles.cardDetailsText}>
          <h3>Total Reviews:</h3> <h3>{tour.reviews}</h3>
        </div>
      </div>

      {mode === 'all' && (
        <div className={styles.cardDetails}>
        <Link to={`/tours/${tour.slug}`}>
        <div className={styles.tourLink}>
          Click for Details
          <IoArrowForwardCircleOutline />
        </div>
        </Link>
      </div>    
      )}

      {mode === 'user' && (
        <div className={styles.cardDetails}>
          {hasReview ? (
            <div className={styles.tourLink} onClick={() => setShowSection('reviews')}>
              See my Review
              <IoArrowForwardCircleOutline />
            </div>
          ) : (
            <div className={styles.tourLink} onClick={() => {
              setShowSection('reviewTour')
              setReviewTour(tour)
            }}>
              Review this Tour
              <IoArrowForwardCircleOutline />
            </div>
          )}
        </div>
      )}
      
      </>      
    )}
  </div>
  )
}

export default TourCard

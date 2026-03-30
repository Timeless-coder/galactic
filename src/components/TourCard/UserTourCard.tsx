import { IoArrowForwardCircleOutline } from 'react-icons/io5'

import type { Tour } from '../../types/tour'

import styles from './TourCard.module.scss'

type TourCardProps = {
  tour: Tour
  setShowSection: React.Dispatch<React.SetStateAction<string>>
  setReviewTour: React.Dispatch<React.SetStateAction<Tour | null>>
  hasReview?: boolean
}

export const TourCard = ({ tour, setShowSection, setReviewTour, hasReview }: TourCardProps) => {

  const handleClickToCreateReview = () => {
    setReviewTour(tour)
    setShowSection('createReview')              
  }

  return (
    <article className={styles.card}>
      {tour && (
        <>
          {/* Header */}
          <header className={styles.cardHeader}>
            <div className={styles.cardPicture}>
              <img src={tour.imageCover} alt={tour.name} />
            </div>
            <h1>{tour.planet}</h1>
          </header>

          {/* Details */}
          <section className={`${styles.cardDetails} ${styles.one}`}>
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
          </section>

          {/* Button */}
          <section className={styles.cardDetails}>
            {hasReview ? (
              <button
                className={styles.tourLink}
                type="button"
                onClick={() => setShowSection('userReviews')}
                aria-label="See my review"
              >
                See my Review
                <IoArrowForwardCircleOutline />
              </button>
            ) : (
              <button
                className={styles.tourLink}
                type="button"
                onClick={handleClickToCreateReview}
                aria-label="Review this tour"
              >
                Review this Tour
                <IoArrowForwardCircleOutline />
              </button>
            )}
          </section>
        </>
      )}
    </article>
  )
}

export default TourCard

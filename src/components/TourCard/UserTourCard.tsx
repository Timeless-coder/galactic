import { IoArrowForwardCircleOutline } from 'react-icons/io5'

import type { Tour } from '../../types/tour'
import { UserComponent } from '../../pages/UserPage/UserPage'
import CustomButton from '../../elements/CustomButton/CustomButton'

import styles from './TourCard.module.scss'

type TourCardProps = {
  tour: Tour
  setShowSection: React.Dispatch<React.SetStateAction<UserComponent>>
  setReviewTour: React.Dispatch<React.SetStateAction<Tour | null>>
  hasReview?: boolean
}

export const TourCard = ({ tour, setShowSection, setReviewTour, hasReview }: TourCardProps) => {

  const handleClickToCreateReview = () => {
    setReviewTour(tour)
    setShowSection(UserComponent.CreateReview)              
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
              <CustomButton
                type="button"
                onClick={() => setShowSection(UserComponent.UserReviews)}
                aria-label="See my review"
                width='100%'
              >
                See my Review
                <IoArrowForwardCircleOutline />
              </CustomButton>
            ) : (
              <CustomButton
                type="button"
                onClick={handleClickToCreateReview}
                aria-label="Review this tour"
                width='100%'
              >
                Review this Tour
                <IoArrowForwardCircleOutline />
              </CustomButton>
            )}
          </section>
        </>
      )}
    </article>
  )
}

export default TourCard

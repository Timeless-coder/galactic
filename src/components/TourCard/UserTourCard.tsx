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
            <p className={styles.cardPlanet}>{tour.planet}</p>
          </header>

          {/* Details */}
          <section className={`${styles.cardDetails} ${styles.one}`}>
            <h2>{tour.name}</h2>
            <dl>
              <div className={styles.cardDetailsText}>
                <dt>Difficulty:</dt>
                <dd>{tour.difficulty} / 100</dd>
              </div>
              <div className={styles.cardDetailsText}>
                <dt>Average Rating:</dt>
                <dd>{tour.averageRating} / 100</dd>
              </div>
              <div className={styles.cardDetailsText}>
                <dt>Total Reviews:</dt>
                <dd>{tour.reviews}</dd>
              </div>
            </dl>
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

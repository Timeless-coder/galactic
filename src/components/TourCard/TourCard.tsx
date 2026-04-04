import { Link } from 'react-router'
import { IoArrowForwardCircleOutline } from 'react-icons/io5'

import type { Tour } from '../../types/tour'

import CustomButton from '../../elements/CustomButton/CustomButton'

import styles from './TourCard.module.scss'

type TourCardProps = {
  tour: Tour
}

export const TourCard = ({ tour }: TourCardProps) => {
  
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
            <Link to={`/tours/${tour.slug}`}>
              <CustomButton width='100%'>
                Click for Details
                <IoArrowForwardCircleOutline />
              </CustomButton>
            </Link>
          </section>
        </>
      )}
    </article>
  )
}

export default TourCard

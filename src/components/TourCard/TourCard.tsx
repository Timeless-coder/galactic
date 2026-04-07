import { Link, useNavigate } from 'react-router'
import { IoArrowForwardCircleOutline } from 'react-icons/io5'

import type { Tour } from '../../types/tour'

import CustomButton from '../../elements/CustomButton/CustomButton'

import styles from './TourCard.module.scss'

type TourCardProps = {
  tour: Tour
}

export const TourCard = ({ tour }: TourCardProps) => {
  const navigate = useNavigate()
  
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
           <CustomButton width='100%' onClick={() => navigate(`/tours/${tour.slug}`)}>
                Click for Details
                <IoArrowForwardCircleOutline />
              </CustomButton>
          </section>
        </>
      )}
    </article>
  )
}

export default TourCard

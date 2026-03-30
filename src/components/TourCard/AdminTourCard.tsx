import { IoArrowForwardCircleOutline } from 'react-icons/io5'

import type { Tour } from '../../types/tour'

import styles from './TourCard.module.scss'

type TourCardProps = {
  tour: Tour
  setEditTour: React.Dispatch<React.SetStateAction<Tour | null>>
  setShowSection: React.Dispatch<React.SetStateAction<string>>
}

export const AdminTourCard = ({ tour, setEditTour, setShowSection }: TourCardProps) => {

  const setEditTourSetShowSectionAndEdit = () => {
    setEditTour(tour)
    setShowSection('editTour')
  }
  
  return (
    <article className={styles.card}>
      {tour && (
        <button
          type="button"
          onClick={setEditTourSetShowSectionAndEdit}
          className={styles.cardButton}
          aria-label={`Edit tour ${tour.name}`}
        >
          <header className={styles.cardHeader}>
            <div className={styles.cardPicture}>
              <img src={tour.imageCover} alt={tour.name} />
            </div>
            <h1>{tour.planet}</h1>
          </header>

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

          <section className={styles.cardDetails}>
            <span className={styles.tourLink}>
              Edit this tour
              <IoArrowForwardCircleOutline />
            </span>
          </section>
        </button>
      )}
    </article>
  )
}

export default AdminTourCard

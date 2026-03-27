import type { Tour } from '../../types/tour'

import styles from './TourCard.module.scss'

type TourCardProps = {
  tour: Tour
  setEditTour: React.Dispatch<React.SetStateAction<Tour | null>>
  setShowSection: React.Dispatch<React.SetStateAction<string>>
  mode: string
}

export const AdminTourCard = ({ tour, setEditTour, setShowSection }: TourCardProps) => {

  const setEditTourSetShowSectionAndEdit = () => {
    setEditTour(tour)
    setShowSection('editTour')
  }
  
  return (
  <div className={styles.card}>
    {tour && (
    <div onClick={setEditTourSetShowSectionAndEdit}>
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
    </div>
    )}
  </div>
  )
}

export default AdminTourCard

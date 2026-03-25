import { useEffect, useState } from 'react'

import type { Tour } from '../../types/tour'

import { getAllToursService } from '../../services/firebase/toursService'

import TourCard from '../../components/TourCard/TourCard'

import styles from './ToursPage.module.scss'

export const ToursPage = () => {
  const [loading, setLoading] = useState(false)
  const [tours, setTours] = useState<Tour[]>([])

  useEffect(() => {
    setLoading(true);
    getAllToursService()
      .then((receivedTours) => setTours(receivedTours))
      .catch((error) => {
        console.log(`Error fetching tours: ${error.message}`)
        setTours([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.toursPageContainer}>

      <div className={styles.toursPageTop}>
        <h2>Our Tours:</h2>
        <p>We currently offer {tours.length} tours.</p>
        <p>Hit a "Click for Details" button for more information about a particular tour.</p>
      </div>

      <div className={styles.toursContainer}>
        {tours?.map(tour => <TourCard key={tour.id} tour={tour} />)}
      </div>
    </div>
  )
}

export default ToursPage

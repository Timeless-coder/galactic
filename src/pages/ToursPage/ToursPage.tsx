
import { useEffect } from 'react'
import toast from 'react-hot-toast'

import type { Tour } from '../../types/tour'

import { getAllToursService } from '../../services/firebase/toursService'
import { useFirestoreReadService } from '../../hooks/useFirestoreReadService'

import TourCard from '../../components/TourCard/TourCard'

import styles from './ToursPage.module.scss'
import Spinner from '../../elements/Spinner/Spinner'

export const ToursPage = () => {
  const { data: tours, loading, error } = useFirestoreReadService<Tour[]>(getAllToursService)

  useEffect(() => {
    if (error) toast.error(`Error fetching tours: ${error.message}`)
  }, [error])

  return (
    <main className={styles.toursPageContainer} aria-labelledby="tours-page-title">
      
      <header className={styles.toursPageTop}>
        <h1 id="tours-page-title">Our Tours:</h1>
        <p>We currently offer {tours?.length ?? 0} tours.</p>
        <p>Hit a "Click for Details" button for more information about a particular tour.</p>
      </header>
      
      <section className={styles.toursContainer} aria-label="Tours List">
        {loading && <Spinner />}
        {!loading && (!tours || tours.length === 0) && <h2>We have no tours. Something has gone horrible wrong.</h2>}
        {!loading && tours?.map(tour => <TourCard key={tour.id} tour={tour} />)}
      </section>
    </main>
  )
}

export default ToursPage

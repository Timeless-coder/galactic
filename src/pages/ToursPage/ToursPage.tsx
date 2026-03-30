import type { Tour } from '../../types/tour'

import { getAllToursService } from '../../services/firebase/toursService'

import TourCard from '../../components/TourCard/TourCard'

import styles from './ToursPage.module.scss'
import { useFirestoreReadService } from '../../hooks/useFirestoreReadService'
import Spinner from '../../elements/Spinner/Spinner'

const firestoreServiceOptions = {
  silent: true
}

export const ToursPage = () => {
  const { data: tours, loading } = useFirestoreReadService<Tour[] | null>(getAllToursService, firestoreServiceOptions)

  return (
    <main className={styles.toursPageContainer} aria-labelledby="tours-page-title">
      <header className={styles.toursPageTop}>
        <h1 id="tours-page-title">Our Tours:</h1>
        <p>We currently offer {tours?.length || 0} tours.</p>
        <p>Hit a "Click for Details" button for more information about a particular tour.</p>
      </header>
      
      <section className={styles.toursContainer} aria-label="Tours List">
        {loading && <Spinner />}
        {!loading && (!tours || tours.length === 0) && <h2>We have no tours. Something has gone horrible wrong.</h2>}
        {tours?.map(tour => <TourCard key={tour.id} tour={tour} />)}
      </section>
    </main>
  )
}

export default ToursPage

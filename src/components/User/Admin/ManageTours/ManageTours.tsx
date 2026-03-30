import { getAllToursService } from '../../../../services/firebase/toursService'

import type { Tour } from '../../../../types/tour'

import AdminTourCard from '../../../../components/TourCard/AdminTourCard'
import Spinner from '../../../../elements/Spinner/Spinner'

import styles from './ManageTours.module.scss'
import { useFirestoreReadService } from '../../../../hooks/useFirestoreReadService'

type ManageToursProps = {
  setShowSection: React.Dispatch<React.SetStateAction<string>>
  setEditTour: React.Dispatch<React.SetStateAction<Tour | null>>
}

export const Tours = ({ setEditTour, setShowSection }: ManageToursProps) => {
  const { data: tours, loading } = useFirestoreReadService<Tour[] | null>(() => getAllToursService())

  return (
    <>
      {loading && <Spinner />}
      {!loading && (!tours || tours?.length == 0) && <h2>We have no tours</h2>}
      <div className={styles.toursContainer}>
        {tours?.map((tour: Tour) => <AdminTourCard key={tour.id} tour={tour} setEditTour={setEditTour} setShowSection={setShowSection} />)}
      </div>
    </>
  )
}

export default Tours

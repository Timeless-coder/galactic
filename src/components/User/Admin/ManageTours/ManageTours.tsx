import { useEffect } from 'react'
import toast from 'react-hot-toast'

import type { Tour } from '../../../../types/tour'
import { UserComponent } from '../../../../pages/UserPage/UserPage'

import { getAllToursService } from '../../../../services/firebase/toursService'
import { useFirestoreReadService } from '../../../../hooks/useFirestoreReadService'

import AdminTourCard from '../../../../components/TourCard/AdminTourCard'
import Spinner from '../../../../elements/Spinner/Spinner'

import styles from './ManageTours.module.scss'

type ManageToursProps = {
  setShowSection: React.Dispatch<React.SetStateAction<UserComponent>>
  setEditTour: React.Dispatch<React.SetStateAction<Tour | null>>
}

export const ManageTours = ({ setEditTour, setShowSection }: ManageToursProps) => {
  const { data: tours, loading, error } = useFirestoreReadService<Tour[] | null>(() => getAllToursService())

  useEffect(() => {
    if (error) toast.error(`Error fetching tours: ${error.message}`)
  }, [error])

  return (
    <>
      {loading && <Spinner />}
      {!loading && (!tours || tours.length === 0) && <h2>We have no tours</h2>}
      <div className={styles.toursContainer}>
        {tours?.map((tour: Tour) => <AdminTourCard key={tour.id} tour={tour} setEditTour={setEditTour} setShowSection={setShowSection} />)}
      </div>
    </>
  )
}

export default ManageTours

import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { gsap } from 'gsap'

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
  const containerRef = useRef<HTMLElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
  if (!loading && tours && tours.length > 0 && containerRef.current && !hasAnimated.current) {
      hasAnimated.current = true
      gsap.fromTo(
        containerRef.current.querySelectorAll('article'),
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.3 }
      )
    }
  }, [loading, tours])

  useEffect(() => {
    if (error) toast.error(`Error fetching tours: ${error.message}`)
  }, [error])

  return (
    <>
      {loading && <Spinner />}
      {!loading && (!tours || tours.length === 0) && <h2>We have no tours</h2>}      
        {tours && <h3>There are {tours.length} tours to manage</h3>}
      <section ref={containerRef} className={styles.toursContainer}>
        {tours?.map((tour: Tour) => <AdminTourCard key={tour.id} tour={tour} setEditTour={setEditTour} setShowSection={setShowSection} />)}
      </section>
    </>
  )
}

export default ManageTours

import { useEffect, useState } from 'react'

import type { Tour } from '../../types/tour'

import { getAllToursService } from '../../services/firebase/toursService'

import TourCard from '../../components/TourCard/TourCard'

import styles from './ToursPage.module.scss'
import toast from 'react-hot-toast'

export const ToursPage = () => {
  const [loading, setLoading] = useState(false)
  const [tours, setTours] = useState<Tour[]>([])

  useEffect(() => {
    let mounted = true

    const getAllTours = async() => {
      setLoading(true)

      try {
        const fetchedTours = await getAllToursService()
        if (mounted) setTours(fetchedTours)
      }
      catch(err: any) {
        console.log(`Error fetching tours: ${err.message}`)
        setTours([])
        toast.error(`Failed to fetch tours: ${err.message}`)
      }
      finally {
        setLoading(false)
      }      
    }

    getAllTours()

    return () => {
      mounted = false
    }
    
  }, [])

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

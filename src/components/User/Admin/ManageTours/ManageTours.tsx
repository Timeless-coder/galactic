import { useEffect, useState } from 'react'
import type { Tour } from '../../../../types/tour'
import TourCard from '../../../../components/TourCard/TourCard'
import Spinner from '../../../../elements/Spinner/Spinner'
import styles from './ManageTours.module.scss'
import { getAllToursService } from '../../../../services/firebase/toursService'

type ManageToursProps = {
  setShowSection: (section: string) => void
  setEditTour: (tourId: string) => void
}

export const Tours = ({ setEditTour, setShowSection }: ManageToursProps) => {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true;
    const getTours = async () => {
      setLoading(true);
      try {
        const newTours: Tour[] = await getAllToursService();
        if (mounted) setTours(newTours);
      } catch {
        if (mounted) setTours([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    getTours();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      {loading && <Spinner />}
      <div className={styles.toursContainer}>
        {tours?.map((tour: Tour) => (
            <TourCard
              key={tour.id}
              tour={tour}
              setEditTour={setEditTour}
              setShowSection={setShowSection}
              mode='admin'
            />
          ))}
      </div>
    </>
  )
}

export default Tours

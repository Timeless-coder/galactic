import { useState, useEffect } from 'react'

import type { Booking } from '../../../types/booking'
import type { Tour } from '../../../types/tour'

import { useAuth } from '../../../hooks/useAuth'
import { getBookingsByUserId } from '../../../services/firebase/bookingsService'
import { getTourById } from '../../../services/firebase/toursService'

import TourCard from '../../../components/TourCard/TourCard'
import Spinner from '../../../elements/Spinner/Spinner'

import styles from './UserTours.module.scss'

const UserTours = () => {
  const { currentUser } = useAuth()
  const [myTours, setMyTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true

    const getMyTours = async () => {
      setLoading(true)
      try {
        if (!currentUser?.id) {
          setMyTours([])
          setLoading(false)
          return
        }
        const myBookings: Booking[] = await getBookingsByUserId(currentUser.id)

        const toursFromBookings: Tour[] = []
        for (const booking of myBookings) {
          const tourData = await getTourById(booking.tourId)
          if (tourData) toursFromBookings.push(tourData)
        }
        if (mounted) setMyTours(toursFromBookings)
      } catch (err) {
        if (mounted) setMyTours([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    getMyTours()
    return () => {
      mounted = false
    }
  }, [currentUser])

  return (
    <>
      {loading && <Spinner />}
      <div className={styles.userToursContainer}>
        {myTours.length > 0
          ? myTours.map(tour => (
            <TourCard
              key={tour.id}
              tour={tour}
              mode='user'
              setEditTour={() => {}}
              setShowSection={() => {}}
            />
          ))
          : <h2>You have not booked any tours yet.</h2>
        }
      </div>
    </>
  )
}

export default UserTours

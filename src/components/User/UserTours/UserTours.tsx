import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

import type { Booking } from '../../../types/booking'
import type { Tour } from '../../../types/tour'

import { useAuth } from '../../../hooks/useAuth'
import { getBookingsByUserId } from '../../../services/firebase/bookingsService'
import { getTourById } from '../../../services/firebase/toursService'

import TourCard from '../../TourCard/TourCard'
import Spinner from '../../../elements/Spinner/Spinner'

import styles from './UserTours.module.scss'

const UserTours = () => {
  const { currentUser } = useAuth()
  const [myTours, setMyTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true

    if (!currentUser?.id) {
      setMyTours([])
      setLoading(false)
      return
    }

    const getMyBookings = async () => {
      setLoading(true)

      try {
        const myBookings: Booking[] = await getBookingsByUserId(currentUser!.id)
        const toursFromBookings: Tour[] = []
        for (const booking of myBookings) {
          const tourData = await getTourById(booking.tourId)
          if (tourData) toursFromBookings.push(tourData)
        }
        if (mounted) setMyTours(toursFromBookings)
      }
      catch (err) {
        console.error(err)
        toast.error('Failed to fetch your tours. Please try again.')
        if (mounted) setMyTours([])
      }
      finally {
        if (mounted) setLoading(false)
      }
    }

    getMyBookings()

    return () => {
      mounted = false
    }
  }, [currentUser?.id])

  return (
    <>
      {loading && <Spinner />}
      <div className={styles.userToursContainer}>
        {myTours.length > 0
          ? myTours.map(tour => <TourCard key={tour.id} tour={tour} />)
          : <h2>You have not booked any tours yet.</h2>
        }
      </div>
    </>
  )
}

export default UserTours

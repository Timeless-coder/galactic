import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

import type { Booking } from '../../../types/booking'
import type { Tour } from '../../../types/tour'

import { useAuth } from '../../../hooks/useAuth'
import { getBookingsByUserId } from '../../../services/firebase/bookingsService'
import { getTourById } from '../../../services/firebase/toursService'
import { getReviewsByUserId } from '../../../services/firebase/reviewsService'

import TourCard from '../../TourCard/TourCard'
import Spinner from '../../../elements/Spinner/Spinner'

import styles from './UserTours.module.scss'

type UserToursProps = {
  setShowSection: React.Dispatch<React.SetStateAction<string>>
  setReviewTour: React.Dispatch<React.SetStateAction<Tour | null>>
}

const UserTours = ({ setShowSection, setReviewTour }: UserToursProps) => {
  const { currentUser } = useAuth()
  const [myTours, setMyTours] = useState<Tour[]>([])
  const [reviewedTourIds, setReviewedTourIds] = useState<Set<string>>(new Set())
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
        const uniqueTourMap = new Map<string, Tour>()
        for (const booking of myBookings) {
          if (!uniqueTourMap.has(booking.tourId)) {
            const tourData = await getTourById(booking.tourId)
            if (tourData) uniqueTourMap.set(booking.tourId, tourData)
          }
        }
        const myReviews = await getReviewsByUserId(currentUser!.id)
        const reviewed = new Set(myReviews.map(r => r.tourId))
        if (mounted) {
          setMyTours(Array.from(uniqueTourMap.values()))
          setReviewedTourIds(reviewed)
        }
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
      {!loading && myTours?.length == 0 && <h2>You have not booked any tours yet.</h2>}
      {myTours.length > 0 && (
        <>
          <h2>You can review tours you have booked but have not yet reviewed.</h2>
          <div className={styles.userToursContainer}>
            {myTours.map(tour => (
              <TourCard
                key={tour.id}
                tour={tour}
                mode='user'
                setShowSection={setShowSection}
                setReviewTour={setReviewTour}
                hasReview={reviewedTourIds.has(tour.id)}
              />
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default UserTours

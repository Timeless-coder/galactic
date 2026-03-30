import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'

import type { Booking } from '../../../types/booking'
import type { Tour } from '../../../types/tour'

import { useAuth } from '../../../hooks/useAuth'
import { getBookingsByUserId } from '../../../services/firebase/bookingsService'
import { getTourById } from '../../../services/firebase/toursService'
import { getReviewsByUserId } from '../../../services/firebase/reviewsService'

import UserTourCard from '../../TourCard/UserTourCard'
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
  if (!currentUser) return
  setLoading(true)

  const fetchData = async () => {
    try {
      // 1. Get all bookings for the current user
      const bookings = await getBookingsByUserId(currentUser.id) || []
      // 2. Get all tours for these bookings, ensuring uniqueness
      const tours = await Promise.all(
        bookings.map(b => getTourById(b.tourId))
      )
      // Use a Map to ensure unique tours by id
      const uniqueToursMap = new Map<string, Tour>()
      tours.forEach(tour => {
        if (tour && tour.id) uniqueToursMap.set(tour.id, tour)
      })
      setMyTours(Array.from(uniqueToursMap.values()))

      // 3. Get all reviews by the current user
      const reviews = await getReviewsByUserId(currentUser.id)
      // 4. Get the set of tourIds that have been reviewed
      const reviewedIds = new Set(reviews.map(r => r.tourId))
      // console.log('UserTours debug', {
      //   currentUserId: currentUser.id,
      //   bookings,
      //   tourIds: tours.map(t => t.id),
      //   reviews,
      //   reviewedIds: Array.from(reviewedIds),
      // })
      setReviewedTourIds(reviewedIds)
    } catch (err) {
      toast.error("Failed to load your tours or reviews.")
    } finally {
      setLoading(false)
    }
  }

  fetchData()
}, [currentUser])

  return (
    <>
      {loading && <Spinner />}
      {!loading && myTours?.length == 0 && <h2>You have not booked any tours yet.</h2>}
      {myTours.length > 0 && (
        <>
          <h2>You can review tours you have booked but have not yet reviewed.</h2>
          <div className={styles.userToursContainer}>
            {myTours.map(tour => (
              <UserTourCard
                key={tour.id}
                tour={tour}
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

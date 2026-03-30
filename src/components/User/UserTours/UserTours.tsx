import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

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
      const myBookings = await getBookingsByUserId(currentUser.id) || []
      const myBookedTours = await Promise.all(myBookings.map(b => getTourById(b.tourId)))

      const uniqueToursMap = new Map<string, Tour>()
      myBookedTours.forEach(tour => {
        if (tour?.id) uniqueToursMap.set(tour.id, tour)
      })
      setMyTours(Array.from(uniqueToursMap.values()))

      const myTourReviews = await getReviewsByUserId(currentUser.id)
      const myReviewedTourIds = new Set(myTourReviews.map(r => r.tourId))
      setReviewedTourIds(myReviewedTourIds)
    }
    catch (err: any) {
      console.log(err.message)
      toast.error(`${err.message}`)
    }
    finally {
      setLoading(false)
    }
  }

  fetchData()
}, [currentUser])

  return (
    <section aria-labelledby="user-tours-title">
      {loading && <Spinner />}
      {!loading && (!myTours || myTours?.length === 0) && (
        <header>
          <h2 id="user-tours-title">You have not booked any tours yet.</h2>
        </header>
      )}
      {myTours.length > 0 && (
        <>
          <header>
            <h2 id="user-tours-title">You can review tours you have booked but have not yet reviewed.</h2>
          </header>
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
    </section>
  )
}

export default UserTours

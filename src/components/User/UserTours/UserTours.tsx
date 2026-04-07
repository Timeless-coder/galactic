import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { gsap } from 'gsap'

import type { Tour } from '../../../types/tour'
import { UserComponent } from '../../../pages/UserPage/UserPage'

import { useAuth } from '../../../hooks/useAuth'
import { getBookingsByUserId } from '../../../services/firebase/bookingsService'
import { getTourById } from '../../../services/firebase/toursService'
import { getReviewsByUserId } from '../../../services/firebase/reviewsService'

import UserTourCard from '../../TourCard/UserTourCard'
import Spinner from '../../../elements/Spinner/Spinner'

import styles from './UserTours.module.scss'

type UserToursProps = {
  setShowSection: React.Dispatch<React.SetStateAction<UserComponent>>
  setReviewTour: React.Dispatch<React.SetStateAction<Tour | null>>
}

const UserTours = ({ setShowSection, setReviewTour }: UserToursProps) => {
  const { currentUser } = useAuth()
  const [myTours, setMyTours] = useState<Tour[]>([])
  const [reviewedTourIds, setReviewedTourIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
  if (!currentUser) return
  setLoading(true) 

  const fetchData = async () => {
    try {
      const myBookings = await getBookingsByUserId(currentUser.id) || []
      const tourResults = await Promise.allSettled(myBookings.map(b => getTourById(b.tourId)))
      const myBookedTours = tourResults
        .filter((r): r is PromiseFulfilledResult<Tour> => r.status === 'fulfilled')
        .map(r => r.value)

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
      console.error(err.message)
      toast.error(`${err.message ?? err}`)
    }
    finally {
      setLoading(false)
    }
  }

  fetchData()
}, [currentUser?.id])

useEffect(() => {
  if (!loading && myTours && myTours.length > 0 && containerRef.current && !hasAnimated.current) {
    hasAnimated.current = true
    gsap.fromTo(
      containerRef.current.querySelectorAll('article'),
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, stagger: 0.05, duration: 0.3 }
    )
  }
}, [loading, myTours])

  return (
    <section>
      {loading && <Spinner />}
      {!loading && (myTours.length === 0) && (
        <header>
          <h2 id="user-tours-title">You have not booked any tours yet.</h2>
        </header>
      )}
      {myTours.length > 0 && (
        <>
          <header>
            <h3 style={{ marginBottom: "10px" }} id="user-tours-title">I have booked {myTours.length} tours.</h3>
          </header>
          <section ref={containerRef} className={styles.userToursContainer}>
            {myTours.map(tour => (
              <UserTourCard
                key={tour.id}
                tour={tour}
                setShowSection={setShowSection}
                setReviewTour={setReviewTour}
                hasReview={reviewedTourIds.has(tour.id)}
              />
            ))}
          </section>
        </>
      )}
    </section>
  )
}

export default UserTours

import { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { Link, useParams, useNavigate } from 'react-router'
import { AiFillCloseCircle } from 'react-icons/ai'

import type { Tour } from '../../types/tour'

import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { getTourBySlug } from '../../services/firebase/toursService'

import CustomButton from '../../elements/CustomButton/CustomButton'
import TourReviews from '../../components/TourReviews/Reviews/TourReviews'
import HowThisWorks from '../../components/HowThisWorks/HowThisWorks'

import styles from './TourSinglePage.module.scss'
import Spinner from '../../elements/Spinner/Spinner'

const TourSinglePage = () => {
  const modalRef = useRef<HTMLDivElement>(null)
  const { slug } = useParams()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { addItemToCart, addPersonToBooking, cartItems } = useCart()
  const [tour, setTour] = useState<Tour>()
  const dateRefs = useRef<(HTMLDivElement | null)[]>([])
  const [loading, setLoading] = useState(false)

  const formatDate = (departureDate: string) => {
    return format(departureDate, 'PPPP')
  }

  const closeInstructionsModal = (time: number) => {
    const modal = modalRef.current  // read at call time
    if (modal) {
      setTimeout(() => {
        modal.style.opacity = '0'
        setTimeout(() => {
          modal.style.display = 'none'
        }, 1000)
      }, time);
      
    }
  }

  // THIS JUST GETS THE TOUR FOR THIS PAGE
  useEffect(() => {
    const getTour = async () => {
      setLoading(true)

      try {
        if (slug) {
          const tourData = await getTourBySlug(slug)
          if (tourData) setTour(tourData)
        }
        
      }
      catch (err: any) {
        console.error(err)
        toast.error(`Failed to fetch the tour: ${err.message ?? err}`)
      }
      finally {
        setLoading(false)
      }
    }

    getTour()
  }, [slug])

  // ANYTIME cartItems CHANGES, THIS CHECKS THE 3 dateRefs AGAINST THE CART FOR MATCHING BOOKINGS,
  // AND CHANGES display TO 'block' FOR ANY WITH MATCHES IN CART.
  useEffect(() => {
    if (!tour?.departureDates) return

    dateRefs.current.forEach((ref, i) => {
      if (!ref) return
      const hasCartItem = cartItems.some(item => item.tour.id === tour.id && item.booking.departureDate === tour.departureDates[i])
      ref.style.display = hasCartItem ? 'block' : 'none'
    })
  }, [cartItems, tour])

  // useEffect(() => {
  //   closeInstructionsModal(15_000)
  // }, [])  

  const handleBookingClick = (selectedDepartureDate: string) => {
    if (!tour || !currentUser) return

    const existingCartItem = cartItems.find(item => item.booking.tourId === tour.id && item.booking.departureDate === selectedDepartureDate)

    if (existingCartItem) {
      addPersonToBooking(existingCartItem)            
    }
    else {
      const booking = {
        id: `${tour.id} - ${selectedDepartureDate}`,
        createdAt: new Date().toISOString(),
        tourId: tour.id,
        bookingUserId: currentUser.id,
        departureDate: selectedDepartureDate,
        people: 1
      }
      addItemToCart({ booking, tour })
    }    
  }

  // SET THE textContent OF THE BOOK BUTTONS AND THE "# people booked" TEXT UNDER THEM.
  const setButtonLabelAndPeopleText = (selectedDepartureDate: string) => {
    const existingCartItem = cartItems.find(item => item.tour.id === tour?.id && item.booking.departureDate === selectedDepartureDate)
    if (!existingCartItem) return { buttonLabel: "Book Date", peopleText: "" }

    const peoplePerson = existingCartItem.booking.people === 1 ? "person" : "people"
    return {
      buttonLabel: "Add Person",
      peopleText: `${existingCartItem.booking.people} ${peoplePerson}`
    }
  }
 
  const setClickFunction = (date: string) => currentUser ? handleBookingClick(date) : navigate('/auth')
    
  const getModalText = () => currentUser
    ? (
      <h2>Click one of the <span>Book Date </span> buttons to start your adventure.
      <br />
      Click the button additional times to add more people to your tour.
      <br /> <br />
      Enjoy the universes!
      </h2>
    )
    : (
      <h2><Link to="/auth" state={{ userExists: true }}>Sign In</Link>
        or
        <Link to="/auth" state={{ userExists: false }}><span> Sign Up</span></Link> to start your adventures.
      <br /> <br />
      Enjoy the universes!
      </h2>

    )

  return (
    <>
      {/**Modal */}
      <aside className={styles.tourSingleInstructions} id='modal' ref={modalRef} aria-live="polite">
        {getModalText()}
       <AiFillCloseCircle className={styles.icon} onClick={() => closeInstructionsModal(0)} role='button'/>
      </aside>

      {loading && <Spinner />}
      {tour && (
        <main className={styles.tourSingleContainer} aria-labelledby="tour-single-title">

          {/**Header */}
          <header className={styles.tourHeader}>
            <div className={styles.tourPicture}>
              <img src={tour.imageCover} alt={tour.name} />
            </div>
            <h1 id="tour-single-title">{tour.planet}</h1>
          </header>

          <section className={styles.main}>
            <div className={styles.mainLeft} id='book'>
              
              {/* Basic Information */}
              <section className={`${styles.tourDetails} ${styles.one}`}>    
                <h2>{tour.name}</h2>
                <div className={styles.tourDetailsText}>
                  <p>Difficulty:</p> <p>{tour.difficulty} / 100</p>
                </div>
                <div className={styles.tourDetailsText}>
                  <p>Average Rating:</p> <p>{tour.averageRating} / 100</p>
                </div>
                <div className={styles.tourDetailsText}>
                  <p>Total Reviews:</p> <p>{tour.reviews}</p>
                </div>
              </section>

              {/* Departure Dates */}
              <section className={styles.tourDetails} aria-labelledby="departure-dates-title">              
                <h2 id="departure-dates-title">Departure Dates:</h2>
                {tour.departureDates?.map((departureDate, i) => {
                  const { buttonLabel, peopleText } = setButtonLabelAndPeopleText(departureDate)
                  return (
                    <div className={styles.tourDetailsText} key={departureDate}>
                      <div className={styles.tourDetailsTextLeft}>
                        <p>{formatDate(departureDate)}</p>
                        <p className={styles.peopleRef} ref={el => { dateRefs.current[i] = el }}>
                          {peopleText} booked
                        </p>
                      </div>
                      <div>
                        <CustomButton onClick={() => setClickFunction(departureDate)} layout='center'>
                          {buttonLabel}
                        </CustomButton>
                      </div>
                    </div>
                  )
                })}
              </section>
            </div>

            {/* Summary */}
            <section className={styles.mainRight}>
              <h2>{tour.summary}</h2>
              <p>{tour.description}</p>
            </section>

          </section>

          {/* Images */}
          <section className={styles.images} aria-label="Tour Images">
            {tour.images?.map((image) => (
              <div className={styles.tourImageContainer} key={image}>
                <img src={image} alt={tour.name}/>
              </div>
            ))}
          </section>

          {/* Reviews */}
          <section aria-labelledby="reviews">
            <h2 id="reviews-title" className={styles.reviewsTitle}>Reviews:</h2>
            <TourReviews tour={tour} />
          </section>

          <section aria-label="How This Works">
            <HowThisWorks />
          </section>

          <nav className={styles.book} aria-label="Booking Instructions">
            <p>Click one of the <strong><a href='#book'>Book Date</a></strong> buttons above to start your adventure.</p>
            <p>Click the button additional times to add more people to your tour.</p>
          </nav>
        </main>
      )}
    </>
  )
}

export default TourSinglePage
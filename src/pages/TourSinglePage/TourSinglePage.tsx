import { useEffect, useState, useRef } from 'react'
import { format } from 'date-fns/format'
import { Link, useParams, redirect } from 'react-router'
import { AiFillCloseCircle } from 'react-icons/ai'

import type { Tour } from '../../types/tour'
import type { Booking } from '../../types/booking'

import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { getTourBySlug } from '../../services/firebase/toursService'

import CustomButton from '../../elements/CustomButton/CustomButton'
import Reviews from '../../components/Reviews/Reviews/Reviews'

import styles from './TourSinglePage.module.scss'

const TourSinglePage = () => {
  const modalRef = useRef<HTMLDivElement>(null)
  const { slug } = useParams()
  const { user } = useAuth()
  const { addItemToCart, addPersonToBooking, cartItems } = useCart()
  const [tour, setTour] = useState<Tour>()
  const dateRefs = useRef<(HTMLDivElement | null)[]>([])
  const peopleRef = useRef<HTMLHeadingElement>(null)
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(false)
  const [people, setPeople] = useState(0)

  useEffect(() => {
    let mounted = true

    const getTour = async () => {
      try {
        setLoading(true)
        const tourData = await getTourBySlug(slug!)
        if (mounted) {
          setTour(tourData)
        }
      } catch (error) {
        console.error(error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    getTour()
    return () => {
      mounted = false
    }
  }, [slug])
   
  const closeInstructionsModal = () => {
    const modal = modalRef.current  // read at call time
    if (modal) {
      modal.style.opacity = '0'
      setTimeout(() => {
        modal.style.display = 'none'
      }, 1000)
    }
}

  const handleBook = (selectedDepartureDate: string) => {
    if (people === 0) {
      tour?.startDates.forEach((date, i) => {
        if (date !== selectedDepartureDate) {
          const otherDateButton = dateRefs.current[i]
          if (otherDateButton) {
            otherDateButton.style.display = 'none'
          }
        }
      })
      const booking: Booking = {
        id: `${tour!.id}-${selectedDepartureDate}`,
        createdAt: new Date().toISOString(),
        tourId: tour!.id,
        bookingUserId: user!.id,
        departureDate: selectedDepartureDate,
        people: 1,
      }
      setCurrentBooking(booking)
      addItemToCart({ booking, tour: tour! })
    } else {
      addPersonToBooking({ booking: currentBooking!, tour: tour! })
    }

    setPeople(prev => prev + 1)
    if (peopleRef.current) {
      peopleRef.current.style.display = 'block'
    }
  }

  const getBookButtonLabel = () => !user
    ? 'Sign In/Up'
    : cartItems.filter(item => item.tour.id === tour!.id).length > 0
      ? `Add Person ${people + 1}`
      : 'Book date'
    
  const getClickFunction = (date: string) => user
    ? handleBook(date)
    : redirect('/auth')
    
  const getModalText = () => user
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

    <div className={styles.tourSingleInstructions} id='modal' ref={modalRef}>
      {getModalText()}
      <AiFillCloseCircle className={styles.icon} onClick={closeInstructionsModal} />      
    </div>

    {tour &&
      <div className={styles.tourSingleContainer}>
        
        <div className={styles.tourHeader}>
          <div className={styles.tourPicture}>
            <img src={tour.imageCover} alt={tour.name} />
          </div>
          <h1>{tour.planet}</h1>
        </div>

        <div className={styles.main}>
          <div className={styles.mainLeft} id='book'>

            <div className={`${styles.tourDetails} ${styles.one}`}>    
              <h2>{tour.name}</h2>
              <div className={styles.tourDetailsText}>
                <h3>Difficulty:</h3> <h3>{tour.difficulty} / 100</h3>
              </div>
              <div className={styles.tourDetailsText}>
                <h3>Average Rating:</h3> <h3>{tour.averageRating} / 100</h3>
              </div>
              <div className={styles.tourDetailsText}>
                <h3>Total Reviews:</h3> <h3>{tour.reviews}</h3>
              </div>
            </div>

            <div className={styles.tourDetails}>              
              <h2>Start Dates:</h2>
              {tour.startDates?.map((departureDate, i) => (// index works fine for key, because there are always exactly 3
                <div className={styles.tourDetailsText} key={i} ref={el => { dateRefs.current[i] = el }}>
                  <h3>{format(new Date(departureDate), 'PPPP')}</h3>
                   <div onClick={() => getClickFunction(departureDate)}>
                    <CustomButton rect between around>
                    {getBookButtonLabel()}
                    </CustomButton>
                  </div>             
                </div>
              ))}
              <h3 className={styles.peopleRef} ref={peopleRef}>{`${people === 1 ? 'Person' : 'People'} booked: ${people}`}</h3>
            </div>

          </div>

          <div className={styles.mainRight}>
            <h2>{tour.summary}</h2>
            <p>{tour.description}</p>
          </div>
        </div>

        <div className={styles.images}>
          {tour.images?.map((image, i) => (// index works fine for key, because there are always exactly 3
            <div className={styles.tourImageContainer} key={i}>
              <img src={image} alt={tour.name}/>
            </div>
          ))}
        </div>
        
        <h2 className={styles.reviewsTitle}>Reviews:</h2>
        <Reviews tour={tour} id={tour.id} />

        <div className={styles.book}>
          <p>Click one of the <strong><a href='#book'>Book Date</a></strong> buttons above to start your adventure.</p>
          <p>Click the button additional times to add more people to your tour.</p>
        </div>      
    
      </div>
    }
    </>
  )
}

export default TourSinglePage
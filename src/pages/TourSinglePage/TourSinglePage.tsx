import { useEffect, useState, useRef } from 'react'
import { format } from 'date-fns/format'
import { Link, useParams, redirect } from 'react-router'
import { AiFillCloseCircle } from 'react-icons/ai'

import type { Tour } from '../../types/tour'

import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { getTourBySlug } from '../../services/firebase/toursService'

import CustomButton from '../../elements/CustomButton/CustomButton'
import Reviews from '../../components/Reviews/Reviews/Reviews'

import styles from './TourSinglePage.module.scss'
import type { CartItem } from '../../contexts/CartContext'

const TourSinglePage = () => {
  const modalRef = useRef<HTMLDivElement>(null)
  const { slug } = useParams()
  const { currentUser } = useAuth()
  const { addItemToCart, addPersonToBooking, cartItems } = useCart()
  const [tour, setTour] = useState<Tour>()
  const dateRefs = useRef<(HTMLDivElement | null)[]>([])
  const [loading, setLoading] = useState(false)

  // THIS JUST GETS THE TOUR FOR THIS PAGE
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

  // ANYTIME cartItems CHANGES, THIS CHECKS THE 3 dateRefs AGAINST THE CART FOR MATCHING BOOKINGS,
  // AND CHANGES display TO 'block' FOR ANY WITH MATCHES IN CART.
  useEffect(() => {
    if (!tour?.startDates) return

    dateRefs.current.forEach((ref, i) => {
      if (!ref) return
      const hasCartItem = cartItems.some(item => item.tour.id === tour.id && item.booking.departureDate === tour.startDates[i])
      ref.style.display = hasCartItem ? 'block' : 'none'
    })
  }, [cartItems, tour])
   
  const closeInstructionsModal = () => {
    const modal = modalRef.current  // read at call time
    if (modal) {
      modal.style.opacity = '0'
      setTimeout(() => {
        modal.style.display = 'none'
      }, 1000)
    }
}

  const handleBookingClick = (selectedDepartureDate: string) => {
    const existingCartItem = cartItems.find(item => item.booking.tourId === tour!.id && item.booking.departureDate === selectedDepartureDate)

    if (existingCartItem) {
      addPersonToBooking(existingCartItem)            
    }
    else {
      const booking = {
        id: `${tour!.id} - ${selectedDepartureDate}`,
        createdAt: new Date().toISOString(),
        tourId: tour!.id,
        bookingUserId: currentUser!.id,
        departureDate: selectedDepartureDate,
        people: 1
      }
      addItemToCart({booking, tour: tour! })
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
 
  const setClickFunction = (date: string) => currentUser ? handleBookingClick(date) : redirect('/auth')
    
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
              {tour.startDates?.map((departureDate, i) => (
                <div className={styles.tourDetailsText} key={departureDate}>
                  <h3>{format(new Date(departureDate), 'PPPP')}</h3>
                   <div onClick={() => setClickFunction(departureDate)}>
                    <CustomButton rect between around>
                      {setButtonLabelAndPeopleText(departureDate)?.buttonLabel}
                    </CustomButton>
                    <p className={styles.peopleRef} ref={el => { dateRefs.current[i] = el }}>
                      {setButtonLabelAndPeopleText(departureDate)?.peopleText} booked
                    </p>
                  </div>             
                </div>
              ))}
            </div>

          </div>

          <div className={styles.mainRight}>
            <h2>{tour.summary}</h2>
            <p>{tour.description}</p>
          </div>
        </div>

        <div className={styles.images}>
          {tour.images?.map((image) => (
            <div className={styles.tourImageContainer} key={image}>
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



// THIS WAS ALSO WORKING FOR ME, BUT IT WAS A BIT WONKY
  // const setButtonLabelAndPeopleText = (selectedDepartureDate: string, selectedIndex: number) => {
  //   if (!tour || !tour.startDates) return

  //   const finalTextObject = { buttonLabel: "Book Date", peopleText: "" }

  //   dateRefs.current.forEach((ref, i) => {
  //     const existingCartItem = cartItems.find(item => item.tour.id === tour.id && item.booking.departureDate === selectedDepartureDate)
  //     if (ref && existingCartItem && selectedIndex === i) {
  //       ref.style.display = 'block'
  //       finalTextObject.buttonLabel = "Add Person"
  //       const peoplePerson = existingCartItem.booking.people === 1 ? "person" : 'people'
  //       finalTextObject.peopleText = `${existingCartItem.booking.people} ${peoplePerson}`
  //     }
  //   })

  //   return finalTextObject

  // }
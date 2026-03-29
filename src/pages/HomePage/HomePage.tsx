import { Link } from 'react-router'
import { VscRocket } from 'react-icons/vsc'
import { GiStrikingArrows } from 'react-icons/gi'

import { useAuth } from '../../hooks/useAuth'
import { migrateReviewFields } from '../../services/firebase/reviewsService'

import zik from '../../assets/AlienHead.svg'

import styles from './HomePage.module.scss'
import { useEffect } from 'react'
const tourGuide = zik

const Home = () => {
  const { currentUser } = useAuth()

  useEffect(() => {
    // migrateReviewFields()
  }, [])

  return (
  <div className={styles.homeContainer}>

    <h1>Welcome to Galactic Tours!</h1>

    <div className={styles.bottomContainer}>

    <div className={styles.pitchContainer}>
      <VscRocket className={styles.icon} />
      <h2>Begin Your Interstellar Adventure Today! </h2>
      <div className={styles.text}>
      <div className={styles.imageContainer}>
        <img src={tourGuide} alt='' />
        <p>
        <span>Zik Kun - tour guide</span>
        </p>
      </div>
      <p>
        We have tours to fit any interest, and most any timeline.
        Whether you'd like to soak up the rays of the three suns of
        Qilikeur 2, or you'd prefer to test your survival skills in the
        icy mountains of Draug X'mut, we've got the perfect package! And
        best of all, it won't cost you a dollar. Well, actually, it{' '}
        <strong>
        <em>will</em>
        </strong>{' '}
        cost you a dollar.{' '}
        <strong>
        <em>Exactly</em>
        </strong>{' '}
        a dollar!
      </p>
      </div>
      <div className={styles.sub}>
      <h3>Click a Button for Details</h3>
      <GiStrikingArrows className={styles.arrows} />
      </div>
    </div>

    <div className={styles.buttonBank}>
      <Link to='/works' className={styles.button}>
      How Does It Work?
      </Link>
      <Link to='/tours' className={styles.button}>
      Browse All Tours
      </Link>
      <Link to={`/account/${currentUser?.id}`} className={styles.button}>
      Sign Up or Sign In!
      </Link>
    </div>

    </div>

     

  </div>
  )
}

export default Home

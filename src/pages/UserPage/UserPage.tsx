import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { IoSettingsOutline } from 'react-icons/io5'
import { IoRocketOutline } from 'react-icons/io5'
import { IoClipboardOutline } from 'react-icons/io5'
import { IoPlanetOutline } from 'react-icons/io5'
import { CgMathPlus } from 'react-icons/cg'
import { RiLockPasswordLine } from 'react-icons/ri'

import type { Tour } from '../../types/tour'

import { useAuth } from '../../hooks/useAuth'

import UserReviews from '../../components/User/UserReviews/UserReviews'
import UserTours from '../../components/User/UserTours/UserTours'
import UserSettings from '../../components/User/UserSettings/UserSettings'
import ManageTours from '../../components/User/Admin/ManageTours/ManageTours'
import CreateTour from '../../components/User/Admin/CreateTour/CreateTour'
import CreateReview from '../../components/User/UserReviews/CreateReview'
import EditTour from '../../components/User/Admin/EditTour/EditTour'
import UserPassword from '../../components/User/UserPassword/UserPassword'

import styles from './UserPage.module.scss'
import { Role } from '../../types/user'

const UserPage = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [showSection, setShowSection] = useState('userSettings')
  const [editTour, setEditTour] = useState<Tour | null>(null)
  const [reviewTour, setReviewTour] = useState<Tour | null>(null)

  useEffect(() => {
    if (!currentUser) navigate('/auth')
  }, [currentUser])

  return (
    <main className={styles.accountContainer} aria-labelledby="user-page-title">
      <nav className={styles.sideNav} aria-label="User account navigation">
        <div className={styles.sideNavItem} onClick={() => setShowSection('userSettings')}>
          <IoSettingsOutline /><p>User Settings</p>
        </div>
        <div className={styles.sideNavItem} onClick={() => setShowSection('userPassword')}>
          <RiLockPasswordLine /><p>Update Password</p>
        </div>
        <div className={styles.sideNavItem} onClick={() => setShowSection('userTours')}>
          <IoRocketOutline /><p>My Booked Tours</p>
        </div>
        <div className={styles.sideNavItem} onClick={() => setShowSection('userReviews')}>
          <IoClipboardOutline /><p>My Reviews</p>
        </div>
        {currentUser?.role === Role.Admin && (
          <>
            <h2>Administration:</h2>
            <div className={styles.sideNavItem} onClick={() => setShowSection('createTour')}>
              <CgMathPlus /><p>Create Tour</p>
            </div>
            <div className={styles.sideNavItem} onClick={() => setShowSection('manageTours')}>
              <IoPlanetOutline /><p>Manage Tours</p>
            </div>
          </>
        )}
      </nav>

      <section className={styles.accountSection} aria-labelledby="user-page-title">
        <h1 id="user-page-title" className={styles.srOnly}>{currentUser?.role === 'admin' ? "Admin" : "User"} Dashboard</h1>
        {showSection === 'userSettings' && <UserSettings />}
        {showSection === 'userPassword' && <UserPassword />}
        {showSection === 'userReviews' && <UserReviews />}
        {showSection === 'userTours' && <UserTours setShowSection={setShowSection} setReviewTour={setReviewTour} />}
        {showSection === 'createReview' && <CreateReview setShowSection={setShowSection} reviewTour={reviewTour} />}
        {showSection === 'manageTours' && <ManageTours setShowSection={setShowSection} setEditTour={setEditTour} />}
        {showSection === 'createTour' && <CreateTour setShowSection={setShowSection} />}
        {showSection === 'editTour' && <EditTour setShowSection={setShowSection} editTour={editTour!} />}
      </section>
    </main>
  )
}

export default UserPage
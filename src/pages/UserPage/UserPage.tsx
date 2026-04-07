import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { IoSettingsOutline, IoRocketOutline, IoClipboardOutline, IoPlanetOutline } from 'react-icons/io5'
import { CgMathPlus } from 'react-icons/cg'
import { RiLockPasswordLine } from 'react-icons/ri'

import type { Tour } from '../../types/tour'
import { Role } from '../../types/user'

import { useAuth } from '../../hooks/useAuth'

import UserReviews from '../../components/User/UserReviews/UserReviews'
import UserTours from '../../components/User/UserTours/UserTours'
import UserSettings from '../../components/User/UserSettings/UserSettings'
import ManageTours from '../../components/User/Admin/ManageTours/ManageTours'
import CreateTour from '../../components/User/Admin/CreateTour/CreateTour'
import CreateReview from '../../components/User/UserReviews/CreateReview'
import EditTour from '../../components/User/Admin/EditTour/EditTour'
import UserPassword from '../../components/User/UserPassword/UserPassword'
import CustomButton from '../../elements/CustomButton/CustomButton'

import styles from './UserPage.module.scss'
  
export enum UserComponent {
  UserSettings = 'userSettings',
  UserPassword = 'userPassword',
  UserTours = 'userTours',
  UserReviews = 'userReviews',
  CreateReview = 'createReview',
  ManageTours = 'manageTours',
  CreateTour = 'createTour',
  EditTour = 'editTour'
}

const UserPage = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [showSection, setShowSection] = useState<UserComponent>(UserComponent.UserSettings)
  const [editTour, setEditTour] = useState<Tour | null>(null)
  const [reviewTour, setReviewTour] = useState<Tour | null>(null)

  useEffect(() => {
    if (!currentUser) navigate('/auth')
  }, [currentUser, navigate])

  return (
    <main className={styles.accountContainer} aria-labelledby="user-page-title">
      <nav className={styles.sideNav} aria-label="User account navigation">
        <CustomButton width={'180px'} onClick={() => setShowSection(UserComponent.UserSettings)} aria-label="User Settings" aria-pressed={showSection === UserComponent.UserSettings}>
          <IoSettingsOutline />
          <span>User Settings</span>
        </CustomButton>
        <CustomButton width={'180px'} onClick={() => setShowSection(UserComponent.UserPassword)} aria-label="Update Password" aria-pressed={showSection === UserComponent.UserPassword}>
          <RiLockPasswordLine />
          <span>Update Password</span>
        </CustomButton>
        <CustomButton width={'180px'} onClick={() => setShowSection(UserComponent.UserTours)} aria-label="My Booked Tours" aria-pressed={showSection === UserComponent.UserTours}>
          <IoRocketOutline />
          <span>My Booked Tours</span>
        </CustomButton>
        <CustomButton width={'180px'} onClick={() => setShowSection(UserComponent.UserReviews)} aria-label="My Reviews" aria-pressed={showSection === UserComponent.UserReviews}>
          <IoClipboardOutline />
          <span>My Reviews</span>
        </CustomButton>
        {currentUser?.role === Role.Admin && (
          <>
            <h2>Administration:</h2>
            <CustomButton width={'180px'} onClick={() => setShowSection(UserComponent.CreateTour)} aria-label="Create Tour" aria-pressed={showSection === UserComponent.CreateTour}>
              <CgMathPlus />
              <span>Create Tour</span>
            </CustomButton>
            <CustomButton width={'180px'} onClick={() => setShowSection(UserComponent.ManageTours)} aria-label="Manage Tours" aria-pressed={showSection === UserComponent.ManageTours}>
              <IoPlanetOutline />
              <span>Manage Tours</span>
            </CustomButton>
          </>
        )}
      </nav>

      <section className={styles.accountSection}>
        <h1 id="user-page-title" className={styles.srOnly}>{currentUser?.role === Role.Admin ? "Admin" : "User"} Dashboard</h1>
        {showSection === UserComponent.UserSettings && <UserSettings />}
        {showSection === UserComponent.UserPassword && <UserPassword />}
        {showSection === UserComponent.UserReviews && <UserReviews />}
        {showSection === UserComponent.UserTours && <UserTours setShowSection={setShowSection} setReviewTour={setReviewTour} />}
        {showSection === UserComponent.CreateReview && reviewTour && <CreateReview setShowSection={setShowSection} reviewTour={reviewTour} />}
        {showSection === UserComponent.ManageTours && <ManageTours setShowSection={setShowSection} setEditTour={setEditTour} />}
        {showSection === UserComponent.CreateTour && <CreateTour setShowSection={setShowSection} />}
        {showSection === UserComponent.EditTour && editTour && <EditTour setShowSection={setShowSection} editTour={editTour} />}
      </section>
    </main>
  )
}

export default UserPage
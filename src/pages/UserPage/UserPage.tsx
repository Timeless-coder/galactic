import { useState } from 'react'
import { IoSettingsOutline } from 'react-icons/io5'
import { IoRocketOutline } from 'react-icons/io5'
import { IoClipboardOutline } from 'react-icons/io5'
import { IoPlanetOutline } from 'react-icons/io5'
import { CgMathPlus } from 'react-icons/cg'
import { RiLockPasswordLine } from 'react-icons/ri'

import { useAuth } from '../../hooks/useAuth'

import UserReviews from '../../components/User/UserReviews/UserReviews'
import UserTours from '../../components/User/UserTours/UserTours'
import UserSettings from '../../components/User/UserSettings/UserSettings'
import ManageTours from '../../components/User/Admin/ManageTours/ManageTours'
// import CreateTour from '../../components/User/Admin/CreateTour/CreateTour'
// import EditTour from '../../components/User/Admin/EditTour/EditTour'
// import UserPassword from '../../components/User/UserPassword/UserPassword'

import styles from './UserPage.module.scss'

const UserPage = () => {
  const { currentUser } = useAuth()
  const [showSection, setShowSection] = useState('manageTours')
  const [editTour, setEditTour] = useState('')
  return (
    <div className={styles.accountContainer}>

      <section className={styles.sideNav}>
        <div className={styles.sideNavItem} onClick={() => setShowSection('settings')}>
          <IoSettingsOutline /><p>User Settings</p>
        </div>
        <div className={styles.sideNavItem} onClick={() => setShowSection('password')}>
          <RiLockPasswordLine /><p>Update Password</p>
        </div>
        <div className={styles.sideNavItem} onClick={() => setShowSection('userTours')}>
          <IoRocketOutline /><p>My Booked Tours</p>
        </div>
        <div className={styles.sideNavItem} onClick={() => setShowSection('reviews')}>
          <IoClipboardOutline /><p>My Reviews</p>
        </div>
      {currentUser?.role === 'admin' && (
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
      </section>

      <section className={styles.accountSection}>
        {showSection === 'settings' && <UserSettings />}
        {showSection === 'userTours' && <UserTours />}
        {showSection === 'reviews' && <UserReviews />}
        {showSection === 'manageTours' && <ManageTours setShowSection={setShowSection} setEditTour={setEditTour} />}
        {/* {showSection === 'password' && <UserPassword />} */}
        {/* {showSection === 'createTour' && <CreateTour setShowSection={setShowSection} />} */}
        {/* {showSection === 'editTour' && <EditTour setShowSection={setShowSection} editTour={editTour} />} */}
      </section>

    </div>
  )
}

export default UserPage
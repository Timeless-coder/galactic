import toast from "react-hot-toast"
import { Link, useNavigate } from 'react-router'

import { useAuth } from '../../../hooks/useAuth'

import { Role } from '../../../types/user'

import styles from '../Header.module.scss'

type HeaderUserDropdownProps = {
	setUserMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const HeaderUserDropdown = ({ setUserMenuOpen }: HeaderUserDropdownProps) => {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  
  const signOut = async() => {
    
    try {
      const displayNameOfUserLoggingOut = currentUser?.displayName ?? "Traveler"
      setUserMenuOpen(false)
      await logout()

      toast.success(`Thanks for visiting, ${displayNameOfUserLoggingOut}`)
      navigate('/auth')
    }
    catch (err: any) {
      console.error('Logout error:', err)
      toast.error(`${err.message ?? err} - Please try again`)
    }
  }

  return (
    <nav id="header-user-dropdown" className={styles.userDropdown} aria-label="User menu">

      {currentUser && (
        <Link to={`/account/${currentUser.id}`} onClick={() => setUserMenuOpen(false)}>
          {currentUser.role === Role.Admin ? 'Admin' : 'Account'}
        </Link>
      )}

      <button onClick={signOut} aria-label="Sign out">
        Sign Out
      </button>
    </nav>
  )
}

export default HeaderUserDropdown
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
      const name = currentUser?.displayName
      await logout()
      navigate('/auth')
      toast.success(`Thanks for visiting, ${name}`)
    }
    catch (err: any) {
      console.error('Logout error:', err)
      toast.error(`${err.message} - Please try again`)
    }
  }

  return (
    <nav className={styles.userDropdown} aria-label="User menu">
      {currentUser && (
        <Link to={`/account/${currentUser.id}`} onClick={() => setUserMenuOpen(false)}>
          {currentUser.role === Role.Admin ? 'Admin' : 'Account'}
        </Link>
      )}
      <button
        type="button"
        onClick={() => { signOut(); setUserMenuOpen(false); }}
        aria-label="Sign out"
        className={styles.signOutButton}
      >
        Sign Out
      </button>
    </nav>
  )
}

export default HeaderUserDropdown
import { useState } from 'react'
import toast from "react-hot-toast"
import { Link, useNavigate } from 'react-router'

import { useAuth } from '../../../hooks/useAuth'

import { Role } from '../../../types/user'

import styles from '../Header.module.scss'
import Spinner from '../../../elements/Spinner/Spinner'

type HeaderUserDropdownProps = {
	setUserMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const HeaderUserDropdown = ({ setUserMenuOpen }: HeaderUserDropdownProps) => {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
	const [loading, setLoading] = useState(false)
  
  const signOut = async() => {
    setLoading(true)
    
    try {
      await logout()
      navigate('/auth')
    }
    catch (err) {
      console.error('Logout error:', err)
      toast.error('Logout failed. Please try again')  
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.userDropdown}>

			{loading && <Spinner />}
			{currentUser &&
				<Link to={`/account/${currentUser.id}`} onClick={() => setUserMenuOpen(false)}>
					{currentUser.role === Role.Admin ? 'Admin' : 'Account'}
				</Link>
			}

			<div onClick={() => { signOut(); setUserMenuOpen(false); }}><p>Sign Out</p></div>                                        
		</div>
  )
}

export default HeaderUserDropdown
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { AiOutlineGooglePlus } from 'react-icons/ai'

import { useAuth } from '../../hooks/useAuth'

import LoginForm from '../../components/Auth/LoginForm'
import SignupForm from '../../components/Auth/SignupForm'
import CustomButton from '../../elements/CustomButton/CustomButton'

import styles from './AuthPage.module.scss'
import buttonStyles from '../../elements/CustomButton/CustomButton.module.scss'
import formStyles from '../../elements/Form.module.scss'

const AuthPage = () => {
  const location = useLocation()
  const { signInWithGoogle, currentUser, logout } = useAuth()
  const [hasAccount, setHasAccount] = useState(false)

  useEffect(() => {
    let mounted = true
    if (mounted) setHasAccount(Boolean(currentUser))
    return () => {
      mounted = false
    }
  }, [location])
  
  return (
    <div className={styles.authContainer}>
      <div className={formStyles.formContainer}>

      <div onClick={signInWithGoogle} className={formStyles.google}>
        <CustomButton around between rect>
          <AiOutlineGooglePlus className={buttonStyles.icon} />
          Sign in With Google
        </CustomButton>
      </div>

      {/* <div onClick={handleLostPassword} className={formStyles.password}>
        <CustomButton rect>Lost My Password</CustomButton>
      </div> */}

      {hasAccount
          ? <LoginForm setHasAccount={setHasAccount} />
          : <SignupForm  setHasAccount={setHasAccount} />
      }

      </div>

      <button onClick={logout}>Log out</button> 
    </div>
  )

}

export default AuthPage;

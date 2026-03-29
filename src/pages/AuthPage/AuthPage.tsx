import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { AiOutlineGooglePlus } from 'react-icons/ai'

import { useAuth } from '../../hooks/useAuth'

import LoginForm from '../../components/Auth/LoginForm'
import SignupForm from '../../components/Auth/SignupForm'
import EmailResetPassword from '../../components/Auth/EmailResetPassword'
import CustomButton from '../../elements/CustomButton/CustomButton'

import styles from './AuthPage.module.scss'
import buttonStyles from '../../elements/CustomButton/CustomButton.module.scss'
import formStyles from '../../elements/Form.module.scss'

const AuthPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { signinWithGoogle, currentUser, logout } = useAuth()
  const [lostPassword, setLostPassword] = useState(false)
  const [hasAccount, setHasAccount] = useState(false)

  const handleLostPassword = () => {
    setHasAccount(false)
    setLostPassword(true)
  }

  const signinWithGoogleAndGreet = async() => {
    try {
      const user = await signinWithGoogle()
			toast.success(`Welcome to Galactic Tours, ${user.displayName}!`)
      navigate('/')
    }
    catch(err: any) {
      console.error(err)
      toast.error(`Unable to sign in with Google: ${err.message}`)
    }
  }

  useEffect(() => {
    let mounted = true

    if (mounted) setHasAccount(Boolean(currentUser))

    return () => {
      mounted = false
    }
  }, [location])

  useEffect(() => {
    if (currentUser) {
      navigate('/')
    }
  }, [currentUser])
  
  return (
    <div className={styles.authContainer}>
      <div className={formStyles.formContainer}>

      <div onClick={signinWithGoogleAndGreet} className={formStyles.google}>
        <CustomButton>
          <AiOutlineGooglePlus className={buttonStyles.icon} />
          Sign in With Google
        </CustomButton>
      </div>

      {!lostPassword && <div onClick={handleLostPassword} className={formStyles.password}>
        <CustomButton>Lost My Password</CustomButton>
      </div>}

      {lostPassword
        ? <EmailResetPassword setHasAccount={setHasAccount} setLostPassword={setLostPassword} />
        : hasAccount
          ? <LoginForm  setHasAccount={setHasAccount} />
          : <SignupForm setHasAccount={setHasAccount} />
      }

      </div>
    </div>
  )

}

export default AuthPage;

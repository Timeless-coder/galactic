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
  const { signinWithGoogle, currentUser } = useAuth()
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
      console.error(err.message)
      toast.error(`Unable to sign in with Google: ${err.message ?? err}`)
    }
  }

  useEffect(() => {
    setHasAccount(Boolean(currentUser))
  }, [location, currentUser])

  useEffect(() => {
    if (currentUser) {
      navigate('/')
    }
  }, [currentUser, navigate])
  
  return (
    <div className={styles.authContainer}>
      <div className={formStyles.formContainer}>

      <div className={formStyles.google}>
        <CustomButton onClick={signinWithGoogleAndGreet}>
          <AiOutlineGooglePlus className={buttonStyles.icon} />
          Sign in With Google
        </CustomButton>
      </div>

      {!lostPassword &&
        <div className={formStyles.password}>
          <CustomButton onClick={handleLostPassword} layout='center'>Lost My Password</CustomButton>
        </div>
      }

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

import { useState } from "react"
import { useNavigate } from 'react-router'
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

import { useAuth } from '../../hooks/useAuth'

import CustomButton from "../../elements/CustomButton/CustomButton"
import Spinner from '../../elements/Spinner/Spinner'

import styles from '../../elements/Form.module.scss'

type LoginFormProps = {
  setHasAccount: (status: boolean) => void
}

type LoginFormData = {
  email: string
  password: string
}

const LoginForm = ({ setHasAccount }: LoginFormProps) => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LoginFormData>()
  const [loading, setLoading] = useState(false)

  const formSubmit = async (data: LoginFormData) => {
    setLoading(true)

    try {
      const user = await login(data.email, data.password)
      const firstName = user.name.split(' ')[0]
      toast.success(`Welcome back, ${firstName}!`)
      reset()
      navigate('/')
    }
    catch (error) {
      const code = (error as { code?: string }).code
      if (code === 'auth/invalid-credential') toast.error('Invalid email or password')
      else toast.error('Login failed')
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h2>LOGIN</h2>

      <div className={styles.status}>
        <p>No Account Yet?</p>
        <div onClick={() => setHasAccount(false)}>
          <CustomButton rect around between>Sign Up</CustomButton>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(formSubmit)} className="your-glassy-styles">
        <div className={styles.inputContainer}>
          <label htmlFor="login-email">Email</label>
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}
          <input
            {...register('email', {
              required: 'Email is required'
            })}
            id="login-email"
            type="email"
            placeholder="Email"
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="login-password">Password</label>
          {errors.password && <p className={styles.error}>{errors.password.message}</p>}
          <input
            {...register('password', {
              required: 'Password is required'
            })}
            id="login-password"
            type="password"
            placeholder="Password"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? <Spinner /> : "Login"}
        </button>
      </form>
    </>
  )
}

export default LoginForm
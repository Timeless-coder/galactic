import { useState } from "react"
import { useNavigate } from 'react-router'
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

import { useAuth } from '../../hooks/useAuth'

import CustomButton from "../../elements/CustomButton/CustomButton"

import styles from '../../elements/Form.module.scss'

type LoginFormProps = {
  setHasAccount: React.Dispatch<React.SetStateAction<boolean>>
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
      toast.success(`Welcome back, ${user.displayName}!`)

      reset()
      navigate('/')
    }
    catch (err: any) {
      console.error(err.message)
      if (err.code === 'auth/invalid-credential') toast.error('Invalid email or password')
      else toast.error(`Login failed: ${err.message ?? err} - Please contact customer service.`)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <header>
        <h2>LOGIN</h2>
      </header>

      <aside className={styles.status}>
        <p>No Account Yet?</p>
        <CustomButton onClick={() => setHasAccount(false)} layout="center">Sign Up</CustomButton>
      </aside>

      <form onSubmit={handleSubmit(formSubmit)} aria-label="Login form">
        <div className={styles.inputContainer}>
          <label htmlFor="login-email">Email</label>
          {errors.email && <p id="login-email-error" className={styles.error} role="alert">{errors.email.message}</p>}
          <input
            {...register('email', {
              required: 'Email is required'
            })}
            id="login-email"
            type="email"
            placeholder="Email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="login-password">Password</label>
          {errors.password && <p id="login-password-error" className={styles.error} role="alert">{errors.password.message}</p>}
          <input
            {...register('password', {
              required: 'Password is required'
            })}
            id="login-password"
            type="password"
            placeholder="Password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
          />
        </div>

        <div className={styles.inputContainer}>
          <CustomButton type="submit" name="submit" disabled={loading} layout="center" width="100%" aria-busy={loading}>
            Submit
          </CustomButton>
        </div>
      </form>
    </section>
  )
}

export default LoginForm
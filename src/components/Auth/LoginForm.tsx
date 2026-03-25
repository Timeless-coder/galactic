import { useState } from "react"
import type { SubmitEvent } from "react"
import toast from "react-hot-toast"

import { useAuth } from '../../hooks/useAuth'

import CustomButton from "../../elements/CustomButton/CustomButton"

import styles from '../../elements/Form.module.scss'
import '../../index.scss'

type LoginFormProps = {
  setHasAccount: (status: boolean) => void
}

const LoginForm = ({ setHasAccount }: LoginFormProps) => {
  const { login, signInWithGoogle, currentUser } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(email, password)
      toast.success(`Welcome back, ${user.name}!`)
    } catch (error: any) {
      toast.error(error.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const user = await signInWithGoogle()
      toast.success(`Welcome, ${user.name}!`)
    } catch (error: any) {
      toast.error(error.message || "Google login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h2>{currentUser ? 'SIGN IN AS DIFFERENT USER' : 'SIGN IN'}</h2>

      <div className={styles.status}>
        <p>No Account Yet?</p>
        <div onClick={() => setHasAccount(false)}>
          <CustomButton rect around between>Sign Up</CustomButton>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="your-glassy-styles">
        <div className={styles.inputContainer}>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </>
  )
}

export default LoginForm
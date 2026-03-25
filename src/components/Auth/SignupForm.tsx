import { useState } from "react"
import toast from "react-hot-toast"

import type { SubmitEvent } from "react"

import { useAuth } from '../../hooks/useAuth'

import CustomButton from "../../elements/CustomButton/CustomButton"

import styles from '../../elements/Form.module.scss'
import '../../index.scss'

type SignupFormProps = {
	setHasAccount: (status: boolean) => void
}

const SignupForm = ({ setHasAccount }: SignupFormProps) => {
	const { signUpWithEmailAndPassword, signInWithGoogle } = useAuth()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault()
		setLoading(true)
		try {
			const user = await signUpWithEmailAndPassword(email, password)
			toast.success(`Welcome back, ${user.name}!`)
		} catch (error: any) {
			toast.error(error.message || "SignUp failed")
		} finally {
			setLoading(false)
		}
	}

	const handleGoogleSignUp = async () => {
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
			<h2>SIGN UP</h2>

			<div className={styles.status}>
				<p>Have an Account?</p>
				<div onClick={() => setHasAccount(true)}>
					<CustomButton around between rect>Sign In</CustomButton>
				</div>
			</div>
			
			<form onSubmit={handleSubmit} className="your-glassy-styles">
				<div className={styles.inputContainer}>
					<label htmlFor="signup-email">Email</label>
					<input
						id="signup-email"
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className={styles.inputContainer}>
					<label htmlFor="signup-password">Password</label>
					<input
						id="signup-password"
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<button type="submit" disabled={loading}>
					{loading ? "Logging in..." : "SignUp"}
				</button>
			</form>
		</>
	)
}

export default SignupForm
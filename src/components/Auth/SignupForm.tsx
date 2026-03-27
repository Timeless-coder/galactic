import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

import { useAuth } from '../../hooks/useAuth'

import CustomButton from "../../elements/CustomButton/CustomButton"

import styles from '../../elements/Form.module.scss'

type SignupFormProps = {
	setHasAccount: (status: boolean) => void
}

type SignupFormData = {
	email: string
	password: string
	passwordConfirm: string
}

const SignupForm = ({ setHasAccount }: SignupFormProps) => {
	const { signUpWithEmailAndPassword } = useAuth()
	const { register, handleSubmit, formState: { errors }, watch } = useForm<SignupFormData>()
	const [loading, setLoading] = useState(false)

	const formSubmit = async (data: SignupFormData) => {
		if (data.password !== data.passwordConfirm) {
			toast.error("Please make sure Password and Confirm Password match.")
			return
		}
		
		setLoading(true)

		try {
			const user = await signUpWithEmailAndPassword(data.email, data.password)
			const firstName = user.name.split(' ')[0]
			toast.success(`Welcome to Galactic Tours, ${firstName}!`)
		}
		catch (error) {
			const code = (error as { code?: string }).code
			if (code === 'auth/email-already-in-use') toast.error('Email is already in use')
			else if (code === 'auth/weak-password') toast.error('Password should be at least 6 characters')
			else if (code === 'auth/invalid-email') toast.error('Please include a valid email address')
			else toast.error('Sign Up failed')
		}
		finally {
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
			
			<form onSubmit={handleSubmit(formSubmit)} className="your-glassy-styles">
				<div className={styles.inputContainer}>
					<label htmlFor="signup-email">Email</label>
					{errors.email && <p className={styles.error}>{errors.email.message}</p>}
					<input
						{...register('email', {
							required: 'Email is required'
						})}
						id="signup-email"
						type="email"
						placeholder="Email"
					/>
				</div>
				<div className={styles.inputContainer}>
					<label htmlFor="signup-password">Password</label>
					{errors.password && <p className={styles.error}>{errors.password.message}</p>}
					<input
						{...register('password', {
							required: 'Password is required',
							minLength: {
								value: 6,
								message: 'Password should be at least 6 characters'
							}
						})}
						id="signup-password"
						type="password"
						placeholder="Password"
					/>
				</div>
				<div className={styles.inputContainer}>
					<label htmlFor="signup-password-confirm">Confirm Password</label>
					{errors.passwordConfirm && <p className={styles.error}>{errors.passwordConfirm.message}</p>}
					<input
						{...register('passwordConfirm', {
							required: 'Please confirm your password',
							validate: value => value === watch('password') || 'Passwords do not match'
						})}
						id="signup-password-confirm"
						type="password"
						placeholder="Confirm Password"
					/>
				</div>
				<button type="submit" disabled={loading}>
					{loading ? "Signing up..." : "Sign Up"}
				</button>
			</form>
		</>
	)
}

export default SignupForm
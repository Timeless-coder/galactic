import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router'
import toast from "react-hot-toast"
import { MdAddAPhoto } from 'react-icons/md'
import { AiOutlineCheck } from 'react-icons/ai'

import { useAuth } from '../../hooks/useAuth'
import { uploadProfileImage } from '../../services/firebase/storageService'

import CustomButton from "../../elements/CustomButton/CustomButton"

import styles from '../../elements/Form.module.scss'

type SignupFormProps = {
	setHasAccount: (status: boolean) => void
}

type SignupFormData = {
	name: string
	email: string
	password: string
	passwordConfirm: string
	profileImage: FileList
}

const SignupForm = ({ setHasAccount }: SignupFormProps) => {
	const navigate = useNavigate()
	const { signupWithEmailAndPassword } = useAuth()
	const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<SignupFormData>()
	const [loading, setLoading] = useState(false)

	const watchProfileImage = watch('profileImage')

	const formSubmit = async (data: SignupFormData) => {
		if (data.password !== data.passwordConfirm) {
			toast.error("Please make sure Password and Confirm Password match.")
			return
		}
		
		setLoading(true)

		try {
			const photoURL = await uploadProfileImage(data.profileImage[0], `profileImages/${data.email}-profileImage`)
			const user = await signupWithEmailAndPassword(data.name, data.email, data.password, photoURL)
			const firstName = user.name.split(' ')[0]
			toast.success(`Welcome to Galactic Tours, ${firstName}!`)
			reset()
			navigate('/')

		}
		catch (error) {
			const code = (error as { code?: string }).code
			if (code === 'auth/email-already-in-use') toast.error('Email is already in use')
			else if (code === 'auth/weak-password') toast.error('Password should be at least 8 characters')
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
					<label htmlFor='name'>Name</label>
					{errors.name && <p className={styles.error}>{errors.name.message}</p>}
					<input
						{...register('name', {
							required: 'Your name is required',
							maxLength: {
								value: 50,
								message: 'Your name can be a maximum of 50 characters'
							}
						})}
						id='name'
						type='text'
						placeholder='Your name'
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

				<div className={styles.inputContainer}>
					<div className={styles.labelContainer}>
						<label className={styles.label} htmlFor='profileImage'>
							{watchProfileImage?.[0]
								? <AiOutlineCheck className={styles.icon} />
								: <MdAddAPhoto className={styles.icon} />
							}
							Profile Image
						</label>
					</div>
					{errors.profileImage && <p className={styles.error}>{errors.profileImage.message as string}</p>}
					<input
						{...register('profileImage', {
							
						})}
						id='profileImage'
						type='file'
						accept='image/jpeg'
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
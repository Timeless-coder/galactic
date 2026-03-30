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
  setHasAccount: React.Dispatch<React.SetStateAction<boolean>>
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
			const photoURL = await uploadProfileImage(data.profileImage[0], `${data.email}-profileImage`)
			const firebaseUser = await signupWithEmailAndPassword(data.name, data.email, data.password, photoURL)
			toast.success(`Welcome to Galactic Tours, ${firebaseUser.displayName}!`)
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
		<section>
			<header>
				<h2>SIGN UP</h2>
			</header>

			<aside className={styles.status}>
				<p>Have an Account?</p>
				<button type="button" onClick={() => setHasAccount(true)}>
					<CustomButton>Sign In</CustomButton>
				</button>
			</aside>
      
			<form onSubmit={handleSubmit(formSubmit)} aria-label="Signup form" className="your-glassy-styles">

				{/* Email */}
				<div className={styles.inputContainer}>
					<label htmlFor="signup-email">Email</label>
					{errors.email && <p className={styles.error} role="alert">{errors.email.message}</p>}
					<input
						{...register('email', {
							required: 'Email is required'
						})}
						id="signup-email"
						type="email"
						placeholder="Email"
						aria-invalid={!!errors.email}
						aria-describedby={errors.email ? 'signup-email-error' : undefined}
					/>
				</div>

				{/* Name */}
				<div className={styles.inputContainer}>
					<label htmlFor='name'>Name</label>
					{errors.name && <p className={styles.error} role="alert">{errors.name.message}</p>}
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
						aria-invalid={!!errors.name}
						aria-describedby={errors.name ? 'signup-name-error' : undefined}
					/>
				</div>
        
				{/* Password */}
				<div className={styles.inputContainer}>
					<label htmlFor="signup-password">Password</label>
					{errors.password && <p className={styles.error} role="alert">{errors.password.message}</p>}
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
						aria-invalid={!!errors.password}
						aria-describedby={errors.password ? 'signup-password-error' : undefined}
					/>
				</div>

				{/* Confirm Password */}
				<div className={styles.inputContainer}>
					<label htmlFor="signup-password-confirm">Confirm Password</label>
					{errors.passwordConfirm && <p className={styles.error} role="alert">{errors.passwordConfirm.message}</p>}
					<input
						{...register('passwordConfirm', {
							required: 'Please confirm your password',
							validate: value => value === watch('password') || 'Passwords do not match'
						})}
						id="signup-password-confirm"
						type="password"
						placeholder="Confirm Password"
						aria-invalid={!!errors.passwordConfirm}
						aria-describedby={errors.passwordConfirm ? 'signup-password-confirm-error' : undefined}
					/>
				</div>

				{/* Profile Image */}
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
					{errors.profileImage && <p className={styles.error} role="alert">{errors.profileImage.message as string}</p>}
					<input
						{...register('profileImage', {
							required: 'Profile image is required'
						})}
						id='profileImage'
						type='file'
						accept='image/jpeg'
						aria-invalid={!!errors.profileImage}
						aria-describedby={errors.profileImage ? 'signup-profileImage-error' : undefined}
					/>
				</div>

				<div className={styles.inputContainer}>
					<button
						type='submit'
						name='submit'
						disabled={loading}
						aria-busy={loading}
					>
						Submit
					</button>
				</div>
			</form>
		</section>
	)
}

export default SignupForm
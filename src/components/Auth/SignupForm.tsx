import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router'
import toast from "react-hot-toast"
import { MdAddAPhoto } from 'react-icons/md'
import { AiOutlineCheck } from 'react-icons/ai'

import { useAuth } from '../../hooks/useAuth'
import { uploadProfileImage, deleteProfileImageIfNeeded } from '../../services/firebase/storageService'

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
	const { register, handleSubmit, formState: { errors }, watch, reset, trigger } = useForm<SignupFormData>()
	const [loading, setLoading] = useState(false)

	const watchProfileImage = watch('profileImage')

	const formSubmit = async (data: SignupFormData) => {		
		setLoading(true)
		
		const profileImageFileName = `${data.email}-profileImage`

		try {
			const photoURL = await uploadProfileImage(data.profileImage[0], profileImageFileName)
			const firebaseUser = await signupWithEmailAndPassword(data.name, data.email, data.password, photoURL)
			toast.success(`Welcome to Galactic Tours, ${firebaseUser.displayName}!`)
			
			reset()
			navigate('/')
		}
		catch (err: any) {
			await deleteProfileImageIfNeeded(profileImageFileName) // any errors deleting are ignored within storageService.

			console.error(err.message)
			if (err.code === 'auth/email-already-in-use') toast.error('Email is already in use')
			else if (err.code === 'auth/weak-password') toast.error('Password should be at least 6 characters')
			else if (err.code === 'auth/invalid-email') toast.error('Please include a valid email address')

			else toast.error(`Sign Up failed - ${err.message ?? err}`)
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
				<CustomButton onClick={() => setHasAccount(true)} layout="center">Sign In</CustomButton>
			</aside>
      
			<form onSubmit={handleSubmit(formSubmit)} aria-label="Signup form">

				{/* Email */}
				<div className={styles.inputContainer}>
					<label htmlFor="signup-email">Email</label>
					{errors.email && <p id="signup-email-error" className={styles.error} role="alert">{errors.email.message}</p>}
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
					<label htmlFor='signup-name'>Name</label>
					{errors.name && <p id="signup-name-error" className={styles.error} role="alert">{errors.name.message}</p>}
					<input
						{...register('name', {
							required: 'Your name is required',
							maxLength: {
								value: 50,
								message: 'Your name can be a maximum of 50 characters'
							}
						})}
						id='signup-name'
						type='text'
						placeholder='Your name'
						aria-invalid={!!errors.name}
						aria-describedby={errors.name ? 'signup-name-error' : undefined}
					/>
				</div>
        
				{/* Password */}
				<div className={styles.inputContainer}>
					<label htmlFor="signup-password">Password</label>
					{errors.password && <p id="signup-password-error" className={styles.error} role="alert">{errors.password.message}</p>}
					<input
						{...register('password', {
							required: 'Password is required',
							minLength: { value: 6, message: 'Password should be at least 6 characters' },
							onChange: () => trigger('passwordConfirm') // trigger the passwordConfirm 'validate' rule.
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
					{errors.passwordConfirm && <p id="signup-password-confirm-error" className={styles.error} role="alert">{errors.passwordConfirm.message}</p>}
					<input
						{...register('passwordConfirm', {
							required: 'Please confirm your password',
							validate: value => value === watch('password') || 'Passwords do not match' // sets rule that 'trigger' checks, plus the response.
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
						<label className={styles.label} htmlFor='signup-profileImage'>
							{watchProfileImage?.[0]
								? <AiOutlineCheck className={styles.icon} />
								: <MdAddAPhoto className={styles.icon} />
							}
							Profile Image
						</label>
					</div>
					{errors.profileImage && <p id="signup-profileImage-error" className={styles.error} role="alert">{errors.profileImage.message as string}</p>}
					<input
						{...register('profileImage', {
							required: 'Profile image is required'
						})}
						id='signup-profileImage'
						type='file'
						accept='image/jpeg,image/jpg,image/png'
						aria-invalid={!!errors.profileImage}
						aria-describedby={errors.profileImage ? 'signup-profileImage-error' : undefined}
					/>
				</div>

				<div className={styles.inputContainer}>
					<CustomButton
						type='submit'
						name='submit'
						disabled={loading}
						aria-busy={loading}
						width="100%"
						layout="center"
					>
						Submit
					</CustomButton>
				</div>
			</form>
		</section>
	)
}

export default SignupForm
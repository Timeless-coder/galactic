import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import type { Tour } from '../../../types/tour'
import { UserComponent } from '../../../pages/UserPage/UserPage'

import { createReviewService } from '../../../services/firebase/reviewsService'
import { useAuth } from '../../../hooks/useAuth'
import { useFirestoreMutateService } from '../../../hooks/useFirestoreMutateService'

import Spinner from '../../../elements/Spinner/Spinner'

import styles from '../../../elements/Form.module.scss'
import type { Review } from '../../../types/review'

type CreateReviewProps = {
	reviewTour: Tour | null
  setShowSection: React.Dispatch<React.SetStateAction<UserComponent>>
}

type CreateReviewFormData = {
	rating: number
	text: string
}

const CreateReview = ({ reviewTour, setShowSection }: CreateReviewProps) => {
	const { currentUser } = useAuth()
	const [formLoading, setFormLoading] = useState(false)
	const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateReviewFormData>()

	const { loading: firestoreHookLoading, mutate: createReview, error } =
		useFirestoreMutateService((reviewObject: Omit<Review, 'id' | 'createdAt'>) => createReviewService(reviewObject))

	const formSubmit = async (data: CreateReviewFormData) => {
		if (!reviewTour || !currentUser) return
			
		try {
			setFormLoading(true)

			const reviewObject: Omit<Review, 'id' | 'createdAt'> = {
				rating: data.rating,
				text: data.text,
				tourId: reviewTour.id,
				userId: currentUser.id
			}

			await createReview(reviewObject)

			toast.success('Review created successfully')

			reset()
			setShowSection(UserComponent.UserReviews)
		}
		catch (err: any) {
			console.error(err.message)
			toast.error(`Error creating review: ${error?.message ?? err.message}`)
		}
		finally {
			setFormLoading(false)
		}
	}

	return (
		<section>
			{(formLoading || firestoreHookLoading) && <Spinner />}
			<div>
				<div className={styles.formContainer}>
					<header>
						<h2>Review this Tour</h2>
					</header>
					<form onSubmit={handleSubmit(formSubmit)} aria-label="Create review form">

						{/**Rating */}
						<div className={styles.inputContainer}>
							<label htmlFor='rating'>Rating</label>
							{errors.rating && <p className={styles.error}>{errors.rating.message}</p>}
							<input
								{...register('rating', {
									required: 'Rating is required',
									min: {
										value: 0,
										message: 'Please select a rating between 0 and 100'
									},
									max: {
										value: 100,
										message: 'Please select a rating between 0 and 100'
									},
									valueAsNumber: true
								})}
								id='rating'
								type='number'
							/>
						</div>

						{/**Text */}
						<div className={styles.inputContainer}>
							<label htmlFor='text'>Review</label>
							{errors.text && <p className={styles.error}>{errors.text.message}</p>}
							<input
								{...register('text', {
									required: 'Review is required'
								})}
								id='text'
								type='text'
								placeholder='Create a full review'
							/>
						</div>
						<div className={styles.inputContainer}>
							<input
								type='submit'
								name='submit'
								value='Create Review'
								disabled={formLoading || firestoreHookLoading}
							/>
						</div>
					</form>
				</div>
			</div>
		</section>
	)
}

export default CreateReview

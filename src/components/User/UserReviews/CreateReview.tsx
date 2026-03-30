import { useState } from 'react'
import { useForm } from 'react-hook-form'

import type { Tour } from '../../../types/tour'

import { createReviewService } from '../../../services/firebase/reviewsService'
import { useAuth } from '../../../hooks/useAuth'
import { useFirestoreMutateService } from '../../../hooks/useFirestoreMutateService'

import Spinner from '../../../elements/Spinner/Spinner'

import styles from '../../../elements/Form.module.scss'
import type { Review } from '../../../types/review'

type CreateReviewProps = {
	reviewTour: Tour | null
  setShowSection: React.Dispatch<React.SetStateAction<string>>
}

type CreateReviewFormData = {
	rating: number
	text: string
	tourId: string
	userId: string
}

const firestoreServiceOptions = {
	successMessage: 'Review created successfully!'
}

const CreateReview = ({ reviewTour, setShowSection }: CreateReviewProps) => {
	const { currentUser } = useAuth()
	const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateReviewFormData>()
	const [loading, setLoading] = useState(false)

	const { loading: creating, mutate: createReview } =
		useFirestoreMutateService((reviewObject: Omit<Review, 'id' | 'createdAt'>) => createReviewService(reviewObject), firestoreServiceOptions)

	const formSubmit = async (data: CreateReviewFormData) => {
		if (!reviewTour || !currentUser) return
		setLoading(true)

			const reviewObject: Omit<Review, 'id' | 'createdAt'> = {
				rating: data.rating,
				text: data.text,
				tourId: reviewTour.id,
				userId: currentUser.id
			}

		try {
			await createReview(reviewObject)

			reset()
			setShowSection('userReviews')
		}
		catch (err: any) {
			console.error(err.message)
		}
		finally {
			setLoading(false)
		}
	}

	return (
		<section>
			{loading || creating && <Spinner />}
			<div>
				<div className={styles.formContainer}>
					<header>
						<h2>Review this Tour</h2>
					</header>
					<form onSubmit={handleSubmit(formSubmit)} aria-label="Create review form">
						<div className={styles.inputContainer}>
							<label htmlFor='difficulty'>Rating</label>
							{errors.rating && <p className={styles.error}>{errors.rating.message}</p>}
							<input
								{...register('rating', {
									required: 'Ratingl is required',
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
						<div className={styles.inputContainer}>
							<label htmlFor='description'>Review</label>
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
							/>
						</div>
					</form>
				</div>
			</div>
		</section>
	)
}

export default CreateReview

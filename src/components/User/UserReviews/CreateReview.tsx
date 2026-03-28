import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from "react-hot-toast"

import type { Tour } from '../../../types/tour'

import { createReviewService } from '../../../services/firebase/reviewsService'
import { useAuth } from '../../../hooks/useAuth'

import Spinner from '../../../elements/Spinner/Spinner'

import styles from '../../../elements/Form.module.scss'

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

const CreateReview = ({ reviewTour, setShowSection }: CreateReviewProps) => {
	const { currentUser } = useAuth()
	const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateReviewFormData>()
	const [loading, setLoading] = useState(false)

	const formSubmit = async (data: CreateReviewFormData) => {
		setLoading(true)

		try {
			await createReviewService({
				rating: data.rating,
				text: data.text,
				tourId: reviewTour!.id,
				userId: currentUser!.id
			})

			reset()
			setShowSection('reviews')
		}
		catch (err: any) {
			console.error(err)
			toast.error(`Error creating review: ${err.message || err}`)
		}
		finally {
			setLoading(false)
		}
	}

	return (
		<>
			{loading && <Spinner />}
			<div>
				<div className={styles.formContainer}>
					<h2>Create New Tour</h2>

					<form onSubmit={handleSubmit(formSubmit)}>

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
		</>
	)
}

export default CreateReview

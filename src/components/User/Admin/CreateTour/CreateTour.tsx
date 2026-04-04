import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import type { Tour } from '../../../../types/tour'
import { Role } from '../../../../types/user'


import { createTourService } from '../../../../services/firebase/toursService'
import { uploadTourImage } from '../../../../services/firebase/storageService'
import { useAuth } from '../../../../hooks/useAuth'
import { useFirestoreMutateService } from '../../../../hooks/useFirestoreMutateService'
import { slugify } from '../../../../utils/slugify'
import { useImagePreviewUrl } from '../../../../hooks/useImagePreview'

import Spinner from '../../../../elements/Spinner/Spinner'
import { UserComponent } from '../../../../pages/UserPage/UserPage'

import styles from '../../../../elements/Form.module.scss'
import localStyles from './CreateTour.module.scss'

type CreateTourProps = {
	setShowSection: React.Dispatch<React.SetStateAction<UserComponent>>
}

type CreateTourFormData = {
	planet: string
	name: string
	summary: string
	description: string
	difficulty: number
	imageCoverFile: FileList
	image1File: FileList
	image2File: FileList
	image3File: FileList
}

const CreateTour = ({ setShowSection }: CreateTourProps) => {
	const { currentUser } = useAuth()
	const [formLoading, setFormLoading] = useState(false)
	const { register, handleSubmit, formState: { errors: formErrors }, watch, reset } = useForm<CreateTourFormData>()

	const { loading: firestoreHookLoading, mutate: createTour, error: firestoreHookError } =
		useFirestoreMutateService((tourObject: Omit<Tour, 'id' | 'departureDates'>) => createTourService(tourObject, currentUser!.email))

	const watchImageCover = watch('imageCoverFile')
	const watchImage1 = watch('image1File')
	const watchImage2 = watch('image2File')
	const watchImage3 = watch('image3File')

	// Preview URLs for each image
	const coverPreviewUrl = useImagePreviewUrl(watchImageCover)
	const image1PreviewUrl = useImagePreviewUrl(watchImage1)
	const image2PreviewUrl = useImagePreviewUrl(watchImage2)
	const image3PreviewUrl = useImagePreviewUrl(watchImage3)

	const formSubmit = async (data: CreateTourFormData) => {

		try {
			if (!currentUser || currentUser.role !== Role.Admin) {
				return toast.error("Please log in as Admin to create a tour")
			}

			setFormLoading(true)

			const now = new Date()
			const year = now.getFullYear()
			const month = now.getMonth()
			const day = now.getDate()
			const slug = slugify(data.name)

			const imageCoverURL = await uploadTourImage(data.imageCoverFile[0], `tour-${slug}-cover`)
			const image1URL = await uploadTourImage(data.image1File[0], `tour-${slug}-1`)
			const image2URL = await uploadTourImage(data.image2File[0], `tour-${slug}-2`)
			const image3URL = await uploadTourImage(data.image3File[0], `tour-${slug}-3`)

			const tourObject: Omit<Tour, 'id' | 'departureDates'> = {
				planet: data.planet,
				name: data.name,
				summary: data.summary,
				description: data.description,
				difficulty: data.difficulty,
				imageCover: imageCoverURL,
				images: [image1URL, image2URL, image3URL],
				averageRating: 0,
				reviews: 0,
				createdAt: `${year} ${month + 1} ${day}`,
				creator: currentUser!.id,
				slug
			}

			await createTour(tourObject)
			toast.success(`${tourObject.name} created successfully!`)
			
			reset()
			setShowSection(UserComponent.ManageTours)
		}
		catch (err: any) {
			console.error(err.message)
			toast.error(`Error creating tour: ${firestoreHookError?.message ?? err.message}`)
		}
		finally {
			setFormLoading(false)
		}
	}

	return (
		<section>
			{(formLoading || firestoreHookLoading) && <Spinner />}
			<div className={localStyles.createTourContainer}>
				<div className={styles.formContainer}>
					<header>
						<h2>Create New Tour</h2>
					</header>

					<form onSubmit={handleSubmit(formSubmit)} aria-label="Create tour form">

						{/* Planet */}
						<div className={styles.inputContainer}>
							<label htmlFor='planet'>Planet</label>
							{formErrors.planet && <p className={styles.error}>{formErrors.planet.message}</p>}
							<input
								{...register('planet', {
									required: 'Planet name is required',
									maxLength: {
										value: 30,
										message: 'Name of planet can be a maximum of 30 characters'
									}
								})}
								id='planet'
								type='text'
								placeholder='Choose a planet for this tour'
							/>
						</div>

						{/* Tour Name */}
						<div className={styles.inputContainer}>
							<label htmlFor='name'>Name</label>
							{formErrors.name && <p className={styles.error}>{formErrors.name.message}</p>}
							<input
								{...register('name', {
									required: 'Tour name is required',
									maxLength: {
										value: 50,
										message: 'Tour name can be a maximum of 50 characters'
									}
								})}
								id='name'
								type='text'
								placeholder='Choose a name for this tour'
							/>
						</div>

						{/* Summary */}
						<div className={styles.inputContainer}>
							<label htmlFor='summary'>Summary</label>
							{formErrors.summary && <p className={styles.error}>{formErrors.summary.message}</p>}
							<input
								{...register('summary', {
									required: 'Summary is required',
									maxLength: {
										value: 150,
										message: 'Summary can be a maximum of 150 characters'
									}
								})}
								id='summary'
								type='text'
								placeholder='Create a brief summary'
							/>
						</div>

						{/* Description */}
						<div className={styles.inputContainer}>
							<label htmlFor='description'>Description</label>
							{formErrors.description && <p className={styles.error}>{formErrors.description.message}</p>}
							<textarea
								{...register('description', {
									required: 'Description is required'
								})}
								id='description'
								placeholder='Create a full description'
							/>
						</div>

						{/* Difficulty */}
						<div className={styles.inputContainer}>
							<label htmlFor='difficulty'>Difficulty</label>
							{formErrors.difficulty && <p className={styles.error}>{formErrors.difficulty.message}</p>}
							<input
								{...register('difficulty', {
									required: 'Difficulty level is required',
									min: {
										value: 0,
										message: 'Please set a difficulty between 0 and 100'
									},
									max: {
										value: 100,
										message: 'Please set a difficulty between 0 and 100'
									},
									valueAsNumber: true
								})}
								id='difficulty'
								type='number'
							/>
						</div>

						{/* ImageCover */}
						<div className={styles.inputContainer}>
							<div className={styles.labelContainer}>
								 <label className={styles.label} htmlFor='imageCoverFile'>
                  <img
                    className={styles.icon}
                    src={coverPreviewUrl}
                    alt={`😊`}
                  />
                  {watchImageCover?.[0] ? 'Cover image selected' : 'Select cover image'}
                </label>
							</div>
							{formErrors.imageCoverFile && <p className={styles.error}>{formErrors.imageCoverFile.message as string}</p>}
							<input
								{...register('imageCoverFile', {
									required: 'A cover image is required'
								})}
								id='imageCoverFile'
								type='file'
								accept='image/jpeg,image/jpg,image/png'
							/>
						</div>

						{/* Image 1 */}
						<div className={styles.inputContainer}>
							<div className={styles.labelContainer}>
								 <label className={styles.label} htmlFor='image1File'>
                  <img
                    className={styles.icon}
                    src={image1PreviewUrl}
                    alt={`😊`}
                  />
                  {watchImage1?.[0] ? 'Image 1 selected' : 'Select image 1'}
                </label>
							</div>
							{formErrors.image1File && <p className={styles.error}>{formErrors.image1File.message as string}</p>}
							<input
								{...register('image1File', {
									required: 'Image 1 is required'
								})}
								id='image1File'
								type='file'
								accept='image/jpeg,image/jpg,image/png'
							/>
						</div>

						{/* Image 2 */}
						<div className={styles.inputContainer}>
							<div className={styles.labelContainer}>
								<label className={styles.label} htmlFor='image2File'>
                  <img
                    className={styles.icon}
                    src={image2PreviewUrl}
                    alt={`😊`}
                  />
                  {watchImage2?.[0] ? 'Image 2 selected' : 'Select image 2'}
                </label>
							</div>
							{formErrors.image2File && <p className={styles.error}>{formErrors.image2File.message as string}</p>}
							<input
								{...register('image2File', {
									required: 'Image 2 is required'
								})}
								id='image2File'
								type='file'
								accept='image/jpeg,image/jpg,image/png'
							/>
						</div>

						{/* Image 3 */}
						<div className={styles.inputContainer}>
							<div className={styles.labelContainer}>
								<label className={styles.label} htmlFor='image3File'>
                  <img
                    className={styles.icon}
                    src={image3PreviewUrl}
                    alt={`😊`}
                  />
                  {watchImage3?.[0] ? 'Image 3 selected' : 'Select image 3'}
                </label>
							</div>
							{formErrors.image3File && <p className={styles.error}>{formErrors.image3File.message as string}</p>}
							<input
								{...register('image3File', {
									required: 'Image 3 is required'
								})}
								id='image3File'
								type='file'
								accept='image/jpeg,image/jpg,image/png'
							/>
						</div>
						
						<div className={styles.inputContainer}>
							<input
								type='submit'
								name='submit'
								value='Create Tour'
								disabled={formLoading || firestoreHookLoading}
							/>
						</div>
					</form>
				</div>
			</div>
		</section>
	)
}

export default CreateTour
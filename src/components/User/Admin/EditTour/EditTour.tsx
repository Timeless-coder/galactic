import { useState } from 'react'
import { useForm } from 'react-hook-form'

import type { Tour } from '../../../../types/tour'
import { Role } from '../../../../types/user'

import { updateTourService } from '../../../../services/firebase/toursService'
import { uploadTourImage } from '../../../../services/firebase/storageService'
import { useAuth } from '../../../../hooks/useAuth'
import type { FirestoreMutateServiceOptions } from '../../../../hooks/useFirestoreMutateService'
import { useFirestoreMutateService } from '../../../../hooks/useFirestoreMutateService' 
import { slugify } from '../../../../utils/slugify'

import Spinner from '../../../../elements/Spinner/Spinner'

import styles from '../../../../elements/Form.module.scss'
import localStyles from './EditTour.module.scss'

type EditTourProps = {
  editTour: Tour
  setShowSection: React.Dispatch<React.SetStateAction<string>>
}

type EditTourFormData = {
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

const firestoreMutateServiceOptions: FirestoreMutateServiceOptions = {
  successMessage: 'Tour updated successfully!',
  errorMessage: 'Failed to update tour',
  silent: false
}

const EditTour = ({ editTour, setShowSection }: EditTourProps) => {
  const { currentUser } = useAuth()
  const { register, handleSubmit, formState: { errors }, watch } = useForm<EditTourFormData>({
    defaultValues: {
      planet: editTour.planet,
      name: editTour.name,
      summary: editTour.summary,
      description: editTour.description,
      difficulty: editTour.difficulty,
    }
  })
  const [loading, setLoading] = useState(false)

  const { loading: updating, mutate: updateTour } =
    useFirestoreMutateService((id: string, tour: Partial<Tour>, email: string) => updateTourService(id, tour, email), firestoreMutateServiceOptions)

  const watchImageCover = watch('imageCoverFile')
  const watchImage1 = watch('image1File')
  const watchImage2 = watch('image2File')
  const watchImage3 = watch('image3File')

  const formSubmit = async (data: EditTourFormData) => {
    if (!currentUser || currentUser.role !== Role.Admin) return

    setLoading(true)
    try {
      const imageCoverURL = data.imageCoverFile?.[0]
        ? await uploadTourImage(data.imageCoverFile[0], `tour-${editTour.slug}-cover`)
        : editTour.imageCover
      const image1URL = data.image1File?.[0]
        ? await uploadTourImage(data.image1File[0], `tour-${editTour.slug}-1`)
        : editTour.images[0]
      const image2URL = data.image2File?.[0]
        ? await uploadTourImage(data.image2File[0], `tour-${editTour.slug}-2`)
        : editTour.images[1]
      const image3URL = data.image3File?.[0]
        ? await uploadTourImage(data.image3File[0], `tour-${editTour.slug}-3`)
        : editTour.images[2]

      await updateTour(
        editTour.id,
        {
          planet: data.planet,
          name: data.name,
          summary: data.summary,
          description: data.description,
          difficulty: data.difficulty,
          imageCover: imageCoverURL,
          images: [image1URL, image2URL, image3URL],
          slug: slugify(data.name)
        },
        currentUser.email
      )

      setShowSection('manageTours')
    }
    catch (err: any) {
      console.error(err)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <section aria-labelledby="edit-tour-heading">
      {(loading || updating) && <Spinner />}
      <main className={localStyles.editTourContainer}>
        <article className={styles.formContainer}>
          <header>
            <h2 id="edit-tour-heading">Edit this Tour</h2>
          </header>
          <form onSubmit={handleSubmit(formSubmit)} aria-label="Edit tour form">
            <fieldset>
              <legend className="sr-only">Tour Details</legend>
              {/* Planet */}
              <div className={styles.inputContainer}>
                <label htmlFor='planet'>Planet</label>
                {errors.planet && <p className={styles.error} role="alert">{errors.planet.message}</p>}
                <input
                  {...register('planet', {
                    required: 'Planet name is required',
                    maxLength: {
                      value: 30,
                      message: 'A planet name can have a maximum of 30 characters'
                    }
                  })}
                  id='planet'
                  type='text'
                  placeholder='Choose a new planet for this tour'
                  aria-required="true"
                  aria-invalid={!!errors.planet}
                />
              </div>
              {/* Name */}
              <div className={styles.inputContainer}>
                <label htmlFor='name'>Name</label>
                {errors.name && <p className={styles.error} role="alert">{errors.name.message}</p>}
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
                  placeholder='Words and spaces only'
                  aria-required="true"
                  aria-invalid={!!errors.name}
                />
              </div>
              {/* Summary */}
              <div className={styles.inputContainer}>
                <label htmlFor='summary'>Summary</label>
                {errors.summary && <p className={styles.error} role="alert">{errors.summary.message}</p>}
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
                  placeholder='Create a new brief summary'
                  aria-required="true"
                  aria-invalid={!!errors.summary}
                />
              </div>
              {/* Description */}
              <div className={styles.inputContainer}>
                <label htmlFor='description'>Description</label>
                {errors.description && <p className={styles.error} role="alert">{errors.description.message}</p>}
                <textarea
                  {...register('description', {
                    required: 'Description is required'
                  })}
                  id='description'
                  placeholder='Create a new full description'
                  aria-required="true"
                  aria-invalid={!!errors.description}
                />
              </div>
              {/* Difficulty */}
              <div className={styles.inputContainer}>
                <label htmlFor='difficulty'>Difficulty</label>
                {errors.difficulty && <p className={styles.error} role="alert">{errors.difficulty.message}</p>}
                <input
                  {...register('difficulty', {
                    required: 'Difficulty level is required',
                    min: {
                      value: 1,
                      message: 'Please set a difficulty between 1 and 100'
                    },
                    max: {
                      value: 100,
                      message: 'Please set a difficulty between 1 and 100'
                    },
                    valueAsNumber: true
                  })}
                  id='difficulty'
                  type='number'
                  aria-required="true"
                  aria-invalid={!!errors.difficulty}
                />
              </div>
              {/* ImageCover */}
              <div className={styles.inputContainer}>
                <div className={styles.labelContainer}>
                  <label className={styles.label} htmlFor='imageCoverFile'>
                    <img
                      className={styles.icon}
                      src={editTour.imageCover}
                      alt={`${editTour.name} cover image`}
                    />
                    {watchImageCover?.[0] ? 'New image selected' : 'Select a new cover image'}
                  </label>
                </div>
                <input
                  {...register('imageCoverFile')}
                  id='imageCoverFile'
                  type='file'
                  accept='image/jpg'
                  aria-label="Upload a new cover image"
                />
              </div>
              {/* Image 1 */}
              <div className={styles.inputContainer}>
                <div className={styles.labelContainer}>
                  <label className={styles.label} htmlFor='image1File'>
                    <img
                      className={styles.icon}
                      src={editTour.images[0]}
                      alt={`${editTour.name} image 1`}
                    />
                    {watchImage1?.[0] ? 'New image selected' : 'Select a new image 1'}
                  </label>
                </div>
                <input
                  {...register('image1File')}
                  id='image1File'
                  type='file'
                  accept='image/jpg'
                  aria-label="Upload a new image 1"
                />
              </div>
              {/* Image 2 */}
              <div className={styles.inputContainer}>
                <div className={styles.labelContainer}>
                  <label className={styles.label} htmlFor='image2File'>
                    <img
                      className={styles.icon}
                      src={editTour.images[1]}
                      alt={`${editTour.name} image 2`}
                    />
                    {watchImage2?.[0] ? 'New image selected' : 'Select a new image 2'}
                  </label>
                </div>
                <input
                  {...register('image2File')}
                  id='image2File'
                  type='file'
                  accept='image/jpg'
                  aria-label="Upload a new image 2"
                />
              </div>
              {/* Image 3 */}
              <div className={styles.inputContainer}>
                <div className={styles.labelContainer}>
                  <label className={styles.label} htmlFor='image3File'>
                    <img
                      className={styles.icon}
                      src={editTour.images[2]}
                      alt={`${editTour.name} image 3`}
                    />
                    {watchImage3?.[0] ? 'New image selected' : 'Select a new image 3'}
                  </label>
                </div>
                <input
                  {...register('image3File')}
                  id='image3File'
                  type='file'
                  accept='image/jpg'
                  aria-label="Upload a new image 3"
                />
              </div>
              <div className={styles.inputContainer}>
                <button
                  type='submit'
                  name='submit'
                  disabled={loading || updating}
                  aria-label="Update Tour"
                >
                  Update Tour
                </button>
              </div>
            </fieldset>
          </form>
        </article>
      </main>
    </section>
  )
}

export default EditTour

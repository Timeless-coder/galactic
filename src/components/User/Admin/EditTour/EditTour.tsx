import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { MdAddAPhoto } from 'react-icons/md'
import { AiOutlineCheck } from 'react-icons/ai'

import type { Tour } from '../../../../types/tour'

import { updateTourService } from '../../../../services/firebase/toursService'
import { uploadTourImage } from '../../../../services/firebase/storageService'
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

const EditTour = ({ editTour, setShowSection }: EditTourProps) => {
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

  const watchImageCover = watch('imageCoverFile')
  const watchImage1 = watch('image1File')
  const watchImage2 = watch('image2File')
  const watchImage3 = watch('image3File')

  const formSubmit = async (data: EditTourFormData) => {
    setLoading(true)
    try {
      const imageCoverURL = data.imageCoverFile?.[0]
        ? await uploadTourImage(data.imageCoverFile[0], `tour-${editTour.index}-cover`)
        : editTour.imageCover
      const image1URL = data.image1File?.[0]
        ? await uploadTourImage(data.image1File[0], `tour-${editTour.index}-1`)
        : editTour.images[0]
      const image2URL = data.image2File?.[0]
        ? await uploadTourImage(data.image2File[0], `tour-${editTour.index}-2`)
        : editTour.images[1]
      const image3URL = data.image3File?.[0]
        ? await uploadTourImage(data.image3File[0], `tour-${editTour.index}-3`)
        : editTour.images[2]

      await updateTourService(editTour.id, {
        planet: data.planet,
        name: data.name,
        summary: data.summary,
        description: data.description,
        difficulty: data.difficulty,
        imageCover: imageCoverURL,
        images: [image1URL, image2URL, image3URL],
        slug: slugify(data.name)
      })

      setShowSection('manageTours')
    }
    catch (err: any) {
      console.error(err)
      toast.error(`Error updating tour: ${err.message || err}`)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <Spinner />}
      <div className={localStyles.editTourContainer}>
        <div className={styles.formContainer}>
          <h2>Edit this Tour</h2>
          <form onSubmit={handleSubmit(formSubmit)}>

            <div className={styles.inputContainer}>
              <label htmlFor='planet'>Planet</label>
              {errors.planet && <p className={styles.error}>{errors.planet.message}</p>}
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
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor='name'>Name</label>
              {errors.name && <p className={styles.error}>{errors.name.message}</p>}
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
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor='summary'>Summary</label>
              {errors.summary && <p className={styles.error}>{errors.summary.message}</p>}
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
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor='description'>Description</label>
              {errors.description && <p className={styles.error}>{errors.description.message}</p>}
              <textarea
                {...register('description', {
                  required: 'Description is required'
                })}
                id='description'
                placeholder='Create a new full description'
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor='difficulty'>Difficulty</label>
              {errors.difficulty && <p className={styles.error}>{errors.difficulty.message}</p>}
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
              />
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.labelContainer}>
                <label className={styles.label} htmlFor='imageCoverFile'>
                  {watchImageCover?.[0] || editTour.imageCover
                    ? <AiOutlineCheck className={styles.icon} />
                    : <MdAddAPhoto className={styles.icon} />
                  }
                  New Image Cover
                </label>
              </div>
              <input
                {...register('imageCoverFile')}
                id='imageCoverFile'
                type='file'
                accept='image/jpg'
              />
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.labelContainer}>
                <label className={styles.label} htmlFor='image1File'>
                  {watchImage1?.[0] || editTour.images[0]
                    ? <AiOutlineCheck className={styles.icon} />
                    : <MdAddAPhoto className={styles.icon} />
                  }
                  New Image 1
                </label>
              </div>
              <input
                {...register('image1File')}
                id='image1File'
                type='file'
                accept='image/jpg'
              />
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.labelContainer}>
                <label className={styles.label} htmlFor='image2File'>
                  {watchImage2?.[0] || editTour.images[1]
                    ? <AiOutlineCheck className={styles.icon} />
                    : <MdAddAPhoto className={styles.icon} />
                  }
                  New Image 2
                </label>
              </div>
              <input
                {...register('image2File')}
                id='image2File'
                type='file'
                accept='image/jpg'
              />
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.labelContainer}>
                <label className={styles.label} htmlFor='image3File'>
                  {watchImage3?.[0] || editTour.images[2]
                    ? <AiOutlineCheck className={styles.icon} />
                    : <MdAddAPhoto className={styles.icon} />
                  }
                  New Image 3
                </label>
              </div>
              <input
                {...register('image3File')}
                id='image3File'
                type='file'
                accept='image/jpg'
              />
            </div>

            <div className={styles.inputContainer}>
              <input
                type='submit'
                name='submit'
                value='Update Tour'
              />
            </div>
            
          </form>
        </div>
      </div>
    </>
  )
}

export default EditTour

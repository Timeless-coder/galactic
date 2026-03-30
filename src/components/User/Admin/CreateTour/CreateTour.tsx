import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from "react-hot-toast"
import { MdAddAPhoto } from 'react-icons/md'
import { AiOutlineCheck } from 'react-icons/ai'

import { createTourService } from '../../../../services/firebase/toursService'
import { uploadTourImage } from '../../../../services/firebase/storageService'
import { useAuth } from '../../../../hooks/useAuth'
import { slugify } from '../../../../utils/slugify'

import { Role } from '../../../../types/user'

import Spinner from '../../../../elements/Spinner/Spinner'

import styles from '../../../../elements/Form.module.scss'
import localStyles from './CreateTour.module.scss'

type CreateTourProps = {
  setShowSection: React.Dispatch<React.SetStateAction<string>>
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
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<CreateTourFormData>()
  const [loading, setLoading] = useState(false)

  const watchImageCover = watch('imageCoverFile')
  const watchImage1 = watch('image1File')
  const watchImage2 = watch('image2File')
  const watchImage3 = watch('image3File')

  const formSubmit = async (data: CreateTourFormData) => {
    setLoading(true)

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const day = now.getDate()

    try {
      if (!currentUser || currentUser.role !== Role.Admin) return

      const slug = slugify(data.name)

      const imageCoverURL = await uploadTourImage(data.imageCoverFile[0], `tour-${slug}-cover`)
      const image1URL = await uploadTourImage(data.image1File[0], `tour-${slug}-1`)
      const image2URL = await uploadTourImage(data.image2File[0], `tour-${slug}-2`)
      const image3URL = await uploadTourImage(data.image3File[0], `tour-${slug}-3`)

      await createTourService({
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
        slug,
        startDates: ['2021 7 4', '2022 1 3', '2023 5 4']
      }, currentUser.email)

      reset()
      setShowSection('manageTours')
    }
    catch (err: any) {
      console.error(err)
      toast.error(`Error creating tour: ${err.message || err}`)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <Spinner />}
      <div className={localStyles.createTourContainer}>
        <div className={styles.formContainer}>
          <h2>Create New Tour</h2>

          <form onSubmit={handleSubmit(formSubmit)}>

            <div className={styles.inputContainer}>
              <label htmlFor='planet'>Planet</label>
              {errors.planet && <p className={styles.error}>{errors.planet.message}</p>}
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
                placeholder='Choose a name for this tour'
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
                placeholder='Create a brief summary'
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor='description'>Description</label>
              {errors.description && <p className={styles.error}>{errors.description.message}</p>}
              <input
                {...register('description', {
                  required: 'Description is required'
                })}
                id='description'
                type='text'
                placeholder='Create a full description'
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor='difficulty'>Difficulty</label>
              {errors.difficulty && <p className={styles.error}>{errors.difficulty.message}</p>}
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

            <div className={styles.inputContainer}>
              <div className={styles.labelContainer}>
                <label className={styles.label} htmlFor='imageCoverFile'>
                  {watchImageCover?.[0]
                    ? <AiOutlineCheck className={styles.icon} />
                    : <MdAddAPhoto className={styles.icon} />
                  }
                  Image Cover
                </label>
              </div>
              {errors.imageCoverFile && <p className={styles.error}>{errors.imageCoverFile.message as string}</p>}
              <input
                {...register('imageCoverFile', {
                  required: 'A cover image is required'
                })}
                id='imageCoverFile'
                type='file'
                accept='image/jpg'
              />
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.labelContainer}>
                <label className={styles.label} htmlFor='image1File'>
                  {watchImage1?.[0]
                    ? <AiOutlineCheck className={styles.icon} />
                    : <MdAddAPhoto className={styles.icon} />
                  }
                  Image 1
                </label>
              </div>
              {errors.image1File && <p className={styles.error}>{errors.image1File.message as string}</p>}
              <input
                {...register('image1File', {
                  required: 'Image 1 is required'
                })}
                id='image1File'
                type='file'
                accept='image/jpg'
              />
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.labelContainer}>
                <label className={styles.label} htmlFor='image2File'>
                  {watchImage2?.[0]
                    ? <AiOutlineCheck className={styles.icon} />
                    : <MdAddAPhoto className={styles.icon} />
                  }
                  Image 2
                </label>
              </div>
              {errors.image2File && <p className={styles.error}>{errors.image2File.message as string}</p>}
              <input
                {...register('image2File', {
                  required: 'Image 2 is required'
                })}
                id='image2File'
                type='file'
                accept='image/jpg'
              />
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.labelContainer}>
                <label className={styles.label} htmlFor='image3File'>
                  {watchImage3?.[0]
                    ? <AiOutlineCheck className={styles.icon} />
                    : <MdAddAPhoto className={styles.icon} />
                  }
                  Image 3
                </label>
              </div>
              {errors.image3File && <p className={styles.error}>{errors.image3File.message as string}</p>}
              <input
                {...register('image3File', {
                  required: 'Image 3 is required'
                })}
                id='image3File'
                type='file'
                accept='image/jpg'
              />
            </div>

            <div className={styles.inputContainer}>
              <input
                type='submit'
                name='submit'
                value='Create Tour'
              />
            </div>

          </form>
        </div>
      </div>
    </>
  )
}

export default CreateTour

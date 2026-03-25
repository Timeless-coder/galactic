import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { MdAddAPhoto } from 'react-icons/md'
import { AiOutlineCheck } from 'react-icons/ai'
import { useForm } from 'react-hook-form'

import { firestore, storage } from '../../../../firebase/firebase.utils'
import { setError, setMessage, clearError, clearMessage } from '../../../../redux/flashSlice'
import { useAuth } from '../../../../contexts/AuthContext'
import { slugify } from '../../../../utils/slugify'

import Spinner from '../../../../elements/Spinner/Spinner'

import styles from '../../../../elements/Form.module.scss'
import localStyles from './CreateTour.module.scss'

const storageRef = storage.ref()

const CreateTour = ({ setShowSection }) => {
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors: hookFormErrors } } = useForm()
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [planet, setPlanet] = useState('')
  const [name, setName] = useState('')
  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState(0)
  const [imageCoverFile, setImageCoverFile] = useState('')
  const [image1File, setImage1File] = useState('')
  const [image2File, setImage2File] = useState('')
  const [image3File, setImage3File] = useState('')
  const newTourIndex = useRef()

  // These 2 functions just get the current value of that index from firestore, then increment it by one on new creation.
  const getNewTourIndex = async () => {
    const newTourIndexRef = await firestore.collection('newTourIndex').doc('qiiJ5kJFuSM32hXW6Z1g').get()
    newTourIndex.current = newTourIndexRef.data().index
  }

  const incrementNewTourIndex = async () => {
    newTourIndex.current += 1
    await firestore.collection('newTourIndex').doc('qiiJ5kJFuSM32hXW6Z1g').update({
      index: newTourIndex.current
    })
  }

  const formSubmit = async () => {
    setLoading(true)
    dispatch(clearError())
    dispatch(clearMessage())
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const day = now.getDate()
    let imageCoverURL
    let image1URL
    let image2URL
    let image3URL
    try {
      if (imageCoverFile) {
        const fileName = `tour-${newTourIndex.current}-cover`
        const imageRef = storageRef.child(fileName)
        await imageRef.put(imageCoverFile)
        imageCoverURL = await imageRef.getDownloadURL()
      }
      if (image1File) {
        const fileName = `tour-${newTourIndex.current}-1`
        const imageRef = storageRef.child(fileName)
        await imageRef.put(image1File)
        image1URL = await imageRef.getDownloadURL()
      }
      if (image2File) {
        const fileName = `tour-${newTourIndex.current}-2`
        const imageRef = storageRef.child(fileName)
        await imageRef.put(image2File)
        image2URL = await imageRef.getDownloadURL()
      }
      if (image3File) {
        const fileName = `tour-${newTourIndex.current}-3`
        const imageRef = storageRef.child(fileName)
        await imageRef.put(image3File)
        image3URL = await imageRef.getDownloadURL()
      }
    }
    catch (err) {
      setLoading(false)
      return dispatch(
        setError(err.message || 'Error in uploading images')
      )
    }
    firestore.collection('tours').add({
        planet: planet,
        name: name,
        summary: summary,
        description: description,
        difficulty: Number(difficulty),
        imageCover: imageCoverURL,
        images: [image1URL, image2URL, image3URL],
        averageRating: 0,
        reviews: 0,
        createdAt: `${year} ${month + 1} ${day}`,
        creator: currentUser.id,
        index: newTourIndex.current,
        slug: slugify(name),
        startDates: ['2021 7 4', '2022 1 3', '2023 5 4']
    })
    .then(() => {
      dispatch(setMessage('Tour successfullly created'))
      setLoading(false)
      setTimeout(() => {
        dispatch(clearMessage())
      }, 3000)
      incrementNewTourIndex()
      setPlanet('')
      setName('')
      setSummary('')
      setDescription('')
      setDifficulty('')
      setImageCoverFile('')
      setImage1File('')
      setImage2File('')
      setImage3File('')
      setShowSection('manageTours')
    })
    .catch(err => {
      dispatch(setError(`Tour not created. ${err.message}`))
      setLoading(false)
    })
  }

  useEffect(() => {
    getNewTourIndex()
  }, [])

  return (
    <>
      {loading && <Spinner />}
      <div className={localStyles.createTourContainer}>
        <div className={styles.formContainer}>
          <h2>Create New Tour</h2>

          <form onSubmit={handleSubmit(formSubmit)}>

            <div className={styles.inputContainer}>
              <label htmlFor='planet'>Planet</label>
              {hookFormErrors.planet && <p className={styles.error}>{hookFormErrors.planet.message}</p>}
              <input
                {...register('planet', {
                  required: 'Planet name is required',
                  maxLength: {
                  value: 30,
                  message: 'Name of planet can be a maximum of 30 characters'
                  }
                })}
                type='text'
                name='planet'
                value={planet}
                onChange={e => setPlanet(e.target.value)}
                placeholder='Choose a planet for this tour'
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor='name'>Name</label>
              {hookFormErrors.name && <p className={styles.error}>{hookFormErrors.name.message}</p>}
              <input
                {...register('name', {
                  required: 'Tour name is required'
                })}
                type='text'
                name='name'
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder='Choose a name for this tour'
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor='summary'>Summary</label>
              {hookFormErrors.summary && <p className={styles.error}>{hookFormErrors.summary.message}</p>}
              <input
                {...register('summary', {
                  required: 'Summary is required'
                })}
                type='text'
                name='summary'
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder='Create a brief summary'
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor='description'>Description</label>
              {hookFormErrors.description && <p className={styles.error}>{hookFormErrors.description.message}</p>}
              <input
                {...register('description', {
                  required: 'Description is required'
                })}
                type='text'
                name='description'
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder='Create a full description'
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor='difficulty'>Difficulty</label>
              {hookFormErrors.difficulty && <p className={styles.error}>{hookFormErrors.difficulty.message}</p>}
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
                  valueAsNumber: 'Numbers only please'
                })}
                type='number'
                name='difficulty'
                value={difficulty}
                onChange={e => setDifficulty(Number(e.target.value))}
              />
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.labelContainer}>
                <label className={styles.label} htmlFor='imageCoverFile'>
                  {imageCoverFile
                    ? <AiOutlineCheck className={styles.icon} />
                    : <MdAddAPhoto className={styles.icon} />
                  }
                  ImageCover
                </label>                
              </div>
              {hookFormErrors.imageCoverFile && <p className={styles.error}>{hookFormErrors.imageCoverFile.message}</p>}
              <input
                {...register('imageCoverFile', {
                required: 'A cover image is required'
                })}
                id='imageCoverFile'
                type='file'
                name='imageCoverFile'
                accept='image/jpg'
                onChange={e => setImageCoverFile(e.target.files[0])}
              />
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.labelContainer}>
                <label className={styles.label} htmlFor='image1File'>
                  {image1File
                    ? <AiOutlineCheck className={styles.icon} />
                    : <MdAddAPhoto className={styles.icon} />
                  }
                  Image 1
                </label>                
              </div>
              {hookFormErrors.image1File && <p className={styles.error}>{hookFormErrors.image1File.message}</p>}
              <input
                {...register('image1File', {
                required: '3 images are required'
                })}
                id='image1File'
                type='file'
                name='image1File'
                accept='image/jpg'
                onChange={e => setImage1File(e.target.files[0])}
              />
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.labelContainer}>
                <label className={styles.label} htmlFor='image2File'>
                  {image2File
                    ? <AiOutlineCheck className={styles.icon} />
                    : <MdAddAPhoto className={styles.icon} />
                  }
                  Image 2
                </label>
              </div>
              {hookFormErrors.image2File && <p className={styles.error}>{hookFormErrors.image2File.message}</p>}
              <input
                {...register('image2File', {
                  required: '3 images are required'
                })}
                id='image2File'
                type='file'
                name='image2File'
                accept='image/jpg'
                onChange={e => setImage2File(e.target.files[0])}
              />
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.labelContainer}>
                <label className={styles.label} htmlFor='image3File'>
                  {image3File
                    ? <AiOutlineCheck className={styles.icon} />
                    : <MdAddAPhoto className={styles.icon} />
                  }
                  Image 3
                </label>
              </div>
              {hookFormErrors.image3File && <p className={styles.error}>{hookFormErrors.image3File.message}</p>}
              <input
                {...register('image3File', {
                required: '3 images are required'
                })}
                id='image3File'
                type='file'
                name='image3File'
                accept='image/jpg'
                onChange={e => setImage3File(e.target.files[0])}
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

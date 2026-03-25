import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { MdAddAPhoto } from 'react-icons/md'
import { AiOutlineCheck } from 'react-icons/ai'
import { useForm } from 'react-hook-form'

import { setError, setMessage, clearMessage, clearError } from '../../../../redux/flashSlice'
import { firestore, storage } from '../../../../firebase/firebase.utils'
import { slugify } from '../../../../utils/slugify'

import Spinner from '../../../../elements/Spinner/Spinner'

import styles from '../../../../elements/Form.module.scss'
import localStyles from './EditTour.module.scss'

const storageRef = storage.ref()

const EditTour = ({ editTour, setShowSection }) => {
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors: hookFormErrors } } = useForm()
  const [loading, setLoading] = useState(false)
  const [newPlanet, setNewPlanet] = useState(editTour.planet)
  const [newName, setNewName] = useState(editTour.name)
  const [newSummary, setNewSummary] = useState(editTour.summary)
  const [newDescription, setNewDescription] = useState(editTour.description)
  const [newDifficulty, setNewDifficulty] = useState(editTour.difficulty)
  const [imageCoverFile, setImageCoverFile] = useState(editTour.imageCover)
  const [image1File, setImage1File] = useState(editTour.images[0])
  const [image2File, setImage2File] = useState(editTour.images[1])
  const [image3File, setImage3File] = useState(editTour.images[2])

  const formSubmit = async () => {
    // event.preventDefault()
    setLoading(true)
    dispatch(clearMessage())
    dispatch(clearError())
    let imageCoverURL
    let image1URL
    let image2URL
    let image3URL
    try {
      if (imageCoverFile) {
        const fileName = `tour-${editTour.index}-cover`
        const imageRef = storageRef.child(fileName)
        await imageRef.put(imageCoverFile)
        imageCoverURL = await imageRef.getDownloadURL()
      }
      if (image1File) {
        const fileName = `tour-${editTour.index}-1`
        const imageRef = storageRef.child(fileName)
        await imageRef.put(image1File)
        image1URL = await imageRef.getDownloadURL()
      }
      if (image2File) {
        const fileName = `tour-${editTour.index}-2`
        const imageRef = storageRef.child(fileName)
        await imageRef.put(image2File)
        image2URL = await imageRef.getDownloadURL()
      }
      if (image3File) {
        const fileName = `tour-${editTour.index}-3`
        const imageRef = storageRef.child(fileName)
        await imageRef.put(image3File)
        image3URL = await imageRef.getDownloadURL()
      }
    } catch (err) {
      setLoading(false)
      return dispatch(setError(err.message || 'Error in uploading images'))
    }
    firestore.collection('tours').doc(editTour.id).update({
      planet: newPlanet,
      name: newName,
      summary: newSummary,
      description: newDescription,
      difficulty: newDifficulty,
      imageCover: imageCoverURL || editTour.imageCover,
      images: [
        image1URL || editTour.images[0],
        image2URL || editTour.images[1],
        image3URL || editTour.images[2]
      ],
      slug: slugify(newName)
    })
    .then(() => {
      dispatch(setMessage('Tour successfullly updated'))
      setLoading(false)
      setTimeout(() => {
        dispatch(clearMessage())
      }, 3000)
      setShowSection('manageTours')
    })
    .catch(err => {
      dispatch(setError(`Tour not updated. ${err.message}`))
      setLoading(false)
    })
  }

  return (
    <>
      {loading && <Spinner />}
      <div className={localStyles.editTourContainer}>
        <div className={styles.formContainer}>
          <h2>Edit this Tour</h2>
          <form onSubmit={handleSubmit(formSubmit)}>

            <div className={styles.inputContainer}>
              <label htmlFor='newPlanet'>Planet</label>              
              {hookFormErrors.newPlanet && <p className={styles.error}>{hookFormErrors.newPlanet.message}</p>}
              <input
                {...register('newPlanet', {
                  required: 'Planet name is required',
                  maxLength: {
                  value: 30,
                  message: 'A planet name can have a maximum of 30 characters'
                  }
                })}
                type='text'
                id='newPlanet'
                name='newPlanet'
                value={newPlanet}
                onChange={e => setNewPlanet(e.target.value)}
                placeholder='Choose a new planet for this tour'
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor='newName'>Name</label>
              {hookFormErrors.newName && <p className={styles.error}>{hookFormErrors.newName.message}</p>}
              <input
                {...register('newName', {
                  required: 'Tour name is required'
                })}
                type='text'
                id='newName'
                name='newName'
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder='Words and spaces only'
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor='newSummary'>Summary</label>
              {hookFormErrors.newSummary && <p className={styles.error}>{hookFormErrors.newSummary.message}</p>}
              <input
                {...register('newSummary', {
                  required: 'Summary is required'
                })}
                type='text'
                id='newSummary'
                name='newSummary'
                value={newSummary}
                onChange={e => setNewSummary(e.target.value)}
                placeholder='Create a new brief summary'
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor='newDescription'>Description</label>
              {hookFormErrors.newDescription && <p className={styles.error}>{hookFormErrors.newDescription.message}</p>}
              <textarea
                {...register('newDescription', {
                  required: 'Description is required'
                })}
                id='newDescription'
                name='newDescription'
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder='Create a new full description'
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor='newDifficulty'>Difficulty</label>
              {hookFormErrors.newDifficulty && <p className={styles.error}>{hookFormErrors.newDifficulty.message}</p>}
              <input
                {...register('newDifficulty', {
                  required: 'Difficulty level is required',
                  min: {
                  value: 1,
                  message: 'Please set a difficulty between 1 and 100'
                  },
                  max: {
                  value: 100,
                  message: 'Please set a difficulty between 1 and 100'
                  },
                  valueAsNumber: 'Numbers only please'
                })}
                type='number'
                id='newDifficulty'
                name='newDifficulty'
                value={newDifficulty}
                onChange={e => setNewDifficulty(Number(e.target.value))}
              />
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.labelContainer}>
                <label className={styles.label} htmlFor='imageCoverFile'>
                  {imageCoverFile
                  ? <AiOutlineCheck className={styles.icon} />
                  : <MdAddAPhoto className={styles.icon} />
                  }
                  New ImageCover
                </label>
              </div>
              <input
                {...register('imageCoverFile')}
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
                  New Image 1
                </label>
              </div>
              <input
                {...register('image1File')}
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
                  New Image 2
                </label>
              </div>
              <input
                {...register('image2File')}
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
                  New Image 3
                </label>
              </div>
              <input
                {...register('image3File')}
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

import { useState } from 'react'
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

const EditTour = ({ editTour, setShowSection }: EditTourProps) => {
  const [loading, setLoading] = useState(false)
  const [newPlanet, setNewPlanet] = useState(editTour.planet)
  const [newName, setNewName] = useState(editTour.name)
  const [newSummary, setNewSummary] = useState(editTour.summary)
  const [newDescription, setNewDescription] = useState(editTour.description)
  const [newDifficulty, setNewDifficulty] = useState(editTour.difficulty)
  const [imageCoverFile, setImageCoverFile] = useState<File | string | null>(editTour.imageCover)
  const [image1File, setImage1File] = useState<File | string | null>(editTour.images[0])
  const [image2File, setImage2File] = useState<File | string | null>(editTour.images[1])
  const [image3File, setImage3File] = useState<File | string | null>(editTour.images[2])

  const formSubmit = async (e:React.SubmitEvent) => {
    e.preventDefault()

    setLoading(true)
    let imageCoverURL
    let image1URL
    let image2URL
    let image3URL
    try {
      if (imageCoverFile instanceof File)
        imageCoverURL = await uploadTourImage(imageCoverFile, `tour-${editTour.index}-cover`)
      if (image1File instanceof File)
        image1URL = await uploadTourImage(image1File, `tour-${editTour.index}-1`)
      if (image2File instanceof File)
        image2URL = await uploadTourImage(image2File, `tour-${editTour.index}-2`)
      if (image3File instanceof File)
        image3URL = await uploadTourImage(image3File, `tour-${editTour.index}-3`)

      await updateTourService(editTour.id, {
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
    }
    catch (err: Error | any) {
      throw new Error(`Placeholder message ${err.message}`)
    }
    finally {
      setLoading(false)
    }
    
    setShowSection('manageTours')
  }

  return (
    <>
      {loading && <Spinner />}
      <div className={localStyles.editTourContainer}>
        <div className={styles.formContainer}>
          <h2>Edit this Tour</h2>
          <form onSubmit={formSubmit}>

            <div className={styles.inputContainer}>
              <label htmlFor='newPlanet'>Planet</label>
              <input
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
              <input
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
              <input
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
              <textarea
                id='newDescription'
                name='newDescription'
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder='Create a new full description'
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor='newDifficulty'>Difficulty</label>
              <input
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
                id='imageCoverFile'
                type='file'
                name='imageCoverFile'
                accept='image/jpg'
                onChange={e => setImageCoverFile(e.target.files?.[0] || null)}
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
                id='image1File'
                type='file'
                name='image1File'
                accept='image/jpg'
                onChange={e => setImage1File(e.target.files?.[0] || null)}
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
                id='image2File'
                type='file'
                name='image2File'
                accept='image/jpg'
                onChange={e => setImage2File(e.target.files?.[0] || null)}
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
                id='image3File'
                type='file'
                name='image3File'
                accept='image/jpg'
                onChange={e => setImage3File(e.target.files?.[0] || null)}
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

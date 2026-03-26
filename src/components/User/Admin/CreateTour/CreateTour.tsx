import React, { useState, useEffect, useRef } from 'react'
import { MdAddAPhoto } from 'react-icons/md'
import { AiOutlineCheck } from 'react-icons/ai'

import { createTourService, getNewTourIndexService, incrementNewTourIndexService } from '../../../../services/firebase/toursService'
import { uploadTourImage } from '../../../../services/firebase/storageService'
import { useAuth } from '../../../../hooks/useAuth'
import { slugify } from '../../../../utils/slugify'

import Spinner from '../../../../elements/Spinner/Spinner'

import styles from '../../../../elements/Form.module.scss'
import localStyles from './CreateTour.module.scss'

type CreateTourProps = {
  setShowSection: (section: string) => void
}

const CreateTour = ({ setShowSection }: CreateTourProps) => {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [planet, setPlanet] = useState('')
  const [name, setName] = useState('')
  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState(0)
  const [imageCoverFile, setImageCoverFile] = useState<File | null>(null)
  const [image1File, setImage1File] = useState<File | null>(null)
  const [image2File, setImage2File] = useState<File | null>(null)
  const [image3File, setImage3File] = useState<File | null>(null)
  const newTourIndex = useRef<number>(10)

  const getNewTourIndex = async () => {
    newTourIndex.current = await getNewTourIndexService()
  }

  const formSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()

    setLoading(true)
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const day = now.getDate()
    let imageCoverURL
    let image1URL
    let image2URL
    let image3URL
    try {
      if (imageCoverFile instanceof File)
        imageCoverURL = await uploadTourImage(imageCoverFile, `tour-${newTourIndex.current}-cover`)
      if (image1File instanceof File)
        image1URL = await uploadTourImage(image1File, `tour-${newTourIndex.current}-1`)
      if (image2File instanceof File)
        image2URL = await uploadTourImage(image2File, `tour-${newTourIndex.current}-2`)
      if (image3File instanceof File)
        image3URL = await uploadTourImage(image3File, `tour-${newTourIndex.current}-3`)

      if (imageCoverURL && image1URL && image2URL && image3URL) {
        await createTourService({
          planet,
          name,
          summary,
          description,
          difficulty: Number(difficulty),
          imageCover: imageCoverURL,
          images: [image1URL, image2URL, image3URL],
          averageRating: 0,
          reviews: 0,
          createdAt: `${year} ${month + 1} ${day}`,
          creator: currentUser!.id,
          index: newTourIndex.current,
          slug: slugify(name),
          startDates: ['2021 7 4', '2022 1 3', '2023 5 4']
        })

        await getNewTourIndex()
        setPlanet('')
        setName('')
        setSummary('')
        setDescription('')
        setDifficulty(0)
        setImageCoverFile(null)
        setImage1File(null)
        setImage2File(null)
        setImage3File(null)
        setShowSection('manageTours')           
      }
    }
    catch (err: any) {
        throw new Error(`Tour creation failed. ${err.message}`)
      } finally {
        setLoading(false)
      }
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

          <form onSubmit={formSubmit}>

            <div className={styles.inputContainer}>
              <label htmlFor='planet'>Planet</label>
              <input
                type='text'
                name='planet'
                value={planet}
                onChange={e => setPlanet(e.target.value)}
                placeholder='Choose a planet for this tour'
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor='name'>Name</label>
              <input
                type='text'
                name='name'
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder='Choose a name for this tour'
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor='summary'>Summary</label>
              <input
                type='text'
                name='summary'
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder='Create a brief summary'
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor='description'>Description</label>
              <input
                type='text'
                name='description'
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder='Create a full description'
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor='difficulty'>Difficulty</label>
              <input
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
                  Image 1
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
                  Image 2
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
                  Image 3
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

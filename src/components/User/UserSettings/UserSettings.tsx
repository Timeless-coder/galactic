import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { getAuth } from 'firebase/auth'
import toast from 'react-hot-toast'

import { useAuth } from '../../../hooks/useAuth'
import { mapFirebaseUser } from '../../../contexts/AuthContext'
import { deleteProfileImageIfNeeded, uploadProfileImage } from '../../../services/firebase/storageService'

import styles from '../../../elements/Form.module.scss'
import linkStyles from './UserSettings.module.scss'

type UserSettingsFormData = {
  newEmail: string
  newName: string
  newFile: FileList
}

const CurrentUserSettings = () => {
  const { currentUser, setCurrentUser, updateUserAccount } = useAuth()
  const { register, handleSubmit, formState: { errors }, watch } = useForm<UserSettingsFormData>({
    defaultValues: {
      newEmail: currentUser?.email ?? '',
      newName: currentUser?.name ?? '',
    }
  })
  const [loading, setLoading] = useState(false)

  const watchNewFile = watch('newFile')

  const formSubmit = async (data: UserSettingsFormData) => {
    setLoading(true)
    
    try {
      let imageURL = currentUser?.photoURL || ''
      const bufferImage = imageURL
      if (data.newFile?.[0]) {
        await deleteProfileImageIfNeeded(imageURL)
        imageURL = await uploadProfileImage(data.newFile[0], bufferImage)
      }
      await updateUserAccount(data.newEmail, data.newName, imageURL)
      
      const firebaseAuth = getAuth()
      const updatedFirebaseUser = firebaseAuth.currentUser
      if (updatedFirebaseUser) {
        setCurrentUser(mapFirebaseUser(updatedFirebaseUser))
      }
    }
    catch (error) {
      const code = (error as { code?: string }).code
      if (code === 'auth/requires-recent-login') toast.error('Please log out and back in before changing your email')
      else toast.error('Failed to update profile. Please try again.')
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.userSettingsContainer}>

      {currentUser?.providerId === 'google.com' && (
        <h1>
          Update Google account settings at{' '}
          <a
            className={linkStyles.link}
            href='https://myaccount.google.com/'
            target='_blank'
            rel='noreferrer'>
            Google
          </a>{' '}
        </h1>
      )}

      {currentUser?.providerId !== 'google.com' && (
        <div className={styles.formContainer}>

          <h1>Update Your Account Settings</h1>

          <form onSubmit={handleSubmit(formSubmit)}>

            <div className={styles.inputContainer}>
              <label htmlFor='newEmail'>Update Email</label>
              {errors.newEmail && <p className={styles.error}>{errors.newEmail.message}</p>}
              <input
                {...register('newEmail', {
                  required: 'Email is required'
                })}
                id='newEmail'
                type='email'
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor='newName'>Update Display Name</label>
              {errors.newName && <p className={styles.error}>{errors.newName.message}</p>}
              <input
                {...register('newName', {
                  required: 'Display name is required'
                })}
                id='newName'
                type='text'
              />
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.labelContainer}>
                <label className={styles.label} htmlFor='newFile'>
                  <img
                    className={styles.icon}
                    src={currentUser?.photoURL}
                    alt={currentUser?.name}
                  />
                  {watchNewFile?.[0] ? 'Photo selected' : 'Choose a New Photo'}
                </label>
              </div>
              <input
                {...register('newFile')}
                id='newFile'
                type='file'
                accept='image/*'
              />
            </div>

            <div className={styles.inputContainer}>
              <input
                type='submit'
                name='submit'
                value={loading ? 'Updating...' : 'Update Profile'}
                disabled={loading}
              />
            </div>

          </form>
        </div>
      )}
    </div>
  )
}

export default CurrentUserSettings

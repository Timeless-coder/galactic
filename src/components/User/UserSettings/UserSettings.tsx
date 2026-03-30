import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { useAuth } from '../../../hooks/useAuth'
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
      newName: currentUser?.displayName ?? '',
    }
  })
  const [loading, setLoading] = useState(false)

  const watchNewFile = watch('newFile')

  const formSubmit = async (data: UserSettingsFormData) => {
    setLoading(true)
    
    try {
      let imageURL = currentUser?.photoURL || ''
      if (data.newFile?.[0]) {
        await deleteProfileImageIfNeeded(imageURL)
        imageURL = await uploadProfileImage(data.newFile[0], `${data.newEmail}-profileImage`)
      }
      await updateUserAccount(data.newEmail, data.newName, imageURL)
      
      if (currentUser) {
        setCurrentUser({ ...currentUser, email: data.newEmail, displayName: data.newName, photoURL: imageURL })
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
    <section className={styles.userSettingsContainer} aria-labelledby="user-settings-title">
      {currentUser?.providerId === 'google.com' && (
        <header>
          <h1 id="user-settings-title">
            Update Google account settings at{' '}
            <a
              className={linkStyles.link}
              href='https://myaccount.google.com/'
              target='_blank'
              rel='noreferrer'>
              Google
            </a>{' '}
          </h1>
        </header>
      )}

      {currentUser?.providerId !== 'google.com' && (
        <section className={styles.formContainer} aria-labelledby="user-settings-title">
          <header>
            <h1 id="user-settings-title">Update Your Account Settings</h1>
          </header>
          <form onSubmit={handleSubmit(formSubmit)} aria-label="Update your account settings">
            {/**Email */}
            <div className={styles.inputContainer}>
              <label htmlFor='newEmail'>Update Email</label>
              {errors.newEmail && <p className={styles.error}>{errors.newEmail.message}</p>}
              <input
                {...register('newEmail', {
                  required: 'Email is required'
                })}
                id='newEmail'
                type='email'
                aria-invalid={!!errors.newEmail}
              />
            </div>

            {/**DisplayName */}
            <div className={styles.inputContainer}>
              <label htmlFor='newName'>Update Display Name</label>
              {errors.newName && <p className={styles.error}>{errors.newName.message}</p>}
              <input
                {...register('newName', {
                  required: 'Display name is required'
                })}
                id='newName'
                type='text'
                aria-invalid={!!errors.newName}
              />
            </div>

            {/**Profile Image */}
            <div className={styles.inputContainer}>
              <div className={styles.labelContainer}>
                <label className={styles.label} htmlFor='newFile'>
                  <img
                    className={styles.icon}
                    src={currentUser?.photoURL}
                    alt={currentUser?.displayName}
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
                aria-busy={loading}
              />
            </div>
          </form>
        </section>
      )}
    </section>
  )
}

export default CurrentUserSettings

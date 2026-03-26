import { useState } from 'react'

import { useAuth } from '../../../hooks/useAuth'
import { useCart } from '../../../hooks/useCart'
import { deleteProfileImageIfNeeded, uploadProfileImage } from '../../../services/firebase/storageService'

import styles from '../../../elements/Form.module.scss'
import linkStyles from './UserSettings.module.scss'

const CurrentUserSettings = () => {
  const { cartItems } = useCart()
  const cart = [...cartItems]
  const { currentUser, updateUserAccount } = useAuth()
  const [newName, setNewName] = useState(currentUser?.name)
  const [newEmail, setNewEmail] = useState(currentUser?.email)
  const [newFile, setNewFile] = useState<File | null>(null)

  const profileChangeSubmit = async () => {

    try {
      let imageURL = currentUser?.photoURL || ''
      if (newFile) {
        await deleteProfileImageIfNeeded(imageURL)
        imageURL = await uploadProfileImage(newFile)
      }
      await updateUserAccount(
        newEmail!,
        newName!,
        imageURL
      )
      if (cart.length > 0) localStorage.setItem('galacticCart', JSON.stringify(cart));
      window.location.reload();
      
    } catch (err) {
      // handle error
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

          <form onSubmit={e => { e.preventDefault(); profileChangeSubmit(); }}>

            <div className={styles.inputContainer}>
              <label htmlFor='newEmail'>
                Update Email
              </label>
              <input
                type='email'
                name='newEmail'
                value={newEmail}
                onChange={e =>setNewEmail(e.target.value)}
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor='newName'>
                Update DisplayName
              </label>
              <input
                type='text'
                name='newName'
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
            </div>

            <div className={styles.inputContainer}>                  
              <div className={styles.labelContainer}>
                <label
                  className={styles.label}
                  htmlFor='file'>
                  <img
                    className={styles.icon}
                    src={currentUser?.photoURL}
                    alt={currentUser?.name}
                  />
                  Choose a New Photo
                </label>
              </div>
              <input
                id='file'
                type='file'
                name='newFile'
                accept='image/*'
                onChange={e => setNewFile(e.target.files ? e.target.files[0] : null)}
              />
            </div>

            <div className={styles.inputContainer}>
              <input
                type='submit'
                name='submit'
                value='Update Profile'
              />
            </div>

          </form>
        </div>
      )}
    </div>
  )
}

export default CurrentUserSettings

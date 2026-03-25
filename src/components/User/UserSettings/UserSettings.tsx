import { useState } from 'react'
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

import { useAuth } from '../../../hooks/useAuth'
import { useCart } from '../../../hooks/useCart'

import styles from '../../../elements/Form.module.scss'
import linkStyles from './UserSettings.module.scss'

const MySettings = () => {
  const { cartItems } = useCart()
  const cart = [...cartItems]
  const { currentUser, updateUserAccount } = useAuth()
  const storage = getStorage()
  const [newName, setNewName] = useState(currentUser?.name)
  const [newEmail, setNewEmail] = useState(currentUser?.email)
  const [newFile, setNewFile] = useState<File | null>(null)

  const profileChangeSubmit = async () => {

    try {
      let imageURL = currentUser?.photoURL || ''
      if (newFile) {
        // Delete old image if not default
        if (currentUser?.photoURL && !currentUser.photoURL.includes('Anonymous.jpg')) {
          try {
            const oldImageRef = ref(storage, currentUser.photoURL);
            await deleteObject(oldImageRef);
          } catch (err) {
            // Ignore if image doesn't exist or can't be deleted
          }
        }
        // Upload new image
        const now = Date.now().toString();
        const imageRef = ref(storage, `profileImages/${now}_${newFile.name}`);
        await uploadBytes(imageRef, newFile);
        imageURL = await getDownloadURL(imageRef);
      }
      await updateUserAccount(
        newEmail!,
        newName!,
        imageURL
      )
      if (cart.length > 0) localStorage.setItem('galacticCart', JSON.stringify(cart));
      setTimeout(() => {
        window.location.reload();
      }, 3000);
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

export default MySettings

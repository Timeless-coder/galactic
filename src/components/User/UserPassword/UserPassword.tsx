import { useState } from 'react'

import { useAuth } from '../../../hooks/useAuth'

import styles from '../../../elements/Form.module.scss'
import linkStyles from '../UserSettings/UserSettings.module.scss'

const PasswordReset = () => {
  const { currentUser, updatePassword } = useAuth()

  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')

  const passwordChangeSubmit = () => {
    try {
      if (newPassword !== newPasswordConfirm) throw new Error('Passwords must match')

      updatePassword(newPassword)
      .then(() => {
        console.log("Placeholder")
      })
      .catch(err => {
        console.error('Password update error:', err)
      })
      .finally(() => {
        return setTimeout(() => {
          setNewPassword('')
          setNewPasswordConfirm('')
        }, 3000)
      })
    } catch (err) {
      console.error('Password update error:', err)
    }
  }
  return (
    <div className={styles.userSettingsContainer}>

      {currentUser?.providerId === 'google.com' && (
        <h1>
          Update Google account password at{' '}
          <a
            className={linkStyles.link}
            href='https://myaccount.google.com/'
            target='_blank'
            rel='noreferrer'>
            Google
          </a>{' '}
        </h1>
      )}

      {!currentUser?.providerId && (
        <div className={styles.formContainer}>

          <form onSubmit={passwordChangeSubmit}>

          <h1>Update Your Password</h1>

            <div className={styles.inputContainer}>
              <label htmlFor='newPassword'>
                New Password
              </label>
              <input
                type='password'
                name='newPassword'
                value={newPassword}
                onChange={e =>setNewPassword(e.target.value)}
                placeholder='********'
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor='newPasswordConfirm'>
                Confirm New Password
              </label>
              <input
                type='password'
                name='newPasswordConfirm'
                value={newPasswordConfirm}
                onChange={e => setNewPasswordConfirm(e.target.value)}
                placeholder='********'
              />
            </div>

            <div className={styles.inputContainer}>
              <input
                type='submit'
                name='submit'
                value='Update Password'
              />
            </div>

          </form>
        </div>
      )}
    </div>
  )
}

export default PasswordReset

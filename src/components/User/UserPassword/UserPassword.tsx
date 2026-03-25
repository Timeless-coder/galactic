import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

import { useAuth } from '../../../contexts/AuthContext'
import { setError, setMessage, clearError, clearMessage } from '../../../redux/flashSlice'

import styles from '../../../elements/Form.module.scss'
import linkStyles from '../UserSettings/UserSettings.module.scss'

const PasswordReset = () => {
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors: hookFormErrors } } = useForm()
  const { currentUser, updatePassword } = useAuth()

  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')

  const passwordChangeSubmit = () => {
    dispatch(clearError())
    dispatch(clearMessage())
    try {
      if (newPassword !== newPasswordConfirm) return dispatch(setError('Passwords much match'))
      updatePassword(newPassword)
      .then(() => {
        dispatch(setMessage('Your password has been successfully updated'))
      })
      .catch(err => {
        dispatch(setError(err.message))
      })
      .finally(() => {
        return setTimeout(() => {
          dispatch(clearMessage())
          setNewPassword('')
          setNewPasswordConfirm('')
        }, 3000)
      })
    } catch (err) {
      dispatch(setError(err.message))
    }
  }
  return (
    <>
      <div className={styles.userSettingsContainer}>

        {currentUser.data().providerId === 'google.com' && (
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

        {!currentUser.data().providerId && (
          <div className={styles.formContainer}>

            <form onSubmit={handleSubmit(passwordChangeSubmit)}>

            <h1>Update Your Password</h1>

              <div className={styles.inputContainer}>
                <label htmlFor='newPassword'>
                  New Password
                </label>
                {hookFormErrors.newPassword && <p className={styles.error}>{hookFormErrors.newPassword.message}</p>}
                <input
                  {...register('newPassword', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must have minimum of 8 characters'
                  }
                  })}
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
                {hookFormErrors.newPasswordConfirm && <p className={styles.error}>{hookFormErrors.newPasswordConfirm.message}</p>}
                <input
                  {...register('newPasswordConfirm', {
                  required: 'Confirm Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must have minimum of 8 characters'
                  }
                  })}
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
    </>
  )
}

export default PasswordReset

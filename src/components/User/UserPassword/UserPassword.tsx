import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { useAuth } from '../../../hooks/useAuth'

import styles from '../../../elements/Form.module.scss'
import linkStyles from '../UserSettings/UserSettings.module.scss'
import { Link } from 'react-router'

type UserPasswordResetFormData = {
  newPassword: string
  newPasswordConfirm: string
}

const UserPasswordReset = () => {
  const { currentUser, updatePassword } = useAuth()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, watch, reset, trigger } = useForm<UserPasswordResetFormData>()

  const formSubmit = async (data: UserPasswordResetFormData) => {
    setLoading(true)
    try {
      await updatePassword(data.newPassword)
      toast.success('Password updated successfully!')
      reset()
    }
    catch (err: any) {
      console.error('Password update error:', err.message)
      toast.error(`Something went wrong: ${err.message}`)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.userSettingsContainer}>
      {!currentUser && <Link to='/auth'>Log in to change password</Link>}
      {currentUser?.providerId === 'google.com' && (
        <header>
          <p style={{ fontSize: "20px" }}>
            Update Google account password at{' '}
            <a
              className={linkStyles.link}
              href='https://myaccount.google.com/'
              target='_blank'
              rel='noreferrer'>
              Google
            </a>{' '}
          </p>
        </header>
      )}

      {currentUser?.providerId !== 'google.com' && (
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit(formSubmit)} aria-label="Update password form">
            <header>
              <h1>Update Your Password</h1>
            </header>

            {/**Password */}
            <div className={styles.inputContainer}>
              <label htmlFor='newPassword'>New Password</label>
              {errors.newPassword && <p className={styles.error}>{errors.newPassword.message}</p>}
              <input
                {...register('newPassword', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must have a minimum of 6 characters'
                  }
                })}
                id='newPassword'
                type='password'
                placeholder='********'
                onChange={() => trigger('newPasswordConfirm')}
              />
            </div>

            {/**Confirm Password */}
            <div className={styles.inputContainer}>
              <label htmlFor='newPasswordConfirm'>Confirm New Password</label>
              {errors.newPasswordConfirm && <p className={styles.error}>{errors.newPasswordConfirm.message}</p>}
              <input
                {...register('newPasswordConfirm', {
                  required: 'Please confirm your new password',
                  validate: value => value === watch('newPassword') || 'Passwords do not match'
                })}
                id='newPasswordConfirm'
                type='password'
                placeholder='********'
              />
            </div>
            <div className={styles.inputContainer}>
              <input
                type='submit'
                name='submit'
                value={loading ? 'Updating...' : 'Update Password'}
                disabled={loading}

              />
            </div>
          </form>
        </div>
      )}
    </section>
  )
}

export default UserPasswordReset

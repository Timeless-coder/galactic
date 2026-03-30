import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { useAuth } from '../../../hooks/useAuth'

import styles from '../../../elements/Form.module.scss'
import linkStyles from '../UserSettings/UserSettings.module.scss'

type UserPasswordFormData = {
  newPassword: string
  newPasswordConfirm: string
}

const PasswordReset = () => {
  const { currentUser, updatePassword } = useAuth()
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<UserPasswordFormData>()

  const formSubmit = async (data: UserPasswordFormData) => {
    try {
      await updatePassword(data.newPassword)
      toast.success('Password updated successfully!')
      reset()
    }
    catch (err: any) {
      console.error('Password update error:', err)
      toast.error('Failed to update password. Please try again.')
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

      {currentUser?.providerId !== 'google.com' && (
        <div className={styles.formContainer}>

          <form onSubmit={handleSubmit(formSubmit)}>

            <h1>Update Your Password</h1>

            <div className={styles.inputContainer}>
              <label htmlFor='newPassword'>New Password</label>
              {errors.newPassword && <p className={styles.error}>{errors.newPassword.message}</p>}
              <input
                {...register('newPassword', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must have a minimum of 8 characters'
                  }
                })}
                id='newPassword'
                type='password'
                placeholder='********'
              />
            </div>

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

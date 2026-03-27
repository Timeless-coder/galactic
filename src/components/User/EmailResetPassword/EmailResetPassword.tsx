import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { useAuth } from '../../../hooks/useAuth'

import styles from '../../../elements/Form.module.scss'

type EmailResetFormData = {
  email: string
}

const EmailResetPassword = () => {
  const { sendPasswordResetEmail } = useAuth()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<EmailResetFormData>()

  const formSubmit = async (data: EmailResetFormData) => {
    setLoading(true)

    try {
      await sendPasswordResetEmail(data.email)
      toast.success('Password reset email sent!')
      reset()
    }
    catch (err: any) {
      console.error(err)
      toast.error('Failed to send reset email. Please check the address and try again.')
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h2>Request Password Reset Email</h2>

      <form onSubmit={handleSubmit(formSubmit)}>

        <div className={styles.inputContainer}>
          <label htmlFor='email'>Email</label>
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}
          <input
            {...register('email', {
              required: 'Email is required'
            })}
            id='email'
            type='email'
            placeholder='example@xyz.com'
          />
        </div>

        <div className={styles.inputContainer}>
          <input type='submit' value={loading ? 'Sending...' : 'Submit'} disabled={loading} />
        </div>

      </form>
    </>
  )
}

export default EmailResetPassword
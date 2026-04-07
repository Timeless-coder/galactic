import React, {useState} from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { useAuth } from '../../hooks/useAuth'

import CustomButton from '../../elements/CustomButton/CustomButton'

import styles from '../../elements/Form.module.scss'

type EmailResetPasswordProps = {
  setHasAccount: React.Dispatch<React.SetStateAction<boolean>>,
  setLostPassword: React.Dispatch<React.SetStateAction<boolean>>
}

type EmailResetData = {
  email: string
}

const EmailResetPassword = ({ setHasAccount, setLostPassword }: EmailResetPasswordProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EmailResetData>()
  const { sendPasswordResetEmail } = useAuth()
  const [loading, setLoading] = useState(false)
  
  const handleFoundEmail = () => {
    setLostPassword(false)
    setHasAccount(true)
  }

  const formSubmit = async({ email }: EmailResetData) => {
    try {
      setLoading(true)
      
      await sendPasswordResetEmail(email)
      toast.success(`Password reset link sent successfully to ${email}. Check your inbox.`)
      
      reset()
      setHasAccount(true)
      setLostPassword(false)
    }
    catch (err: any){
      console.error(err.message)
      toast.error('Unable to send a password reset email right now. Please try again.')    }
    finally {
      setLoading(false)
    }
  }
  return (
    <section>
      <header>
        <h2>Request Password Reset Email</h2>
      </header>

      <aside className={styles.status}>
        <p>Found Your Email?</p>
        <CustomButton onClick={handleFoundEmail} layout='center'>Sign In</CustomButton>
      </aside>

      <form onSubmit={handleSubmit(formSubmit)}>
        <div className={styles.inputContainer}>
          <label htmlFor='password-reset-email'>Email</label>
          {errors.email && (
          <p id='password-reset-email-error' className={styles.error} role='alert'>
            {errors.email.message}
          </p>
          )}
          <input
            {...register('email', { required: 'Email is required' })}
            type='email'
            placeholder='example@xyz.com'
            id='password-reset-email'
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'password-reset-email-error' : undefined}
          />
        </div>

        <div className={styles.inputContainer}>
          <CustomButton disabled={loading} type="submit" name="submit" layout='center' width='100%'>Submit</CustomButton>
        </div>
      </form>
  </section>
  )
}

export default EmailResetPassword
import React from 'react'
import { useNavigate } from 'react-router'
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
  const navigate = useNavigate()
  const { sendPasswordResetEmail } = useAuth()
  
  const handleFoundEmail = () => {
    setLostPassword(false)
    setHasAccount(true)
  }

  const formSubmit = async({ email }: EmailResetData) => {
    try {
      await sendPasswordResetEmail(email)
      toast.success('Password reset email sent successfully.')
      
      reset()
      navigate('/auth')
    }
    catch (err: any){
      console.error(err.message)
      toast.error(`${err.message ?? err ?? 'An error occurred'} - Please try again`)
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
          <label htmlFor='email'>Email</label>
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}
          <input
            {...register('email', { required: 'Email is required' })}
            type='email'
            placeholder='example@xyz.com'
          />
        </div>

        <div className={styles.inputContainer}>
          <CustomButton type="submit" name="submit" layout='center' width='100%'>Submit</CustomButton>
        </div>
      </form>
  </section>
  )
}

export default EmailResetPassword
import React, { useState } from 'react'
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
  const [email, setEmail] = useState('')
  
  const handleFoundEmail = () => {
    setLostPassword(false)
    setHasAccount(true)
  }
  const formSubmit = async() => {
    try {
      await sendPasswordResetEmail(email)
      reset()
      toast.success('Password reset email sent successfully.')
      navigate('/auth')
    }
    catch (err: any){
      console.error(err.message)
      toast.error(`${err.message} - Please try again`)
    }
  }
  return (
    <section>
      <header>
        <h2>Request Password Reset Email</h2>
      </header>

      <aside className={styles.status}>
        <p>Found Your Email?</p>
        <button type="button" onClick={handleFoundEmail}>
          <CustomButton>Sign In</CustomButton>
        </button>
      </aside>

      <form onSubmit={handleSubmit(formSubmit)}>
        <div className={styles.inputContainer}>
          <label htmlFor='email'>Email</label>
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}
          <input
            {...register('email', { required: 'Email is required' })}
            type='email'
            name='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='example@xyz.com'
          />
        </div>

        <div className={styles.inputContainer}>
          <button type="submit" name="submit">Submit</button>
        </div>
      </form>
  </section>
  )
}

export default EmailResetPassword
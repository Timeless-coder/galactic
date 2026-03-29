import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

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
  const [email, setEmail] = useState('')
  const handleFoundEmail = () => {
    setLostPassword(false)
    setHasAccount(true)
  }
  const formSubmit = async() => {
    try {
      await sendPasswordResetEmail(email)
      reset()
    }
    catch (err: any){
      console.error(err)
    }
  }
  return (
    <>

      <h2>Request Password Reset Email</h2>

      <div className={styles.status}>
          <p>Found Your Email?</p>
          <div onClick={handleFoundEmail}>
            <CustomButton>Sign In</CustomButton>
          </div>
      </div>

      <form onSubmit={handleSubmit(formSubmit)}>

        <div className={styles.inputContainer}>
          <label htmlFor='email'>Email</label>
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}
          <input
             {...register('email', {
              required: 'Email is required'
            })}
            type='email'
            name='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='example@xyz.com'
          />
        </div>

        <div className={styles.inputContainer}>
          <input
            type='submit'
            name='submit'
            value='Submit'
          />
        </div>

      </form>
    </>
  )
}

export default EmailResetPassword
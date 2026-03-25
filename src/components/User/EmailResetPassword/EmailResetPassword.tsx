import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

import { useAuth } from '../../../contexts/AuthContext'
import { clearError, setError, setMessage, clearMessage } from '../../../redux/flashSlice'

import CustomButton from '../../../elements/CustomButton/CustomButton'

import styles from '../../../elements/Form.module.scss'

const EmailResetPassword = ({ setHasAccount, setLostPassword }) => {
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors: hookFormErrors } } = useForm()
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const handleFoundEmail = () => {
    setLostPassword(false)
    setHasAccount(true)
  }
  const formSubmit = async() => {
    try {
      dispatch(clearError())
      await resetPassword(email)
      dispatch(setMessage(`An email has been sent to ${email}`))
      setTimeout(() => {
        dispatch(clearMessage())
      }, 3000)
    }
    catch (err){
      dispatch(setError(err.message) || 'Something went wrong. Email was not sent.')
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
          {hookFormErrors.email && <p className={styles.error}>{hookFormErrors.email.message}</p>}
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
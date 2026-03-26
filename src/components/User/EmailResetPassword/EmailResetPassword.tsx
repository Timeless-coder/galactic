import React, { useState } from 'react'

import { useAuth } from '../../../hooks/useAuth'

import styles from '../../../elements/Form.module.scss'

const EmailResetPassword = () => {
  const { sendPasswordResetEmail } = useAuth()
  const [email, setEmail] = useState('')
 
  const submitEmailPassResetRequest = async(e: React.SubmitEvent) => {
    e.preventDefault()

    try {
      await sendPasswordResetEmail(email)
    }
    catch (err){
      console.error('placeholder error:', err)
    }
  }
  return (
    <>
      <h2>Request Password Reset Email</h2>

      <form onSubmit={submitEmailPassResetRequest}>

        <div className={styles.inputContainer}>
          <label htmlFor='email'>Email</label>
          <input type='email' name='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='example@xyz.com'/>
        </div>

        <div className={styles.inputContainer}>
          <input type='submit' name='submit' value='Submit'/>
        </div>

      </form>
    </>
  )
}

export default EmailResetPassword
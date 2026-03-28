import { Card, Form, Button } from 'react-bootstrap'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { useAuth } from '../contexts/AuthContext'
import { setError, setMessage, clearMessage } from '../redux/flashSlice'

const ForgotPassword = () => {
  const dispatch = useDispatch()
  const emailRef = useRef()
  const { resetPassword } = useAuth()
  const [loading, setLoading] = useState(false)
  const message = useSelector(message)
  const error = useSelector(error)

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      dispatch(setMessage(''))
      dispatch(setError(''))
      setLoading(true)
      await resetPassword(emailRef.current.value)
      dispatch(setMessage('Check your inbox for further instructions'))
      setTimeout(() => {
        dispatch(clearMessage)
      }, 3000);
    }
    catch(err) {
      dispatch(setError(err.message || 'Something went wrong with password reset attempt'))
    }
    setLoading(false)
  }
  
  return (
    <>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Password Reset</h2>
          <p>We'll send you a link to reset your password</p>
          <Form onSubmit={handleSubmit}>
            <Form.Group id='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' ref={emailRef} required />
            </Form.Group>
            <Button type='submit' className='w-100' disabled={loading}>Send Email</Button>
          </Form>
          <div className="w-100 text-center mt-2">
            Or <Link to='/signupsignin'>Log In</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        No Account?  <Link to='/signup'>Sign Up</Link>
      </div>
    </>
  )
}

export default ForgotPassword
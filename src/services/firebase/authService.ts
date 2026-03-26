import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth, updateEmail,
  updateProfile, updatePassword, sendPasswordResetEmail} from 'firebase/auth'
import type { ActionCodeSettings } from 'firebase/auth'

import { auth } from '../firebase/firebaseConfig'
import type { User } from '../../types/user'

const mapFirebaseUser = (firebaseUser: any): User => ({
  id: firebaseUser.uid,
  name: firebaseUser.displayName || '',
  email: firebaseUser.email || '',
  photoURL: firebaseUser.photoURL || '',
  role: firebaseUser.role || 'user', // Default role is 'user'
  providerId: firebaseUser.providerData?.[0]?.providerId || 'unknown',
})

const actionCodeSettings: ActionCodeSettings = {
  url: 'http://localhost:5173/auth', // or your deployed URL
  handleCodeInApp: false, // typical for password reset
}

export const loginService = async (email: string, password: string): Promise<User> => {
  const result = await signInWithEmailAndPassword(auth, email, password)
  return mapFirebaseUser(result.user)
}

export const signupWithEmailAndPasswordService = async (email: string, password: string): Promise<User> => {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  return mapFirebaseUser(result.user)
}

export const signinWithGoogleService = async (): Promise<User> => {
  const result = await signInWithPopup(auth, new GoogleAuthProvider())
  return mapFirebaseUser(result.user)
}

export const logoutService = async (): Promise<void> => {
  await auth.signOut()
}

export const updateAuthProfileService = async (email: string, displayName: string, photoURL: string): Promise<void> => {
  const firebaseAuth = getAuth()
  const fireAuthAccount = firebaseAuth.currentUser
  if (!fireAuthAccount) throw new Error('No authenticated user')
  await updateEmail(fireAuthAccount, email)
  await updateProfile(fireAuthAccount, { displayName, photoURL })
}

export const updatePasswordService = async (newPassword: string): Promise<void> => {
  const firebaseAuth = getAuth()
  const fireAuthAccount = firebaseAuth.currentUser

  if (!fireAuthAccount) throw new Error('No authenticated user')
    
  try {
    await updatePassword(fireAuthAccount, newPassword)
  }
  catch (error) {
    console.log('Password update error:', error)
    throw error
  }
}

export const sendPasswordResetEmailService = async (email: string): Promise<void> => {
  const firebaseAuth = getAuth()
  await sendPasswordResetEmail(firebaseAuth, email, actionCodeSettings)
}
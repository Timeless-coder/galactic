import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth, updateEmail, updateProfile } from 'firebase/auth'

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
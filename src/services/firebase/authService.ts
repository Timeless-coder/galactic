import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth, updateEmail,
  updateProfile, updatePassword, sendPasswordResetEmail} from 'firebase/auth'

import type { ActionCodeSettings, User as FirebaseUser } from 'firebase/auth'
import type { User } from '../../types/user'
import { Role } from '../../types/user'

import { auth } from '../firebase/firebaseConfig'
import { db } from './firebaseConfig'
import { collection, getDocs, query, where } from 'firebase/firestore'

const mapFirebaseUser = (firebaseUser: any ) => ({
  id: firebaseUser.uid,
  name: firebaseUser.displayName || '',
  email: firebaseUser.email || '',
  photoURL: firebaseUser.photoURL || '',
  providerId: firebaseUser.providerData?.[0]?.providerId || 'unknown',
})

const actionCodeSettings: ActionCodeSettings = {
  url: 'http://localhost:5173/auth', // or your deployed URL
  handleCodeInApp: false, // typical for password reset
}

export const getRole = async (email: string) => {
  const q = query(collection(db, 'adminEmails'), where('email', '==', email));
  const snapshot = await getDocs(q);
  return snapshot.empty ? Role.User : Role.Admin;
};

const createUserWithRole = async (firebaseUser: FirebaseUser ): Promise<User> => {
  if (!firebaseUser.email) throw new Error('User email is missing');
  const userWithoutRole = mapFirebaseUser(firebaseUser)
  const role = await getRole(firebaseUser.email!)
  return { ...userWithoutRole, role}
}

export const loginService = async (email: string, password: string): Promise<User> => {
  const result = await signInWithEmailAndPassword(auth, email, password)
  return await createUserWithRole(result.user)
}

export const signupWithEmailAndPasswordService = async (name: string, email: string, password: string, photoURL: string): Promise<User> => {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  if (result.user) {
    await updateProfile(result.user, { displayName: name, photoURL })
  }
  return await createUserWithRole(result.user)
}

export const signinWithGoogleService = async (): Promise<User> => {
  const result = await signInWithPopup(auth, new GoogleAuthProvider())
  return createUserWithRole(result.user)
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
    
  await updatePassword(fireAuthAccount, newPassword)
}

export const sendPasswordResetEmailService = async (email: string): Promise<void> => {
  const firebaseAuth = getAuth()
  await sendPasswordResetEmail(firebaseAuth, email, actionCodeSettings)
}
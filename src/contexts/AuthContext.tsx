import React, { createContext, useEffect, useState } from "react"

import { type User } from '../types/user'

import { loginService, signupWithEmailAndPasswordService, signinWithGoogleService, logoutService, updateAuthProfileService, updatePasswordService, sendPasswordResetEmailService } from '../services/firebase/authService'
import { auth, db } from '../services/firebase/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'

export type AuthContextType = {
  currentUser: User | null
  loading: boolean
  setCurrentUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<User>
  signupWithEmailAndPassword: (name: string, email: string, password: string, photoURL: string) => Promise<User>
  signinWithGoogle: () => Promise<User>
  updateUserAccount: (email: string, displayName: string, photoURL: string) => Promise<void>
  updatePassword: (newPassword: string) => Promise<void>
  logout: () => Promise<void>
  sendPasswordResetEmail: (email: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userSnap = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userSnap.exists()) {
            setCurrentUser({ id: userSnap.id, ...userSnap.data() } as User)
          } else {
            setCurrentUser(null)
          }
        } catch {
          setCurrentUser(null)
        }
      } else {
        setCurrentUser(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])
  
  const signupWithEmailAndPassword = async (name: string, email: string, password: string, photoURL: string): Promise<User> => {
    try {
      const user = await signupWithEmailAndPasswordService(name, email, password, photoURL)
      setCurrentUser(user)
      return user
    } catch (error) {
      console.log('Sign up error:', error)
      throw error
    }
  }

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const user = await loginService(email, password)
      setCurrentUser(user)
      return user
    } catch (error) {
      console.log('Login error:', error)
      throw error
    }
  }

  const signinWithGoogle = async (): Promise<User> => {
    try {
      const user = await signinWithGoogleService()
      setCurrentUser(user)
      return user
    } catch (error) {
      console.log('Google sign-in error:', error)
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await logoutService()
      setCurrentUser(null)
    } catch (error) {
      console.log('Logout error:', error)
      throw error
    }
  }

  const updateUserAccount = async (email: string, displayName: string, photoURL: string) => {
    try {
      await updateAuthProfileService(email, displayName, photoURL)
    }
    catch(error) {
      console.error(error)
      throw error
    }
    
  }

  const updatePassword = async (newPassword: string) => {
    try {
      await updatePasswordService(newPassword)
    } catch (error) {
      console.log('Password update error:', error)
      throw error
    }
  }

  const sendPasswordResetEmail = async (email: string) => {
    try {
      await sendPasswordResetEmailService(email)
    } catch (error) {
      console.log('Password reset email error:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, setCurrentUser, login, signupWithEmailAndPassword, signinWithGoogle, logout, updateUserAccount, updatePassword, sendPasswordResetEmail }}>
      {children}
    </AuthContext.Provider>
  )
}
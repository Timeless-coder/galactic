import React, { createContext, useEffect, useMemo, useState } from "react"

import { type User } from '../types/user'

import { loginService, signupWithEmailAndPasswordService, signinWithGoogleService, logoutService, updateAuthProfileService, updatePasswordService, sendPasswordResetEmailService } from '../services/firebase/authService'
import { auth, db } from '../services/firebase/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import toast from "react-hot-toast"

export type AuthContextType = {
  currentUser: User | null
  loading: boolean
  setCurrentUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<User>
  signupWithEmailAndPassword: (displayName: string, email: string, password: string, photoURL: string) => Promise<User>
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
        }
        catch(err: any) {
          console.error(err.message)
          toast.error(err.message ?? err ?? "Something went")
          setCurrentUser(null)
        }
      } else {
        setCurrentUser(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])
  
  const signupWithEmailAndPassword = async (displayName: string, email: string, password: string, photoURL: string): Promise<User> => {
    try {
      return await signupWithEmailAndPasswordService(displayName, email, password, photoURL)
    }
    catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  const login = async (email: string, password: string): Promise<User> => {
    try {
      return await loginService(email, password)
    }
    catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const signinWithGoogle = async (): Promise<User> => {
    try {
      return await signinWithGoogleService()
    }
    catch (error) {
      console.error('Google sign-in error:', error)
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await logoutService()
      setCurrentUser(null)
    }
    catch (error) {
      console.error('Logout error:', error)
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
    }
    catch (error) {
      console.error('Password update error:', error)
      throw error
    }
  }

  const sendPasswordResetEmail = async (email: string) => {
    try {
      await sendPasswordResetEmailService(email)
    }
    catch (error) {
      console.error('Password reset email error:', error)
      throw error
    }
  }

  const contextValue = useMemo(() => ({
    currentUser, loading, setCurrentUser, login, signupWithEmailAndPassword,
    signinWithGoogle, logout, updateUserAccount, updatePassword, sendPasswordResetEmail
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [currentUser, loading])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}
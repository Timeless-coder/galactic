import React, { createContext, useEffect, useState } from "react"

import type { User } from '../types/user'

import { loginService, signupWithEmailAndPasswordService, signinWithGoogleService, logoutService, updateAuthProfileService, updatePasswordService, sendPasswordResetEmailService } from '../services/firebase/authService'
import { auth } from '../services/firebase/firebaseConfig' // only for onAuthStateChanged listener

export type AuthContextType = {
  currentUser: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  signUpWithEmailAndPassword: (email: string, password: string) => Promise<User>
  signInWithGoogle: () => Promise<User>
  updateUserAccount: (email: string, displayName: string, photoURL: string) => Promise<void>
  updatePassword: (newPassword: string) => Promise<void>
  logout: () => Promise<void>
  sendPasswordResetEmail: (email: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper to map Firebase user to our User type
const mapFirebaseUser = (firebaseUser: any): User => ({
  id: firebaseUser.uid,
  name: firebaseUser.displayName || "",
  email: firebaseUser.email || "",
  photoURL: firebaseUser.photoURL || "",
  role: firebaseUser.role || 'admin', // Default role, can be enhanced to fetch from Firestore if needed
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser(mapFirebaseUser(firebaseUser))
      } else {
        setCurrentUser(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])
  
  const signupWithEmailAndPassword = async (email: string, password: string): Promise<User> => {
    try {
      const user = await signupWithEmailAndPasswordService(email, password)
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
    await updateAuthProfileService(email, displayName, photoURL)
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
    <AuthContext.Provider value={{ currentUser, loading, login, signUpWithEmailAndPassword: signupWithEmailAndPassword, signInWithGoogle: signinWithGoogle, logout, updateUserAccount, updatePassword, sendPasswordResetEmail }}>
      {children}
    </AuthContext.Provider>
  )
}
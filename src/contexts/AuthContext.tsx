import React, { createContext, useEffect, useState } from "react"

import {
  loginService,
  signupWithEmailAndPasswordService,
  signinWithGoogleService,
  logoutService,
} from '../services/firebase/authService'
import { auth } from '../services/firebase/firebaseConfig'
import type { User } from '../types/user'

export type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  signUpWithEmailAndPassword: (email: string, password: string) => Promise<User>
  signInWithGoogle: () => Promise<User>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper to map Firebase user to our User type
const mapFirebaseUser = (firebaseUser: any): User => ({
  id: firebaseUser.uid,
  name: firebaseUser.displayName || "",
  email: firebaseUser.email || "",
  photoURL: firebaseUser.photoURL || "",
  role: firebaseUser.role || 'user', // Default role, can be enhanced to fetch from Firestore if needed
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(mapFirebaseUser(firebaseUser))
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])
  
  const signupWithEmailAndPassword = async (email: string, password: string): Promise<User> => {
    try {
      const user = await signupWithEmailAndPasswordService(email, password)
      setUser(user)
      return user
    } catch (error) {
      console.log('Sign up error:', error)
      throw error
    }
  }

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const user = await loginService(email, password)
      setUser(user)
      return user
    } catch (error) {
      console.log('Login error:', error)
      throw error
    }
  }

  const signinWithGoogle = async (): Promise<User> => {
    try {
      const user = await signinWithGoogleService()
      setUser(user)
      return user
    } catch (error) {
      console.log('Google sign-in error:', error)
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await logoutService()
      setUser(null)
    } catch (error) {
      console.log('Logout error:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signUpWithEmailAndPassword: signupWithEmailAndPassword, signInWithGoogle: signinWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
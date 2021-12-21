import React, { useContext, useState, useEffect } from "react"
import { auth } from "../firebase"
import * as Auth from "firebase/auth";

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  function signup(email, password) {
    return Auth.createUserWithEmailAndPassword(auth,email, password)
  }

  function login(email, password) {
      console.log(email,password)
    return Auth.signInWithEmailAndPassword(auth ,email, password)
  }

  function logout() {
    return Auth.signOut()
  }

  function resetPassword(email) {
    return Auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email)
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }

  useEffect(() => {
    const unsubscribe = Auth.onAuthStateChanged(auth,user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
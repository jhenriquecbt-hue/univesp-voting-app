import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  auth, 
  db 
} from '../firebase'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore'

const FirebaseContext = createContext()

export function FirebaseProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signUp = async (email, password, name) => {
    // Validação de domínio
    if (!email.endsWith('@aluno.univesp.br')) {
      throw new Error('Apenas e-mails @aluno.univesp.br são permitidos')
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // Criar perfil no Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: userCredential.user.email,
      name: name,
      createdAt: serverTimestamp()
    })

    return userCredential
  }

  const signIn = async (email, password) => {
    // Validação de domínio
    if (!email.endsWith('@aluno.univesp.br')) {
      throw new Error('Apenas e-mails @aluno.univesp.br são permitidos')
    }

    return await signInWithEmailAndPassword(auth, email, password)
  }

  const signOutUser = async () => {
    await signOut(auth)
  }

  // Projects
  const createProject = async (projectData) => {
    const projectRef = collection(db, 'projects')
    return await addDoc(projectRef, {
      ...projectData,
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp()
    })
  }

  const getProjects = async () => {
    const projectsRef = collection(db, 'projects')
    const snapshot = await getDocs(projectsRef)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  // Votes
  const createVote = async (projectId) => {
    const voteRef = collection(db, 'votes')
    return await addDoc(voteRef, {
      userId: auth.currentUser.uid,
      projectId: projectId,
      createdAt: serverTimestamp()
    })
  }

  const getUserVotes = async () => {
    const votesRef = collection(db, 'votes')
    const q = query(votesRef, where('userId', '==', auth.currentUser.uid))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  const deleteUserVotes = async () => {
    const votesRef = collection(db, 'votes')
    const q = query(votesRef, where('userId', '==', auth.currentUser.uid))
    const snapshot = await getDocs(q)
    
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref))
    await Promise.all(deletePromises)
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut: signOutUser,
    createProject,
    getProjects,
    createVote,
    getUserVotes,
    deleteUserVotes
  }

  return (
    <FirebaseContext.Provider value={value}>
      {!loading && children}
    </FirebaseContext.Provider>
  )
}

export function useFirebase() {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider')
  }
  return context
}

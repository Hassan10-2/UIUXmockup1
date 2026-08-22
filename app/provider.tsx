"use client"
import React, { useEffect, useState, } from 'react'
import axios from 'axios'
import { useUser } from '@clerk/nextjs'
import { UserDetailContext } from '@/context/UserDetailContext'

function Provider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser()


  const [userDetail,setUserDetail]=useState()
  useEffect(() => {
    if (!isLoaded) return

    console.log('Signed in:', isSignedIn)
    console.log('User info:', user)
    console.log('User email:', user?.primaryEmailAddress?.emailAddress)
  }, [isLoaded, isSignedIn, user])

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    const createNewUser = async () => {
      try {
        const result = await axios.post('/api/user')
        console.log(result.data);
          setUserDetail(result?.data);
      } catch (error) {
        console.error('Unable to create user:', error)
      }
      
    
    }

    void createNewUser()
  }, [isLoaded, isSignedIn])

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <>{children}</>
    </UserDetailContext.Provider>
  )
}

export default Provider
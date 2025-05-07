// hooks/useRequireAuth.js
import { useContext } from 'react'
import { useRouter } from 'next/router'
import { UserContext } from '../pages/_app'

export default function useRequireAuth() {
  const { user } = useContext(UserContext)
  const router   = useRouter()

  return () => {
    if (!user) {
      router.push('/login')
      return false
    }
    return true
  }
}


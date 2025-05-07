// components/LikeButton.js
import { useContext } from 'react'
import { UserContext } from '../pages/_app'
import useRequireAuth from '../hooks/useRequireAuth'

export default function LikeButton({ itemId }) {
  const { supabase } = useContext(UserContext)
  const requireAuth  = useRequireAuth()

  const handleLike = async () => {
    if (!requireAuth()) return
    const { error } = await supabase
      .from('likes')
      .insert([{ item_id: itemId }])
    if (error) console.error(error)
    else alert('Liked!')
  }

  return <button onClick={handleLike}>♥ Like</button>
}

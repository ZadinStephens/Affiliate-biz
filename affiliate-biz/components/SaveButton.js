// components/SaveButton.js
import { useContext } from 'react'
import { UserContext } from '../pages/_app'
import useRequireAuth from '../hooks/useRequireAuth'

export default function SaveButton({ itemId }) {
  const { supabase } = useContext(UserContext)
  const requireAuth  = useRequireAuth()

  const handleSave = async () => {
    if (!requireAuth()) return
    const { error } = await supabase
      .from('saves')
      .insert([{ product_id: itemId }])
    if (error) console.error(error)
    else alert('Saved!')
  }

  return <button onClick={handleSave}>💾 Save</button>
}

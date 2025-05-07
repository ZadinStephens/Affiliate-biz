// pages/dashboard.js
import { useState, useEffect, useContext } from 'react'
import { UserContext } from './_app'
import useRequireAuth from '../hooks/useRequireAuth'
import VideoEmbed from '../components/VideoEmbed'
import ProductCard from '../components/ProductCard'

export default function Dashboard() {
  const { user, supabase } = useContext(UserContext)
  const requireAuth       = useRequireAuth()

  const [videos, setVideos]             = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [products, setProducts]         = useState([])

  const [embedURL, setEmbedURL]         = useState('')
  const [title, setTitle]               = useState('')
  const [description, setDescription]   = useState('')
  const [imageURL, setImageURL]         = useState('')
  const [affURL, setAffURL]             = useState('')

  useEffect(() => {
    if (user) fetchVideos()
  }, [user])

  async function fetchVideos() {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('influencer_id', user.id)
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    else setVideos(data)
  }

  async function fetchProducts(videoId) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('video_id', videoId)
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    else setProducts(data)
  }

  // Gated creation
  const handleAddVideo = async (e) => {
    e.preventDefault()
    if (!requireAuth()) return
    const { data, error } = await supabase
      .from('videos')
      .insert([{ embed_url: embedURL.trim(), influencer_id: user.id }])
      .select()
      .single()
    if (error) console.error(error)
    else {
      setVideos([data, ...videos])
      setEmbedURL('')
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    if (!requireAuth() || !selectedVideo) return
    const { data, error } = await supabase
      .from('products')
      .insert([{
        video_id: selectedVideo.id,
        title,
        description,
        product_image: imageURL.trim(),
        affiliate_url: affURL.trim()
      }])
      .select()
      .single()
    if (error) console.error(error)
    else {
      setProducts([data, ...products])
      setTitle(''); setDescription(''); setImageURL(''); setAffURL('')
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>

      {/* Add Video */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Add a New Video</h2>
        <form onSubmit={handleAddVideo} style={{ display: 'flex', gap: '.5rem' }}>
          <input
            type="text"
            placeholder="TikTok embed URL"
            value={embedURL}
            onChange={e => setEmbedURL(e.target.value)}
            style={{ flex: 1, padding: '.5rem' }}
            required
          />
          <button type="submit">Create Video</button>
        </form>
      </section>

      {/* Video List */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Your Videos</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {videos.map(v => (
            <div
              key={v.id}
              onClick={() => {
                setSelectedVideo(v)
                fetchProducts(v.id)
              }}
              style={{
                border: selectedVideo?.id === v.id
                  ? '2px solid #0070f3'
                  : '1px solid #ccc',
                padding: '.5rem',
                cursor: 'pointer',
                width: '200px'
              }}
            >
              <VideoEmbed url={v.embed_url} />
            </div>
          ))}
        </div>
      </section>

      {/* Add Product */}
      {selectedVideo && (
        <section style={{ marginBottom: '2rem' }}>
          <h2>Add Product for This Video</h2>
          <form onSubmit={handleAddProduct} style={{ display: 'grid', gap: '.5rem' }}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              style={{ padding: '.5rem' }}
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ padding: '.5rem' }}
            />
            <input
              type="url"
              placeholder="Image URL"
              value={imageURL}
              onChange={e => setImageURL(e.target.value)}
              required
              style={{ padding: '.5rem' }}
            />
            <input
              type="url"
              placeholder="Affiliate URL"
              value={affURL}
              onChange={e => setAffURL(e.target.value)}
              required
              style={{ padding: '.5rem' }}
            />
            <button type="submit">Add Product</button>
          </form>
        </section>
      )}

      {/* Products List */}
      {selectedVideo && (
        <section>
          <h2>Products for This Video</h2>
          <div style={{
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))'
          }}>
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}

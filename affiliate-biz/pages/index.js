// pages/index.js
import Link from 'next/link'
import { supabase } from '../supabaseClient'
import LikeButton from '../components/LikeButton'
import SaveButton from '../components/SaveButton'

export default function Home({ items }) {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Featured Fashion</h1>
      <div
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))'
        }}
      >
        {items.map(item => (
          <div
            key={item.id}
            style={{
              position: 'relative',
              padding: '1rem',
              border: '1px solid #ccc',
              borderRadius: '8px'
            }}
          >
            <Link
              href={`/video/${item.video_id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <img
                src={item.product_image}
                alt={item.title}
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'cover',
                  marginBottom: '.5rem'
                }}
              />
              <h2 style={{ margin: '0 0 .5rem 0' }}>{item.title}</h2>
            </Link>

            <div style={{ display: 'flex', gap: '.5rem' }}>
              <LikeButton itemId={item.id} />
              <SaveButton itemId={item.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const { data: items, error } = await supabase
    .from('products')
    .select('id, video_id, title, product_image')
    .order('created_at', { ascending: false })
    .limit(9)

  return {
    props: {
      items: items || []
    }
  }
}

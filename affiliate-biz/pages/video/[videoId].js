import { useRouter } from 'next/router';
import { supabase } from '../../supabaseClient';
import VideoEmbed from '../../components/VideoEmbed';
import ProductCard from '../../components/ProductCard';

export default function VideoPage({ video, products }) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>As Seen In This Video</h1>
      <VideoEmbed url={video.embed_url} />
      <div style={{
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
        marginTop: '1rem'
      }}>
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { data: video, error: videoError } = await supabase
    .from('videos')
    .select('*')
    .eq('id', params.videoId)
    .single();

  if (videoError) {
    console.error('Video fetch error:', videoError);
    return { notFound: true };
  }

  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('*')
    .eq('video_id', params.videoId);

  if (prodError) console.error('Products fetch error:', prodError);

  return {
    props: {
      video,
      products: products || []
    }
  };
}


export default function VideoEmbed({ url }) {
  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
      <iframe
        src={url.trim()}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%'
        }}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </div>
  );
}



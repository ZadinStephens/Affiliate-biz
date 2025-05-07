// components/ProductCard.js
export default function ProductCard({ product }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <img
        src={product.product_image}
        alt={product.title}
        style={{
          width: '100%',
          maxHeight: '300px',
          objectFit: 'cover',
          marginBottom: '1rem'
        }}
      />
      <h3 style={{ margin: '0 0 .5rem 0' }}>{product.title}</h3>
      <p style={{ margin: '0 0 1rem 0', color: '#555', fontSize: '.9rem' }}>
        {product.description}
      </p>
      <a
        href={product.affiliate_url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          marginTop: 'auto',
          background: '#0070f3',
          color: 'white',
          textAlign: 'center',
          padding: '.5rem',
          borderRadius: '4px',
          textDecoration: 'none'
        }}
      >
        Shop Now
      </a>
    </div>
  );
}

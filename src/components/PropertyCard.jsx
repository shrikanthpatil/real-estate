import { useState } from 'react';
import { MapPin, Maximize2, Bed, Bath, Eye, Share2, Heart } from 'lucide-react';
import { formatPrice, categoryConfig } from '../data/sampleListings';

export default function PropertyCard({ listing, onClick }) {
  const [imageError, setImageError] = useState(false);
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const cat = categoryConfig[listing.category] || {};
  const fallbackImage = `https://placehold.co/900x560/e2e8f0/475569?text=${encodeURIComponent(listing.category || 'Property')}`;

  const specs = [];
  if (listing.bedrooms > 0) specs.push(`${listing.bedrooms} BHK`);
  if (listing.area) specs.push(`${listing.area.toLocaleString()} sq.ft.`);
  if (listing.furnishing) specs.push(listing.furnishing.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase()));

  const shareProperty = async (event) => {
    event.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#property-${listing.id}`;
    const summary = `${listing.title}\nPrice: ${formatPrice(listing.price, 'sell')}\nLocation: ${listing.locality}, ${listing.city}\n${url}`;
    if (navigator.share) {
      await navigator.share({ title: listing.title, text: summary, url }).catch(() => {});
    } else {
      await navigator.clipboard?.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 1800);
    }
  };

  return (
    <div
      className="card"
      style={{ cursor: 'pointer', background: 'white', display: 'flex', flexDirection: 'column' }}
      onClick={onClick}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
        {!imageError ? (
          <img
            src={listing.images?.[0]}
            alt={listing.title}
            onError={event => {
              if (event.currentTarget.src !== fallbackImage) {
                event.currentTarget.src = fallbackImage;
              } else {
                setImageError(true);
              }
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)', fontSize: '2rem' }}>
            🏠
          </div>
        )}

        {/* Badges */}
        <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span className={`badge badge-${listing.type}`}>
            {listing.type === 'sell' ? 'For Sale' : 'For Sale'}
          </span>
          <span className="badge" style={{ background: listing.propertyListingType === 'new' ? '#dcfce7' : '#e0e7ff', color: listing.propertyListingType === 'new' ? '#166534' : '#3730a3' }}>
            {listing.propertyListingType === 'new' ? 'New Property' : 'Used / Resale'}
          </span>
          {listing.featured && (
            <span className="badge" style={{ background: '#fef3c7', color: '#d97706' }}>⭐ Featured</span>
          )}
          {listing.owner?.ownership_type === 'broker' && (
            <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>Verified Broker</span>
          )}
          {listing.owner?.ownership_type === 'builder' && (
            <span className="badge" style={{ background: '#ede9fe', color: '#5b21b6' }}>Builder</span>
          )}
          {listing.reraVerified && (
            <span className="badge" style={{ background: '#cffafe', color: '#155e75' }}>RERA Verified</span>
          )}
        </div>

        {/* Photo count */}
        {listing.images?.length > 1 && (
          <div style={{ position: 'absolute', bottom: '0.6rem', right: '0.6rem', background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Eye size={12} />
            {listing.images.length} photos
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={e => { e.stopPropagation(); setLiked(!liked); }}
          style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', width: 32, height: 32, background: 'white', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}
        >
          <Heart size={15} fill={liked ? '#ef4444' : 'none'} color={liked ? '#ef4444' : '#94a3b8'} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Category chip */}
        <span className="tag" style={{ marginBottom: '0.5rem', width: 'fit-content', fontSize: '0.72rem' }}>
          {cat.icon} {cat.label}
        </span>

        {/* Price */}
        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.35rem', letterSpacing: '-0.5px' }}>
          {formatPrice(listing.price, listing.type)}
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', lineHeight: 1.4, marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {listing.title}
        </h3>

        {listing.project?.project_name && (
          <div style={{ fontSize: '0.78rem', color: 'var(--text-mid)', marginBottom: '0.35rem', fontWeight: 600 }}>
            {listing.project.project_name}
          </div>
        )}

        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-light)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
          <MapPin size={12} style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{listing.locality}, {listing.city}</span>
          {typeof listing.distanceKm === 'number' && (
            <span style={{ marginLeft: 'auto', color: 'var(--primary-dark)', fontWeight: 700, flexShrink: 0 }}>
              {listing.distanceKm < 1 ? '<1' : listing.distanceKm.toFixed(1)} km away
            </span>
          )}
        </div>

        {/* Specs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto' }}>
          {specs.map(spec => (
            <span key={spec} className="tag" style={{ fontSize: '0.72rem' }}>{spec}</span>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.9rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
            by {listing.sellerName}
          </span>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button onClick={shareProperty} className="btn btn-ghost" title="Share property" style={{ padding: '0.3rem 0.55rem', fontSize: '0.78rem' }}>
              <Share2 size={13} /> {shared ? 'Copied' : 'Share'}
            </button>
            <button
              onClick={e => { e.stopPropagation(); onClick(); }}
              className="btn btn-outline"
              style={{ padding: '0.3rem 0.9rem', fontSize: '0.78rem' }}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

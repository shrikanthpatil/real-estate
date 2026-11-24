import { useEffect, useState } from 'react';
import { Copy, Share2 } from 'lucide-react';
import { formatPrice } from '../data/sampleListings';

export default function ShareTools({ listing, onToast }) {
  const [copied, setCopied] = useState(false);
  const propertyUrl = `${window.location.origin}${window.location.pathname}#property-${listing.id || listing.propertyId}`;
  const summary = `${listing.title}\nPrice: ${formatPrice(listing.price, 'sell')}\nLocation: ${listing.locality || ''}, ${listing.city || ''}\n${propertyUrl}`;

  useEffect(() => {
    document.title = `${listing.title} | OpenEstate`;
    const setMeta = (attribute, key, content) => {
      let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content || '');
    };
    setMeta('property', 'og:title', listing.title);
    setMeta('property', 'og:description', `${formatPrice(listing.price, 'sell')} in ${listing.locality || ''}, ${listing.city || ''}`);
    setMeta('property', 'og:image', listing.images?.[0] || '');
    setMeta('property', 'og:url', propertyUrl);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'description', `${listing.title} - ${listing.description?.slice(0, 150) || ''}`);

    const oldSchema = document.getElementById('property-jsonld');
    oldSchema?.remove();
    const script = document.createElement('script');
    script.id = 'property-jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: listing.title,
      description: listing.description,
      price: listing.price,
      priceCurrency: 'INR',
      image: listing.images || [],
      address: { '@type': 'PostalAddress', addressLocality: listing.locality, addressRegion: listing.state, addressCountry: 'IN' },
      floorSize: listing.area ? { '@type': 'QuantitativeValue', value: listing.area, unitText: 'SQFT' } : undefined,
    });
    document.head.appendChild(script);
  }, [listing, propertyUrl]);

  const copyLink = async () => {
    await navigator.clipboard?.writeText(propertyUrl);
    setCopied(true);
    onToast?.('Property link copied');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <button type="button" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(summary)}`, '_blank', 'noopener,noreferrer')} className="btn" style={{ background: '#dcfce7', color: '#166534', fontSize: '0.78rem' }}>
        <Share2 size={15} /> WhatsApp
      </button>
      <button type="button" onClick={copyLink} className="btn btn-ghost" style={{ fontSize: '0.78rem' }}><Copy size={15} /> {copied ? 'Copied' : 'Copy Link'}</button>
    </div>
  );
}

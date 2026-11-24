import { Home, Building2, TreePine, Store, Mail, Phone, Shield, FileText, HelpCircle } from 'lucide-react';

export default function Footer({ onCategoryClick, onAdmin }) {
  const categories = [
    { key: 'apartment', label: 'Apartments & Flats', icon: Building2 },
    { key: 'house', label: 'Houses & Villas', icon: Home },
    { key: 'plot', label: 'Plots & Land', icon: TreePine },
    { key: 'commercial', label: 'Commercial Spaces', icon: Store },
  ];

  const safetyTips = [
    'Always visit the property in person before making any payment.',
    'Never transfer money without verifying ownership documents.',
    'Cross-check seller ID and ownership proofs.',
    'Avoid advance payments via unknown UPI links.',
    'Report suspicious listings using the Report button.',
    'Consult a registered property lawyer for large deals.',
  ];

  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', paddingTop: '3.5rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid #1e3a5f' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: 36, height: 36, background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Home size={20} color="white" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>Open<span style={{ color: 'var(--primary)' }}>Estate</span></span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.25rem', maxWidth: 240 }}>
              India's most transparent, 100% free real estate marketplace. Buy and sell properties — with no middlemen.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a href="mailto:support@openestate.in" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                <Mail size={13} /> support@openestate.in
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Browse By Category</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {categories.map(cat => {
                const Icon = cat.icon;
                return (
                  <li key={cat.key}>
                    <button
                      onClick={() => onCategoryClick(cat.key)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: 0 }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                      onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                    >
                      <Icon size={13} />
                      {cat.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Safety Tips */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Shield size={14} color="var(--primary)" />
              Safety Tips
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {safetyTips.map((tip, i) => (
                <li key={i} style={{ fontSize: '0.8rem', lineHeight: 1.5, display: 'flex', gap: '0.4rem' }}>
                  <span style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.1rem' }}>•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Info */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                ['Why OpenEstate?', '✅ Zero commission — Post & Browse FREE'],
                ['Direct Contact', '📞 Sellers share contacts directly'],
                ['Verified Listings', '🔍 Community-moderated listings'],
                ['All India', '🗺️ 500+ cities covered'],
                ['No Spam', '🚫 Report & remove bad listings'],
              ].map(([label, desc]) => (
                <li key={label}>
                  <div style={{ color: 'white', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.1rem' }}>{label}</div>
                  <div style={{ fontSize: '0.775rem', color: '#64748b' }}>{desc}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ padding: '1.25rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: '#475569' }}>
            © {new Date().getFullYear()} OpenEstate. All rights reserved. Free & Open for Everyone.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {['Privacy Policy', 'Terms of Use', 'Sitemap'].map(l => (
              <span key={l} style={{ fontSize: '0.8rem', color: '#475569', cursor: 'pointer' }}
                onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                onMouseLeave={e => e.target.style.color = '#475569'}
              >{l}</span>
            ))}
            <button onClick={onAdmin} style={{ border: 0, background: 'none', color: '#475569', fontSize: '0.8rem', cursor: 'pointer' }}>Admin</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

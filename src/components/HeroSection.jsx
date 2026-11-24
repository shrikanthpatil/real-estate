import { useState } from 'react';
import { INDIAN_STATES } from '../data/indiaLocations';
import { PROPERTY_CATEGORIES } from '../data/categoryData';

export default function HeroSection({ onSearch, onCategoryClick }) {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [category, setCategory] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');

  function handleSearch() {
    onSearch(city, category, minBudget ? `min:${minBudget}` : '', 'buy', { state, district, maxBudget });
  }

  return (
    <div>
      {/* Hero */}
      <div className="home-hero" style={{
        padding: '5rem 0 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="home-hero-photo" />
        <div className="home-hero-overlay" />
        <div className="home-hero-glow home-hero-glow-one" />
        <div className="home-hero-glow home-hero-glow-two" />

        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <div className="animate-fadeIn">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '999px', padding: '0.35rem 1rem', marginBottom: '1.5rem' }}>
              <span style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%', display: 'inline-block' }} />
              <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>100% Free — No Hidden Fees, No Login Required</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-1px' }}>
              Find Your Perfect Property<br />
              <span style={{ color: '#10b981' }}>Across India</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: 560, margin: '0 auto 2.5rem' }}>
              Buy apartments, villas, residential sites, agricultural land, coffee estates, commercial properties and more — free for everyone.
            </p>
          </div>

          {/* Search Box */}
          <div className="animate-slideUp" style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.25rem', boxShadow: 'var(--shadow-xl)', maxWidth: 1120, margin: '0 auto', textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr 1fr 1fr 1fr auto', gap: '0.6rem', alignItems: 'end' }} className="hero-search-grid">
              <div><label className="form-label">Property category</label><select className="form-select" value={category} onChange={e => setCategory(e.target.value)}><option value="">All categories</option>{PROPERTY_CATEGORIES.map(cat => <option key={cat.key} value={cat.key}>{cat.label}</option>)}</select></div>
              <div><label className="form-label">State</label><select className="form-select" value={state} onChange={e => setState(e.target.value)}><option value="">All states</option>{INDIAN_STATES.map(value => <option key={value}>{value}</option>)}</select></div>
              <div><label className="form-label">District</label><input className="form-input" value={district} onChange={e => setDistrict(e.target.value)} placeholder="District" /></div>
              <div><label className="form-label">City</label><input className="form-input" value={city} onChange={e => setCity(e.target.value)} placeholder="City" /></div>
              <div><label className="form-label">Min budget</label><input className="form-input" type="number" value={minBudget} onChange={e => setMinBudget(e.target.value)} placeholder="₹" /></div>
              <div><label className="form-label">Max budget</label><input className="form-input" type="number" value={maxBudget} onChange={e => setMaxBudget(e.target.value)} placeholder="₹" /></div>
              <button onClick={handleSearch} className="btn btn-primary" style={{ height: 42 }}>Search</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.75rem' }}>
            {[
              { label: 'Apartments in Bangalore', search: 'Bangalore', category: 'apartment' },
              { label: 'Villas in Pune', search: 'Pune', category: 'house' },
              { label: 'Plots in Hyderabad', search: 'Hyderabad', category: 'plot' },
              { label: 'Office in Gurugram', search: 'Gurugram', category: 'commercial' },
            ].map(tag => (
              <button key={tag.label} onClick={() => onSearch(tag.search, tag.category, '', 'buy')} style={{
                padding: '0.3rem 0.9rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.08)', color: '#cbd5e1', fontSize: '0.8rem', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.08)'}
              >{tag.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background: 'var(--primary)', padding: '0.9rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
            {[['2.5L+ Listings', '🏘️'], ['500+ Cities', '🗺️'], ['100% Free', '✅'], ['No Login Needed', '🔓']].map(([label, icon]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Browse by Category */}
      <div style={{ padding: '4rem 0 2rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Browse by Category</h2>
            <p style={{ color: 'var(--text-light)' }}>Find the perfect property in your preferred type</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
            {PROPERTY_CATEGORIES.slice(0, 8).map(cat => (
              <button
                key={cat.key}
                onClick={() => onCategoryClick(cat.key)}
                style={{
                  padding: '1.5rem 1rem', background: 'white', border: '1.5px solid #e2e8f0',
                  borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'center',
                  transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
              >
                <div style={{ width: 52, height: 52, background: '#ecfdf5', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontSize: '1.75rem' }}>
                  {cat.icon}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-dark)', marginBottom: '0.25rem' }}>{cat.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>{cat.group}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '2.5rem 0', background: '#f8fafc' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Popular Locations in India</h2>
              <p style={{ color: 'var(--text-light)', marginTop: '0.35rem' }}>Explore high-demand property markets</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
              {['Bengaluru','Mumbai','Pune','Hyderabad','Chennai','Delhi','Kochi','Mysuru','Coimbatore','Ahmedabad','Gurugram','Chandigarh'].map(city => (
                <button key={city} onClick={() => onSearch(city, '', '', 'buy')} style={{ padding: '0.9rem', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontWeight: 700, color: 'var(--text-mid)', cursor: 'pointer' }}>📍 {city}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '3.5rem 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Why Choose OpenEstate?</h2>
              <p style={{ color: 'var(--text-light)', marginTop: '0.35rem' }}>A transparent way to buy and sell property across India</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {[['Free for everyone','Post and browse properties with no posting or browsing fees.','✅'],['No mandatory accounts','Connect directly without buyer or seller registration.','🔓'],['India-wide coverage','Search properties across all states and union territories.','🇮🇳'],['Moderated listings','Submitted properties are reviewed before publication.','🛡️']].map(([title, text, icon]) => (
                <div key={title} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{icon}</div><h3 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>{title}</h3><p style={{ color: 'var(--text-light)', fontSize: '0.85rem', lineHeight: 1.6 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1120px) {
          .hero-search-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 700px) {
          .hero-search-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Home, Menu, Search, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', view: 'home' },
  { label: 'Buy Property', category: null },
  { label: 'Residential', category: 'apartment' },
  { label: 'Plots & Land', category: 'plot' },
  { label: 'Estates', category: 'estate' },
  { label: 'Commercial', category: 'commercial' },
  { label: 'Industrial', category: 'industrial' },
  { label: 'Resorts & Hotels', category: 'hospitality' },
  { label: 'Projects', category: 'project' },
];

export default function Navbar({ onSearch, onFilterNav, onPostProperty, onAdmin, activeFilter }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const submitSearch = (event) => {
    event?.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 500, background: 'white', borderBottom: '1px solid var(--border)', boxShadow: scrolled ? 'var(--shadow-md)' : 'none' }}>
      <div className="container">
        <div style={{ minHeight: 64, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => onFilterNav(null, null)} style={{ background: 'none', border: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, background: 'var(--primary)', borderRadius: 8, display: 'grid', placeItems: 'center' }}><Home size={20} color="white" /></div>
            <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--secondary)' }}>Open<span style={{ color: 'var(--primary)' }}>Estate</span></span>
          </button>

          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.1rem', flex: 1, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {NAV_LINKS.map(link => {
              const active = link.view === 'home'
                ? activeFilter.type === null && activeFilter.category === null
                : link.category !== undefined && activeFilter.category === link.category;
              return (
                <button key={link.label} onClick={() => link.view === 'home' ? onFilterNav(null, null) : onFilterNav(link.category ? 'sell' : null, link.category || null)} style={{ padding: '0.45rem 0.55rem', border: 0, borderRadius: 'var(--radius-sm)', background: active ? 'var(--primary-light)' : 'transparent', color: active ? 'var(--primary-dark)' : 'var(--text-mid)', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {link.label}
                </button>
              );
            })}
          </nav>

          <form onSubmit={submitSearch} className="desktop-nav" style={{ width: 230, position: 'relative', flexShrink: 0 }}>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="City or locality" className="form-input" style={{ height: 38, paddingLeft: '2.25rem' }} />
            <Search size={15} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-light)' }} />
          </form>

          <button onClick={onPostProperty} className="btn btn-primary desktop-post-cta" style={{ padding: '0.55rem 0.9rem', fontSize: '0.78rem' }}>+ Post Property Free</button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-menu-btn" style={{ display: 'none', marginLeft: 'auto', border: 0, background: 'none', cursor: 'pointer' }}>{mobileOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>

      {mobileOpen && (
        <div style={{ position: 'absolute', top: 64, left: 0, right: 0, background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem', boxShadow: 'var(--shadow-lg)' }}>
          <form onSubmit={submitSearch} style={{ position: 'relative', marginBottom: '0.75rem' }}><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search city or locality" className="form-input" style={{ paddingLeft: '2.25rem' }} /><Search size={15} style={{ position: 'absolute', left: 12, top: 12 }} /></form>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.25rem' }}>
            {NAV_LINKS.map(link => <button key={link.label} onClick={() => { link.view === 'home' ? onFilterNav(null, null) : onFilterNav(link.category ? 'sell' : null, link.category || null); setMobileOpen(false); }} style={{ padding: '0.65rem', border: 0, background: '#f8fafc', borderRadius: 'var(--radius-sm)', textAlign: 'left', color: 'var(--text-mid)', cursor: 'pointer' }}>{link.label}</button>)}
          </div>
          <button onClick={() => { onPostProperty(); setMobileOpen(false); }} className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem' }}>+ Post Property Free</button>
        </div>
      )}

      <style>{`
        @media (max-width: 1120px) { .desktop-nav { display: none !important; } .mobile-menu-btn { display: flex !important; } }
        @media (max-width: 520px) { .desktop-post-cta { display: none !important; } }
      `}</style>
    </header>
  );
}

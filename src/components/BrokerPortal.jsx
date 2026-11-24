import { useState } from 'react';
import { Building2, Users, X } from 'lucide-react';

export default function BrokerPortal({ listings, onClose }) {
  const [filter, setFilter] = useState('all');
  const brokerListings = listings.filter(listing => listing.owner?.ownership_type === 'broker' || listing.category === 'project');
  const visible = filter === 'all' ? brokerListings : brokerListings.filter(listing => (listing.status || 'active') === filter);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ width: 'min(900px, calc(100% - 2rem))', maxHeight: '85vh' }} onClick={event => event.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
          <div><h2 style={{ fontWeight: 800 }}>Broker / Agency Portal</h2><p style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>Manage listings and buyer lead stages</p></div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.45rem' }}><X size={16} /></button>
        </div>
        <div style={{ padding: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
            {[['Listings', brokerListings.length, Building2], ['New Leads', 12, Users], ['Visits Scheduled', 5, Users]].map(([label, value, Icon]) => <div key={label} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}><Icon size={18} color="var(--primary)" /><strong style={{ display: 'block', fontSize: '1.35rem', marginTop: '0.35rem' }}>{value}</strong><span style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>{label}</span></div>)}
          </div>
          <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '0.75rem' }}>{['all','active','sold'].map(value => <button key={value} onClick={() => setFilter(value)} className="btn" style={{ background: filter === value ? 'var(--primary-light)' : '#f1f5f9', fontSize: '0.75rem' }}>{value[0].toUpperCase() + value.slice(1)}</button>)}</div>
          {visible.length === 0 ? <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '3rem' }}>No listings in this view.</p> : visible.map(listing => <div key={listing.id} style={{ borderTop: '1px solid var(--border)', padding: '0.75rem 0', display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}><div><strong>{listing.title}</strong><div style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>{listing.city} · {listing.propertyId || listing.id}</div></div><select className="form-select" defaultValue="New" style={{ width: 150, fontSize: '0.75rem' }}><option>New</option><option>Contacted</option><option>Visit Scheduled</option><option>Closed</option></select></div>)}
        </div>
      </div>
    </div>
  );
}

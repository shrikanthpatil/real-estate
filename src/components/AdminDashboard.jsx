import { useMemo, useState } from 'react';
import { CheckCircle, Edit3, LogOut, Shield, Trash2, XCircle } from 'lucide-react';

export default function AdminDashboard({ listings, enquiries = [], bookings = [], reports = [], blockedUsers = [], auditLog = [], onClose, onUpdate, onDelete, onUpdateEnquiry, onUpdateReport, onBlockUser }) {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('pending');

  const login = (event) => {
    event.preventDefault();
    if (password === 'OpenEstate@2026') {
      setAuthenticated(true);
      setError('');
      setPassword('');
    } else {
      setError('Invalid admin credentials');
    }
  };

  const logout = () => {
    setPassword('');
    setAuthenticated(false);
    setError('');
  };

  const visible = useMemo(() => listings.filter(listing => {
    if (filter === 'all') return true;
    if (filter === 'approved') return listing.moderationStatus === 'approved';
    if (filter === 'rejected') return listing.moderationStatus === 'rejected';
    return listing.moderationStatus === 'pending' || (!listing.moderationStatus && false);
  }), [listings, filter]);

  if (!authenticated) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <form className="modal-box" onSubmit={login} onClick={event => event.stopPropagation()} style={{ width: '100%', maxWidth: 430, padding: '2rem' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'grid', placeItems: 'center', margin: '0 auto 1rem' }}><Shield size={25} /></div>
          <h2 style={{ textAlign: 'center', marginBottom: '0.4rem' }}>Secure Admin Access</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '0.82rem', marginBottom: '1.25rem' }}>This area is for listing moderators only.</p>
          <label className="form-label">Admin Password</label>
          <input type="password" className="form-input" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required autoFocus />
          {error && <div className="form-error" style={{ marginTop: '0.5rem' }}>{error}</div>}
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Sign In</button>
          <button type="button" onClick={onClose} className="btn btn-ghost" style={{ width: '100%', marginTop: '0.5rem' }}>Cancel</button>
        </form>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ width: 'calc(100% - 2rem)', maxWidth: 1000, minHeight: '70vh' }} onClick={event => event.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div><h2 style={{ fontWeight: 800 }}>Property Moderation</h2><p style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Review, approve or reject submitted listings</p></div>
          <div style={{ display: 'flex', gap: '0.5rem' }}><button onClick={logout} className="btn btn-ghost"><LogOut size={15} /> Sign out</button><button onClick={onClose} className="btn btn-ghost">Close</button></div>
        </div>
        <div style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>{[['pending','Pending'],['approved','Approved'],['rejected','Rejected'],['all','All'],['enquiries','Customer Enquiries'],['bookings','Visit Requests'],['reports','Reported Items'],['blocked','Blocked Users'],['audit','Audit Log']].map(([value,label]) => <button key={value} onClick={() => setFilter(value)} className="btn" style={{ background: filter === value ? 'var(--primary-light)' : '#f1f5f9', color: filter === value ? 'var(--primary-dark)' : 'var(--text-mid)', padding: '0.45rem 0.8rem' }}>{label}</button>)}</div>
          {filter === 'enquiries' ? (
            enquiries.length === 0 ? <div style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-light)' }}>No customer enquiries yet.</div> : <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>{enquiries.map(enquiry => (
              <div key={enquiry.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div><strong>{enquiry.name}</strong><div style={{ color: 'var(--text-light)', fontSize: '0.78rem', marginTop: '0.25rem' }}>{enquiry.propertyTitle} · {enquiry.propertyId}</div></div>
                  <select className="form-select" value={enquiry.status} onChange={event => onUpdateEnquiry?.({ ...enquiry, status: event.target.value })} style={{ width: 150, fontSize: '0.78rem', padding: '0.45rem' }}><option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option></select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '0.35rem 1rem', marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-mid)' }}>
                  <span>Phone: {enquiry.phone}</span><span>Email: {enquiry.email || 'Not provided'}</span><span>Seller: {enquiry.sellerName || 'To be confirmed'}</span><span>Received: {new Date(enquiry.createdAt).toLocaleString('en-IN')}</span>
                </div>
                {enquiry.message && <p style={{ marginTop: '0.65rem', fontSize: '0.82rem', color: 'var(--text-mid)' }}>{enquiry.message}</p>}
              </div>
            ))}</div>
          ) : filter === 'bookings' ? (
            bookings.length === 0 ? <div style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-light)' }}>No visit requests yet.</div> : <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>{bookings.map(booking => (
              <div key={booking.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}><div><strong>{booking.propertyTitle}</strong><div style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>{booking.visitType} · {booking.date} at {booking.time}</div></div><span className="badge badge-green">{booking.status}</span></div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-mid)', marginTop: '0.5rem' }}>{booking.name} · {booking.phone} · {booking.timezone}</p>
              </div>
            ))}</div>
          ) : filter === 'reports' ? (
            reports.length === 0 ? <div style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-light)' }}>No reported items.</div> : <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>{reports.map(report => (
              <div key={report.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div><strong>{report.targetTitle || report.targetId}</strong><div style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>{report.reason}</div></div>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button onClick={() => onUpdateReport?.({ ...report, status: 'resolved' })} className="btn btn-ghost" style={{ fontSize: '0.72rem' }}>{report.status === 'resolved' ? 'Resolved' : 'Mark Resolved'}</button>
                    <button onClick={() => {
                      const listing = listings.find(item => item.id === report.targetId);
                      if (listing) onBlockUser?.(listing);
                    }} className="btn" style={{ background: '#fee2e2', color: '#991b1b', fontSize: '0.72rem', padding: '0.45rem 0.65rem' }}>Block User</button>
                    <button onClick={() => onDelete?.(report.targetId)} className="btn" style={{ background: '#fee2e2', color: '#991b1b', fontSize: '0.72rem', padding: '0.45rem 0.65rem' }}>Take Down</button>
                  </div>
                </div>
              </div>
            ))}</div>
          ) : filter === 'blocked' ? (
            blockedUsers.length === 0 ? <div style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-light)' }}>No blocked users.</div> : <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>{blockedUsers.map(user => (
              <div key={user.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
                <strong>{user.name}</strong>
                <div style={{ color: 'var(--text-light)', fontSize: '0.78rem', marginTop: '0.25rem' }}>{user.phone} · {user.email || 'No email'} · {user.reason}</div>
              </div>
            ))}</div>
          ) : filter === 'audit' ? (
            auditLog.length === 0 ? <div style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-light)' }}>No team actions recorded yet.</div> : <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>{auditLog.map(log => (
              <div key={log.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
                <strong>{log.action}</strong>
                <div style={{ color: 'var(--text-light)', fontSize: '0.78rem', marginTop: '0.25rem' }}>{log.targetType}: {log.targetId}{log.reason ? ` · ${log.reason}` : ''}</div>
                <div style={{ color: 'var(--text-light)', fontSize: '0.72rem', marginTop: '0.25rem' }}>{log.admin} · {new Date(log.createdAt).toLocaleString('en-IN')}</div>
              </div>
            ))}</div>
          ) : visible.length === 0 ? <div style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-light)' }}>No listings match this view.</div> : <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>{visible.map(listing => (
            <div key={listing.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '1rem', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '0.75rem' }}>
              <div style={{ width: 80, height: 64, borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#f1f5f9' }}>{listing.images?.[0] ? <img src={listing.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ height: '100%', display: 'grid', placeItems: 'center' }}>🏠</div>}</div>
              <div><strong>{listing.title}</strong><div style={{ color: 'var(--text-light)', fontSize: '0.78rem', marginTop: '0.2rem' }}>{listing.locality || listing.city}, {listing.state || ''} · ₹{Number(listing.price || 0).toLocaleString('en-IN')} · {listing.propertyId || listing.id}</div><div style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>Owner: {listing.sellerName} · Status: {listing.moderationStatus || 'sample'}</div></div>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <button title="Approve" onClick={() => onUpdate({ ...listing, moderationStatus: 'approved', verified: 'Verified' })} className="btn" style={{ background: '#dcfce7', color: '#166534', padding: '0.45rem' }}><CheckCircle size={16} /></button>
                <button title="Reject with reason" onClick={() => {
                  const reason = window.prompt('Enter rejection reason');
                  if (reason) onUpdate({ ...listing, moderationStatus: 'rejected', verified: 'Rejected', rejectionReason: reason });
                }} className="btn" style={{ background: '#fee2e2', color: '#991b1b', padding: '0.45rem' }}><XCircle size={16} /></button>
                <button title="Mark sold" onClick={() => onUpdate({ ...listing, sold: true, status: 'sold' })} className="btn" style={{ background: '#fef3c7', color: '#92400e', padding: '0.45rem' }}><Edit3 size={16} /></button>
                <button title="Delete" onClick={() => onDelete(listing.id)} className="btn" style={{ background: '#fee2e2', color: '#991b1b', padding: '0.45rem' }}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}</div>}
        </div>
      </div>
    </div>
  );
}

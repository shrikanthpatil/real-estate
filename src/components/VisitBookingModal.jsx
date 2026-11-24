import { useState } from 'react';
import { CalendarDays, Download, Video, X } from 'lucide-react';

function downloadCalendarInvite(listing, booking) {
  const date = new Date(`${booking.date}T${booking.time || '10:00'}:00`);
  const end = new Date(date.getTime() + 60 * 60 * 1000);
  const stamp = value => value.toISOString().replace(/[-:]/g, '').replace('.000', '');
  const content = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nDTSTART:${stamp(date)}\r\nDTEND:${stamp(end)}\r\nSUMMARY:Property visit - ${listing.title}\r\nDESCRIPTION:${booking.visitType} with ${listing.sellerName}\r\nLOCATION:${listing.locality}, ${listing.city}\r\nEND:VEVENT\r\nEND:VCALENDAR`;
  const url = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'openestate-visit.ics';
  link.click();
  URL.revokeObjectURL(url);
}

export default function VisitBookingModal({ listing, onClose, onSave }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState({ visitType: 'In-Person Site Visit', date: '', time: '', name: '', phone: '', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata' });

  const submit = event => {
    event.preventDefault();
    if (!booking.name.trim() || !booking.date || !booking.time || !/^[6-9]\d{9}$/.test(booking.phone.replace(/\D/g, '').slice(-10))) {
      setError('Enter your name, preferred date/time, and a valid 10-digit mobile number.');
      return;
    }
    onSave?.({ ...booking, id: `BOOK-${Date.now()}`, propertyId: listing.propertyId || listing.id, propertyTitle: listing.title, status: 'Visit Requested', createdAt: new Date().toISOString() });
    setSubmitted(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ width: '100%', maxWidth: 520, padding: '1.25rem' }} onClick={event => event.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}><h2 style={{ fontWeight: 800 }}>Book a Property Visit</h2><button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.45rem' }}><X size={16} /></button></div>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary-light)', display: 'grid', placeItems: 'center', margin: '0 auto 1rem' }}><CalendarDays size={30} color="var(--primary)" /></div>
            <h3 style={{ marginBottom: '0.5rem' }}>Visit Requested</h3><p style={{ color: 'var(--text-light)', fontSize: '0.82rem', marginBottom: '1rem' }}>The seller will confirm {booking.date} at {booking.time}.</p>
            <button className="btn btn-primary" onClick={() => downloadCalendarInvite(listing, booking)} style={{ width: '100%' }}><Download size={16} /> Download Calendar Invite</button>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="grid-2"><button type="button" onClick={() => setBooking({ ...booking, visitType: 'In-Person Site Visit' })} className="btn" style={{ background: booking.visitType === 'In-Person Site Visit' ? 'var(--primary-light)' : '#f8fafc', color: booking.visitType === 'In-Person Site Visit' ? 'var(--primary-dark)' : 'var(--text-mid)' }}><CalendarDays size={16} /> In-Person</button><button type="button" onClick={() => setBooking({ ...booking, visitType: 'Live Video Tour' })} className="btn" style={{ background: booking.visitType === 'Live Video Tour' ? 'var(--primary-light)' : '#f8fafc', color: booking.visitType === 'Live Video Tour' ? 'var(--primary-dark)' : 'var(--text-mid)' }}><Video size={16} /> Video Tour</button></div>
            <div className="grid-2"><div><label className="form-label">Preferred Date</label><input className="form-input" type="date" value={booking.date} onChange={e => setBooking({ ...booking, date: e.target.value })} /></div><div><label className="form-label">Time Slot</label><select className="form-select" value={booking.time} onChange={e => setBooking({ ...booking, time: e.target.value })}><option value="">Select</option>{['09:00','10:30','12:00','15:00','17:30','19:00'].map(time => <option key={time}>{time}</option>)}</select></div></div>
            <div className="grid-2"><div><label className="form-label">Your Name *</label><input className="form-input" value={booking.name} onChange={e => setBooking({ ...booking, name: e.target.value })} /></div><div><label className="form-label">Mobile Number *</label><input className="form-input" type="tel" value={booking.phone} onChange={e => setBooking({ ...booking, phone: e.target.value })} /></div></div>
            <div><label className="form-label">Timezone</label><select className="form-select" value={booking.timezone} onChange={e => setBooking({ ...booking, timezone: e.target.value })}><option>Asia/Kolkata</option><option>America/New_York</option><option>Europe/London</option><option>Asia/Dubai</option><option>Asia/Singapore</option></select></div>
            {error && <div className="form-error">{error}</div>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Confirm Visit Request</button>
          </form>
        )}
      </div>
    </div>
  );
}

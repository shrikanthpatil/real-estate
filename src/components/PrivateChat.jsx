import { useEffect, useState } from 'react';
import { Flag, Lock, Mic, Video, X } from 'lucide-react';

export default function PrivateChat({ listing, onClose, onReport }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const blockKey = `openestate_block_${listing.id}`;
  const [blocked, setBlocked] = useState(() => localStorage.getItem(blockKey) === 'true');
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('Fake listing');
  const [callStatus, setCallStatus] = useState('');

  useEffect(() => {
    localStorage.setItem(blockKey, String(blocked));
  }, [blocked, blockKey]);

  const startMaskedCall = (type) => {
    setCallStatus(`${type} call requested securely. The real phone number remains hidden.`);
  };

  const reportUser = () => {
    onReport?.(reportReason);
    setShowReport(false);
  };

  const blockUser = () => {
    setBlocked(true);
  };

  const send = event => {
    event.preventDefault();
    if (!text.trim() || blocked) return;
    setMessages(previous => [...previous, { id: Date.now(), text: text.trim(), sender: 'buyer' }]);
    setText('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ width: 'min(440px, calc(100% - 2rem))', maxHeight: '82vh', display: 'flex', flexDirection: 'column' }} onClick={event => event.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border)' }}>
          <div><strong>{listing.sellerName}</strong><div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}><Lock size={11} style={{ display: 'inline' }} /> Phone and email hidden</div></div>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button onClick={() => startMaskedCall('Masked voice')} className="btn btn-ghost" title="Masked voice call" style={{ padding: '0.45rem' }}><Mic size={15} /></button>
            <button onClick={() => startMaskedCall('Masked video')} className="btn btn-ghost" title="Masked video call" style={{ padding: '0.45rem' }}><Video size={15} /></button>
            <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.45rem' }}><X size={15} /></button>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 260, maxHeight: 360, overflowY: 'auto', padding: '1rem', background: '#f8fafc' }}>
          {messages.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '0.78rem', marginTop: '4rem' }}>Start a privacy-safe conversation.</p>}
          {callStatus && <div style={{ marginBottom: '0.75rem', padding: '0.65rem', borderRadius: 'var(--radius-md)', background: '#eff6ff', color: '#1d4ed8', fontSize: '0.75rem', textAlign: 'center' }}>{callStatus}</div>}
          {messages.map(message => <div key={message.id} style={{ marginLeft: 'auto', maxWidth: '78%', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)', padding: '0.55rem 0.75rem', marginBottom: '0.5rem', fontSize: '0.8rem' }}>{message.text}</div>)}
        </div>
        <form onSubmit={send} style={{ display: 'flex', gap: '0.45rem', padding: '0.75rem' }}><input className="form-input" value={text} onChange={event => setText(event.target.value)} placeholder={blocked ? 'You blocked this conversation' : 'Type a message'} disabled={blocked} /><button className="btn btn-primary" disabled={blocked}>Send</button></form>
        {showReport && (
          <div style={{ display: 'flex', gap: '0.4rem', padding: '0 0.75rem 0.75rem' }}>
            <select className="form-select" value={reportReason} onChange={event => setReportReason(event.target.value)} style={{ flex: 1, fontSize: '0.75rem', padding: '0.45rem' }}>
              {['Fake listing','Asking for advance money','Wrong price/photos','Abusive behavior','Suspected scammer','Spam'].map(reason => <option key={reason}>{reason}</option>)}
            </select>
            <button onClick={reportUser} className="btn" style={{ background: '#fee2e2', color: '#991b1b', fontSize: '0.72rem', padding: '0.45rem 0.65rem' }}>Submit</button>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 0.75rem 0.75rem' }}>
          <button onClick={() => setShowReport(value => !value)} className="btn btn-ghost" style={{ color: '#ef4444', fontSize: '0.72rem', padding: '0.45rem' }}><Flag size={13} /> Report</button>
          <button onClick={blockUser} disabled={blocked} className="btn btn-ghost" style={{ fontSize: '0.72rem', padding: '0.45rem' }}>{blocked ? 'User Blocked' : 'Block User'}</button>
        </div>
      </div>
    </div>
  );
}

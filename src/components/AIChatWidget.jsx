import { useEffect, useRef, useState } from 'react';
import { Bot, CalendarDays, Send, X } from 'lucide-react';

export default function AIChatWidget({ listing, onBookVisit }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Hello! I can help you search properties, understand documents, estimate affordability, or book a visit.' }]);
  const endRef = useRef();

  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  const reply = (text) => {
    const lower = text.toLowerCase();
    if (listing && lower.includes('emi')) return `For this property, open the EMI calculator. The asking price is ₹${Number(listing.price || 0).toLocaleString('en-IN')}.`;
    if (listing && (lower.includes('amenity') || lower.includes('feature'))) return `Available amenities include ${(listing.amenities || []).join(', ') || 'details not listed'}.`;
    if (listing && (lower.includes('area') || lower.includes('size'))) return `The listed area is ${listing.area || 'to be confirmed'} sq.ft., with ${listing.bedrooms || 0} BHK where applicable.`;
    if (lower.includes('visit') || lower.includes('tour')) return 'I can help arrange an in-person visit or live video tour.';
    if (lower.includes('3bhk') || lower.includes('bengaluru') || lower.includes('under')) return 'Use the category, location and budget filters. Try "3BHK" plus a city and maximum budget in the search page.';
    if (lower.includes('document') || lower.includes('rera')) return 'Ask for sale deed/title, approved plan, RERA details and EC, then verify them with a local property lawyer.';
    return 'I can help with property search, budget, EMI, documentation, amenities, and scheduling a visit.';
  };

  const send = event => {
    event.preventDefault();
    if (!input.trim()) return;
    const text = input.trim();
    setMessages(previous => [...previous, { role: 'user', text }, { role: 'assistant', text: reply(text) }]);
    setInput('');
  };

  return (
    <>
      {!open && <button onClick={() => setOpen(true)} style={{ position: 'fixed', right: 18, bottom: 18, zIndex: 900, width: 56, height: 56, borderRadius: '50%', border: 0, background: 'var(--primary)', color: 'white', boxShadow: 'var(--shadow-xl)', cursor: 'pointer', display: 'grid', placeItems: 'center' }} aria-label="Open AI assistant"><Bot size={24} /></button>}
      {open && (
        <div style={{ position: 'fixed', right: 18, bottom: 18, zIndex: 900, width: 'min(360px, calc(100vw - 36px))', height: 480, maxHeight: 'calc(100vh - 36px)', borderRadius: 'var(--radius-xl)', background: 'white', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ background: 'var(--secondary)', color: 'white', padding: '0.85rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><strong style={{ display: 'block' }}>OpenEstate AI</strong><span style={{ fontSize: '0.72rem', opacity: 0.75 }}>Property assistant</span></div><button onClick={() => setOpen(false)} style={{ border: 0, background: 'transparent', color: 'white', cursor: 'pointer' }}><X size={18} /></button></div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>{messages.map((message, index) => <div key={index} style={{ alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '82%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-md)', background: message.role === 'user' ? 'var(--primary)' : '#f1f5f9', color: message.role === 'user' ? 'white' : 'var(--text-mid)', fontSize: '0.78rem', lineHeight: 1.5 }}>{message.text}</div>)}{listing && <button onClick={onBookVisit} className="btn btn-outline" style={{ alignSelf: 'flex-start', fontSize: '0.72rem', padding: '0.45rem 0.75rem' }}><CalendarDays size={14} /> Schedule a visit</button>}<div ref={endRef} /></div>
          <form onSubmit={send} style={{ display: 'flex', gap: '0.4rem', padding: '0.75rem', borderTop: '1px solid var(--border)' }}><input className="form-input" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about properties..." /><button className="btn btn-primary" style={{ padding: '0.55rem' }}><Send size={16} /></button></form>
        </div>
      )}
    </>
  );
}

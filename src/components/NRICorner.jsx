import { useState } from 'react';
import { Globe2, X } from 'lucide-react';

export default function NRICorner({ onClose }) {
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('America/New_York');
  const rates = { USD: 83, AED: 22.6, GBP: 105, EUR: 90, SGD: 61 };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ width: '100%', maxWidth: 760, padding: '1.25rem' }} onClick={event => event.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}><h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}><Globe2 size={20} /> NRI Corner</h2><button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.45rem' }}><X size={16} /></button></div>
        <div className="grid-2" style={{ marginBottom: '1rem' }}><div><label className="form-label">Display Currency</label><select className="form-select" value={currency} onChange={e => setCurrency(e.target.value)}>{['USD','AED','GBP','EUR','SGD'].map(value => <option key={value}>{value}</option>)}</select></div><div><label className="form-label">Callback Timezone</label><select className="form-select" value={timezone} onChange={e => setTimezone(e.target.value)}><option>America/New_York</option><option>Europe/London</option><option>Asia/Dubai</option><option>Asia/Singapore</option><option>Australia/Sydney</option></select></div></div>
        <div style={{ background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', padding: '0.9rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>
          Example: ₹1 crore ≈ {currency} {(10000000 / rates[currency]).toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '0.75rem' }}>
          {[
            ['FEMA & Repatriation','NRIs can purchase residential/commercial property in India subject to FEMA rules. Confirm current RBI regulations and repatriation eligibility with an authorised dealer.'],
            ['Power of Attorney','Use notarised and, where applicable, consular/apostille-attested PoA documents for representation and execution.'],
            ['Home Loans','Banks assess passport, visa, employment, income and overseas property records. Loan eligibility and documentation vary by lender.'],
            ['Taxes & Banking','Plan for TDS, PAN, bank accounts, remittance, rental income, capital gains and DTAA compliance with a qualified adviser.'],
          ].map(([title, text]) => <div key={title} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.9rem' }}><h3 style={{ fontSize: '0.9rem', marginBottom: '0.35rem' }}>{title}</h3><p style={{ color: 'var(--text-light)', fontSize: '0.78rem', lineHeight: 1.6 }}>{text}</p></div>)}
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.72rem', color: 'var(--text-light)' }}>Educational guidance only; consult an RBI-authorised advisor and property lawyer for current requirements.</p>
      </div>
    </div>
  );
}

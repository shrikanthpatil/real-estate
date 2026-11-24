import { useMemo, useState } from 'react';
import { Calculator } from 'lucide-react';

export default function EmiCalculator({ initialPrice = 0 }) {
  const [price, setPrice] = useState(initialPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [tenure, setTenure] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [currency, setCurrency] = useState('INR');

  const result = useMemo(() => {
    const principal = Math.max(Number(price) - Number(price) * downPaymentPercent / 100, 0);
    const monthlyRate = Number(rate) / 1200;
    const months = Number(tenure) * 12;
    const emi = monthlyRate === 0 ? principal / months : principal * monthlyRate * (1 + monthlyRate) ** months / ((1 + monthlyRate) ** months - 1);
    const total = emi * months;
    return { principal, emi: Number.isFinite(emi) ? emi : 0, interest: Math.max(total - principal, 0), total: Number.isFinite(total) ? total : 0 };
  }, [price, downPaymentPercent, tenure, rate]);

  const formatAmount = (amount) => {
    if (currency === 'USD') return `$${(amount / 83).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  };

  const principalPercent = result.total ? Math.round(result.principal / result.total * 100) : 100;
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1rem', background: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h3 style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calculator size={17} /> EMI Calculator</h3>
        <select className="form-select" value={currency} onChange={e => setCurrency(e.target.value)} style={{ width: 85, padding: '0.35rem' }}><option value="INR">INR</option><option value="USD">USD</option></select>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.75rem' }}>
        <div><label className="form-label">Property Price</label><input className="form-input" type="number" value={price} onChange={e => setPrice(Number(e.target.value))} /></div>
        <div><label className="form-label">Down Payment {downPaymentPercent}%</label><input type="range" min="0" max="80" value={downPaymentPercent} onChange={e => setDownPaymentPercent(Number(e.target.value))} style={{ width: '100%' }} /></div>
        <div><label className="form-label">Tenure: {tenure} years</label><input type="range" min="5" max="30" value={tenure} onChange={e => setTenure(Number(e.target.value))} style={{ width: '100%' }} /></div>
        <div><label className="form-label">Interest Rate: {rate}%</label><input type="range" min="5" max="15" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} style={{ width: '100%' }} /></div>
      </div>
      <div style={{ marginTop: '0.9rem', display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.5rem' }}>
        <div style={{ gridColumn: '1/-1', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', padding: '0.75rem', textAlign: 'center' }}><div style={{ color: 'var(--primary-dark)', fontSize: '0.72rem', fontWeight: 700 }}>MONTHLY EMI</div><strong style={{ color: 'var(--primary-dark)', fontSize: '1.35rem' }}>{formatAmount(result.emi)}</strong></div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Principal: <strong style={{ color: 'var(--text-mid)' }}>{formatAmount(result.principal)}</strong></div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Interest: <strong style={{ color: 'var(--text-mid)' }}>{formatAmount(result.interest)}</strong></div>
        <div style={{ gridColumn: '1/-1', height: 10, borderRadius: 99, background: '#bfdbfe', overflow: 'hidden' }}><div style={{ height: '100%', width: `${principalPercent}%`, background: 'var(--primary)' }} /></div>
        <div style={{ gridColumn: '1/-1', fontSize: '0.78rem', color: 'var(--text-light)' }}>Total amount payable: <strong style={{ color: 'var(--text-dark)' }}>{formatAmount(result.total)}</strong></div>
      </div>
    </div>
  );
}

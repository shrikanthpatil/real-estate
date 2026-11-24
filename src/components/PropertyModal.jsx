import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Maximize2, Bed, Bath, Zap, Phone, Mail, Copy, Flag, CheckCircle, Share2, CalendarDays } from 'lucide-react';
import { formatPrice, categoryConfig } from '../data/sampleListings';
import ShareTools from './ShareTools';
import EmiCalculator from './EmiCalculator';
import VisitBookingModal from './VisitBookingModal';
import PrivateChat from './PrivateChat';

export default function PropertyModal({ listing, onClose, onReport, onEnquire, onBooking, onChatReport }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [contactRevealed, setContactRevealed] = useState(false);
  const [copied, setCopied] = useState('');
  const [reported, setReported] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [enquirySent, setEnquirySent] = useState(false);
  const [enquiry, setEnquiry] = useState({ name: '', phone: '', email: '', message: '' });
  const [enquiryError, setEnquiryError] = useState('');
  const [showVisit, setShowVisit] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [reportReason, setReportReason] = useState('Fake listing');

  if (!listing) return null;

  const cat = categoryConfig[listing.category] || {};
  const images = listing.images || [];
  const hasImages = images.length > 0;
  const fallbackImage = `https://placehold.co/900x560/e2e8f0/475569?text=${encodeURIComponent(listing.category || 'Property')}`;

  const prevImg = () => setCurrentImage(i => (i - 1 + images.length) % images.length);
  const nextImg = () => setCurrentImage(i => (i + 1) % images.length);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  const submitEnquiry = (event) => {
    event.preventDefault();
    if (!enquiry.name.trim() || !/^[6-9]\d{9}$/.test(enquiry.phone.replace(/\D/g, '').slice(-10))) {
      setEnquiryError('Enter your name and a valid 10-digit mobile number.');
      return;
    }
    if (enquiry.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) {
      setEnquiryError('Enter a valid email address.');
      return;
    }
    onEnquire?.({
      ...enquiry,
      id: `ENQ-${Date.now()}`,
      propertyId: listing.propertyId || listing.id,
      propertyTitle: listing.title,
      sellerName: listing.sellerName,
      status: 'new',
      createdAt: new Date().toISOString(),
    });
    setEnquirySent(true);
    setEnquiryError('');
  };

  const specs = [];
  if (listing.bedrooms > 0) specs.push({ icon: '🛏️', label: `${listing.bedrooms} Bedrooms` });
  if (listing.bathrooms > 0) specs.push({ icon: '🚿', label: `${listing.bathrooms} Bathrooms` });
  if (listing.area) specs.push({ icon: '📐', label: `${listing.area.toLocaleString()} sq.ft.` });
  if (listing.furnishing) specs.push({ icon: '🪑', label: listing.furnishing.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase()) });

  const datePosted = new Date(listing.postedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        style={{ width: '100%', maxWidth: 900 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <span className={`badge badge-${listing.type}`}>For Sale</span>
              <span className="badge" style={{ background: listing.propertyListingType === 'new' ? '#dcfce7' : '#e0e7ff', color: listing.propertyListingType === 'new' ? '#166534' : '#3730a3' }}>
                {listing.propertyListingType === 'new' ? 'New Property' : 'Used / Resale'}
              </span>
              <span className="tag" style={{ fontSize: '0.75rem' }}>{cat.icon} {cat.label}</span>
              {listing.verified === 'Verified' && <span className="badge badge-green">✓ Verified</span>}
            </div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-dark)', lineHeight: 1.3, maxWidth: 600 }}>{listing.title}</h2>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(280px,1fr)', gap: '1.5rem' }} className="modal-grid">
          {/* Left col */}
          <div>
            {/* Gallery */}
            <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '1rem', background: '#f1f5f9', aspectRatio: '16/9' }}>
              {hasImages ? (
                <img
                  src={images[currentImage]}
                  alt={listing.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={event => {
                    if (event.currentTarget.src !== fallbackImage) event.currentTarget.src = fallbackImage;
                  }}
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '4rem' }}>🏠</div>
              )}
              {images.length > 1 && (
                <>
                  <button onClick={prevImg} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronLeft size={20} color="white" />
                  </button>
                  <button onClick={nextImg} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronRight size={20} color="white" />
                  </button>
                  <div style={{ position: 'absolute', bottom: '0.75rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.4rem' }}>
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setCurrentImage(i)} style={{ width: i === currentImage ? 20 : 8, height: 8, borderRadius: '999px', background: i === currentImage ? 'white' : 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer', transition: 'all 0.2s', padding: 0 }} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                {images.map((img, i) => (
                  <img key={i} src={img} alt="" onClick={() => setCurrentImage(i)} style={{ width: 72, height: 52, objectFit: 'cover', borderRadius: 'var(--radius-sm)', cursor: 'pointer', flexShrink: 0, border: i === currentImage ? '2.5px solid var(--primary)' : '2.5px solid transparent', opacity: i === currentImage ? 1 : 0.7, transition: 'all 0.15s' }} />
                ))}
              </div>
            )}

            {/* Key specs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {specs.map(s => (
                <div key={s.label} style={{ background: '#f8fafc', borderRadius: 'var(--radius-md)', padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', marginBottom: '0.3rem' }}>{s.icon}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-mid)', fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Price + Location */}
            <div style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--primary-dark)', fontWeight: 600, marginBottom: '0.2rem' }}>ASKING PRICE</div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--primary-dark)', letterSpacing: '-1px' }}>{formatPrice(listing.price, listing.type)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-mid)', fontSize: '0.875rem', marginBottom: '0.2rem', justifyContent: 'flex-end' }}>
                  <MapPin size={14} />
                  <strong>{listing.locality}, {listing.city}</strong>
                </div>
                {listing.landmark && <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>Near {listing.landmark}</div>}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <ShareTools listing={listing} onToast={() => setCopied('Link copied')} />
              <button onClick={() => setShowChat(true)} className="btn btn-secondary" style={{ fontSize: '0.78rem' }}>Privacy-safe Chat</button>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <EmiCalculator initialPrice={listing.price} />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.6rem', color: 'var(--text-dark)' }}>About this Property</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-mid)', lineHeight: 1.75 }}>{listing.description}</p>
            </div>

            {(() => {
              const project = listing.project || null;
              const constructor = project?.constructor || listing.builder || null;
              const projectProperties = project?.properties?.length
                ? project.properties
                : [{
                    unit_identifier: listing.property?.unitIdentifier || 'Individual Property',
                    category: listing.category,
                    sale_type: listing.type === 'sell' ? 'Resale' : 'To be confirmed',
                    specs: {
                      configuration: listing.property?.configuration || `${listing.bedrooms || 0} BHK`,
                      carpet_area: listing.property?.carpetArea || 'To be confirmed',
                      built_up_area: listing.property?.builtUpArea || `${listing.area || 'To be confirmed'} sq.ft.`,
                      floor_info: listing.property?.floorInfo || 'To be confirmed',
                      facing: listing.property?.facing || 'To be confirmed',
                      furnishing: listing.furnishing || 'To be confirmed',
                      parking: listing.property?.parking || 'To be confirmed',
                    },
                    financials: {
                      expected_price: listing.price,
                      price_per_sqft: listing.property?.pricePerSqft || 'To be confirmed',
                      negotiable: listing.property?.negotiable ?? null,
                      maintenance: listing.property?.maintenance || 'To be confirmed',
                    },
                    owner: listing.project?.properties?.[0]?.owner || listing.owner || {
                      full_name: listing.sellerName,
                      phone: listing.sellerPhone,
                      email: listing.sellerEmail,
                      ownership_type: 'Sole Owner',
                      clear_title_documents: null,
                      active_home_loan: null,
                      preferred_contact_time: 'To be confirmed',
                    },
                  }];

              const companyName = constructor?.company_name || constructor?.companyName || 'To be confirmed';
              const projectName = project?.project_name || project?.name || listing.title;
              const address = project?.address;
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.9rem' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>Project Details</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-mid)' }}><strong>{projectName}</strong></p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                      {project?.project_type ? project.project_type.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Property / Project'}
                      {' · '}
                      {[address?.street, address?.locality || listing.locality, address?.city || listing.city, address?.state, address?.pincode].filter(Boolean).join(', ') || 'Location to be confirmed'}
                    </p>
                    {project?.scale_and_status && (
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                        {project.scale_and_status.total_towers_or_blocks} towers/blocks · {project.scale_and_status.total_units} units
                        {' · '}{project.scale_and_status.construction_status?.replace('_', ' ')}
                        {' · Possession: '}{project.scale_and_status.possession_or_completion}
                      </p>
                    )}
                  </div>

                  <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.9rem', background: '#f8fafc' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>Builder / Constructor</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-mid)' }}><strong>{companyName}</strong></p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.25rem 1rem', marginTop: '0.35rem', fontSize: '0.78rem', color: 'var(--text-light)' }}>
                      <span>Contact: {constructor?.contact_person || constructor?.representative || 'To be confirmed'}</span>
                      <span>Phone: {constructor?.phone || constructor?.contact || 'To be confirmed'}</span>
                      <span>Email: {constructor?.email || 'To be confirmed'}</span>
                      <span>Project RERA: {constructor?.project_rera_number || constructor?.projectRera || 'To be confirmed'}</span>
                      <span>Builder RERA: {constructor?.builder_rera_number || constructor?.builderRera || 'To be confirmed'}</span>
                      <span>Approval: {constructor?.approval_authority || constructor?.approvalAuthority || 'To be confirmed'}</span>
                    </div>
                    {(constructor?.track_record || constructor?.trackRecord) && (
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '0.35rem' }}>{constructor.track_record || constructor.trackRecord}</p>
                    )}
                  </div>

                  <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.9rem' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>Units / Properties in this Project</h3>
                    {projectProperties.map((unit, index) => (
                      <div key={unit.unit_identifier || index} style={{ borderTop: index ? '1px solid var(--border)' : 'none', padding: '0.65rem 0', fontSize: '0.78rem', color: 'var(--text-mid)' }}>
                        <p><strong>{unit.unit_identifier}</strong> · {String(unit.category || listing.category).replace('_', ' ')} · {String(unit.sale_type || 'Resale').replace('_', ' ')}</p>
                        <p style={{ color: 'var(--text-light)', marginTop: '0.2rem' }}>
                          {unit.specs.configuration} · Carpet: {unit.specs.carpet_area} · Built-up: {unit.specs.built_up_area}
                        </p>
                        <p style={{ color: 'var(--text-light)', marginTop: '0.2rem' }}>
                          ₹{Number(unit.financials.expected_price || 0).toLocaleString('en-IN')}
                          {' · '}{unit.financials.negotiable === null ? 'Negotiability to be confirmed' : unit.financials.negotiable ? 'Negotiable' : 'Non-negotiable'}
                          {' · Maintenance: '}{unit.financials.maintenance}
                        </p>
                        <p style={{ color: 'var(--text-light)', marginTop: '0.2rem' }}>
                          Owner: {unit.owner?.full_name || 'To be confirmed'} · {unit.owner?.phone || 'To be confirmed'} · {unit.owner?.ownership_type || 'To be confirmed'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Amenities */}
            {listing.amenities?.length > 0 && (
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--text-dark)' }}>Amenities & Features</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {listing.amenities.map(a => (
                    <span key={a} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.75rem', background: 'var(--primary-light)', color: 'var(--primary-dark)', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 500 }}>
                      ✓ {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Posted date */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-light)' }}>
              Listed on {datePosted} · Listing ID: #{listing.id}
            </div>
          </div>

          {/* Right col — Seller Contact */}
          <div>
            <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', position: 'sticky', top: '80px' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>📞 Contact Seller</h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: 44, height: 44, background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0 }}>
                  {listing.sellerName?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-dark)' }}>{listing.sellerName}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>{listing.owner?.ownershipType ? listing.owner.ownershipType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Property Owner'}</div>
                </div>
              </div>

              {!contactRevealed ? (
                <button onClick={() => setContactRevealed(true)} className="btn btn-primary" style={{ width: '100%', marginBottom: '0.75rem' }}>
                  <Phone size={16} /> Click to Reveal Contact
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '0.75rem' }}>
                  {/* Phone */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 0.9rem', background: '#f0fdf4', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-light)' }}>
                    <Phone size={15} color="var(--primary)" />
                    <span style={{ flex: 1, fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-dark)' }}>{listing.sellerPhone}</span>
                    <button onClick={() => copyToClipboard(listing.sellerPhone, 'phone')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied === 'phone' ? 'var(--primary)' : 'var(--text-light)' }} title="Copy phone">
                      {copied === 'phone' ? <CheckCircle size={15} /> : <Copy size={15} />}
                    </button>
                  </div>
                  {/* Email */}
                  {listing.sellerEmail && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 0.9rem', background: '#eff6ff', borderRadius: 'var(--radius-md)', border: '1px solid #bfdbfe' }}>
                      <Mail size={15} color="#3b82f6" />
                      <span style={{ flex: 1, fontWeight: 500, fontSize: '0.85rem', color: 'var(--text-dark)', wordBreak: 'break-all' }}>{listing.sellerEmail}</span>
                      <button onClick={() => copyToClipboard(listing.sellerEmail, 'email')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied === 'email' ? '#3b82f6' : 'var(--text-light)' }} title="Copy email">
                        {copied === 'email' ? <CheckCircle size={15} /> : <Copy size={15} />}
                      </button>
                    </div>
                  )}
                  <a href={`tel:${listing.sellerPhone}`} className="btn btn-secondary" style={{ width: '100%', textDecoration: 'none' }}>
                    <Phone size={16} /> Call Now
                  </a>
                </div>
              )}

              {typeof listing.distanceKm === 'number' && (
                <div style={{ marginBottom: '0.75rem', fontSize: '0.78rem', color: 'var(--primary-dark)', fontWeight: 700 }}>
                  📍 Approximately {listing.distanceKm < 1 ? '<1' : listing.distanceKm.toFixed(1)} km from your location
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <button onClick={() => setShowVisit(true)} className="btn btn-primary" style={{ width: '100%' }}><CalendarDays size={15} /> Book a Visit</button>
                <button onClick={() => setShowVisit(true)} className="btn btn-secondary" style={{ width: '100%' }}>Request Callback</button>
              </div>

              {!enquirySent ? (
                showEnquiry ? (
                  <form onSubmit={submitEnquiry} style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '0.75rem' }}>
                    <input className="form-input" placeholder="Your name *" value={enquiry.name} onChange={e => setEnquiry({ ...enquiry, name: e.target.value })} />
                    <input className="form-input" placeholder="Mobile number *" type="tel" value={enquiry.phone} onChange={e => setEnquiry({ ...enquiry, phone: e.target.value })} />
                    <input className="form-input" placeholder="Email (optional)" type="email" value={enquiry.email} onChange={e => setEnquiry({ ...enquiry, email: e.target.value })} />
                    <textarea className="form-textarea" style={{ minHeight: 70 }} placeholder="Message, preferred visit time..." value={enquiry.message} onChange={e => setEnquiry({ ...enquiry, message: e.target.value })} />
                    {enquiryError && <div className="form-error">{enquiryError}</div>}
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Enquiry</button>
                    <button type="button" onClick={() => setShowEnquiry(false)} className="btn btn-ghost" style={{ width: '100%' }}>Cancel</button>
                  </form>
                ) : (
                  <button onClick={() => setShowEnquiry(true)} className="btn btn-outline" style={{ width: '100%', marginBottom: '0.75rem' }}>Send Property Enquiry</button>
                )
              ) : (
                <div style={{ marginBottom: '0.75rem', padding: '0.75rem', background: 'var(--primary-light)', color: 'var(--primary-dark)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 700 }}>
                  ✅ Enquiry sent successfully
                </div>
              )}

              <div style={{ padding: '0.75rem', background: '#fffbeb', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: '#92400e', lineHeight: 1.5, marginBottom: '1rem' }}>
                ⚠️ <strong>Safety Tip:</strong> Always verify property documents before making any payment. Meet in person at the property.
              </div>

              <select className="form-select" value={reportReason} onChange={e => setReportReason(e.target.value)} style={{ marginBottom: '0.5rem', fontSize: '0.78rem' }}>
                {['Fake listing','Asking for advance money','Wrong price/photos','Abusive behavior','Suspected scammer'].map(reason => <option key={reason}>{reason}</option>)}
              </select>
              <button
                onClick={() => {
                  onReport?.(reportReason);
                  setReported(true);
                }}
                disabled={reported}
                style={{ width: '100%', padding: '0.5rem', background: 'none', border: '1px solid #fca5a5', borderRadius: 'var(--radius-md)', color: reported ? 'var(--text-light)' : '#ef4444', fontSize: '0.8rem', cursor: reported ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              >
                <Flag size={13} />
                {reported ? 'Listing Reported — Thank you' : 'Report this Listing'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showVisit && <VisitBookingModal listing={listing} onClose={() => setShowVisit(false)} onSave={booking => onBooking?.(booking)} />}
      {showChat && <PrivateChat listing={listing} onClose={() => setShowChat(false)} onReport={reason => onChatReport?.(reason)} />}
      <div className="property-mobile-actions">
        <button onClick={() => setShowVisit(true)} className="btn btn-primary" style={{ flex: 1 }}>Book Visit</button>
        <button onClick={() => setShowChat(true)} className="btn btn-secondary" style={{ flex: 1 }}>Chat</button>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .modal-grid { grid-template-columns: 1fr !important; }
          .property-mobile-actions { display: flex !important; }
        }
        .property-mobile-actions {
          display: none;
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 80;
          background: white;
          border-top: 1px solid var(--border);
          padding: 0.75rem;
          gap: 0.5rem;
        }
      `}</style>
    </div>
  );
}

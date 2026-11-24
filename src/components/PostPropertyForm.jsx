import { useRef, useState } from 'react';
import { AlertCircle, Upload, X } from 'lucide-react';
import { findCategory, PROPERTY_CATEGORIES } from '../data/categoryData';
import { INDIAN_STATES, KarnatakaLocations } from '../data/indiaLocations';
import { CITY_COORDINATES } from '../data/nearMe';

const STEPS = ['Property', 'Owner & Builder', 'Location', 'Photos & Documents', 'Review'];

export default function PostPropertyForm({ onClose, onSubmit }) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captcha] = useState(() => {
    const a = 2 + Math.floor(Math.random() * 8);
    const b = 2 + Math.floor(Math.random() * 8);
    return { a, b };
  });
  const fileRef = useRef();
  const [form, setForm] = useState({
    category: 'apartment', subcategory: '2 BHK', title: '', description: '', price: '', negotiable: 'yes',
    propertyListingType: 'used',
    size: '', measurementUnit: 'sq.ft.', condition: 'ready', bhk: '2', bedrooms: '', bathrooms: '',
    furnishing: 'unfurnished', floor: '', totalFloors: '', parking: '', facing: '', roadAccess: '', waterAvailability: '',
    ownerName: '', ownerType: 'sole', ownerPhone: '', ownerEmail: '', whatsapp: 'yes',
    builderName: '', developerCompany: '', builderContact: '', builderEmail: '', companyDetails: '',
    country: 'India', state: '', district: '', city: '', taluk: '', village: '', locality: '', pincode: '', mapsUrl: '',
    images: [], floorPlans: [], videos: [], documents: [],
  });

  const set = (field, value) => {
    setForm(previous => ({ ...previous, [field]: value }));
    setErrors(previous => ({ ...previous, [field]: '' }));
  };
  const category = findCategory(form.category);

  const validate = (currentStep = step) => {
    const nextErrors = {};
    if (currentStep === 0) {
      if (!form.title.trim()) nextErrors.title = 'Property title is required';
      if (form.description.trim().length < 30) nextErrors.description = 'Enter at least 30 characters';
      if (!form.price || Number(form.price) <= 0) nextErrors.price = 'Enter a valid sale price';
      if (!form.size || Number(form.size) <= 0) nextErrors.size = 'Enter a valid property size';
    }
    if (currentStep === 1) {
      if (!form.ownerName.trim()) nextErrors.ownerName = 'Owner name is required';
      if (!/^[6-9]\d{9}$/.test(form.ownerPhone.replace(/\D/g, '').slice(-10))) nextErrors.ownerPhone = 'Enter a valid 10-digit mobile number';
      if (form.ownerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.ownerEmail)) nextErrors.ownerEmail = 'Enter a valid email';
    }
    if (currentStep === 2) {
      if (!form.state) nextErrors.state = 'State is required';
      if (!form.district.trim()) nextErrors.district = 'District is required';
      if (!form.city.trim()) nextErrors.city = 'City is required';
      if (!/^\d{6}$/.test(form.pincode)) nextErrors.pincode = 'Enter a valid 6-digit PIN code';
    }
    if (currentStep === 4 && Number(captchaAnswer) !== captcha.a + captcha.b) nextErrors.captcha = 'Solve the spam check correctly';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const next = () => { if (validate(step)) setStep(value => value + 1); };
  const back = () => setStep(value => Math.max(0, value - 1));

  const handleFiles = (files, field = 'images') => {
    const limit = field === 'images' ? 20 : 10;
    const accepted = Array.from(files).slice(0, limit);
    Promise.all(accepted.map(file => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = event => resolve({ name: file.name, type: file.type, size: file.size, url: event.target.result });
      reader.readAsDataURL(file);
    }))).then(items => setForm(previous => ({ ...previous, [field]: [...previous[field], ...items].slice(0, limit) })));
  };

  const removeFile = (field, index) => setForm(previous => ({ ...previous, [field]: previous[field].filter((_, i) => i !== index) }));
  const makeCover = (index) => setForm(previous => {
    const images = [...previous.images];
    const [selected] = images.splice(index, 1);
    return { ...previous, images: [selected, ...images] };
  });

  const submit = () => {
    if (!validate(4)) return;
    setSubmitting(true);
    setTimeout(() => {
      const propertyId = `OE-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const managementToken = crypto.randomUUID ? crypto.randomUUID().replace(/-/g, '') : `${Date.now()}${Math.random().toString(36).slice(2)}`;
      const owner = {
        full_name: form.ownerName,
        phone: form.ownerPhone,
        email: form.ownerEmail || 'To be confirmed',
        ownership_type: form.ownerType,
        whatsapp_enabled: form.whatsapp === 'yes',
      };
      const listing = {
        id: propertyId,
        propertyId,
        managementToken,
        type: 'sell',
        propertyListingType: form.propertyListingType,
        category: form.category,
        subcategory: form.subcategory,
        title: form.title,
        price: Number(form.price),
        city: form.city,
        state: form.state,
        district: form.district,
        coordinates: CITY_COORDINATES[form.city] || null,
        locality: form.locality,
        landmark: form.taluk || form.village,
        area: Number(form.size),
        measurementUnit: form.measurementUnit,
        bedrooms: Number(form.bedrooms) || Number(form.bhk) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        furnishing: form.furnishing,
        description: form.description,
        amenities: [],
        images: form.images.map(image => image.url),
        floorPlans: form.floorPlans,
        videos: form.videos,
        documents: form.documents,
        sellerName: form.ownerName,
        sellerPhone: form.ownerPhone,
        sellerEmail: form.ownerEmail,
        postedAt: new Date().toISOString(),
        featured: false,
        verified: 'Pending verification',
        moderationStatus: 'pending',
        owner,
        builder: {
          companyName: form.developerCompany || form.builderName || 'To be confirmed',
          name: form.builderName,
          contact: form.builderContact,
          email: form.builderEmail,
          details: form.companyDetails,
        },
        location: {
          country: 'India', state: form.state, district: form.district, city: form.city,
          taluk: form.taluk, village: form.village, locality: form.locality, pincode: form.pincode, mapsUrl: form.mapsUrl,
          coordinates: CITY_COORDINATES[form.city] || null,
        },
        specifications: {
          subcategory: form.subcategory, size: form.size, measurementUnit: form.measurementUnit,
          condition: form.condition, bhk: form.bhk, bedrooms: form.bedrooms, bathrooms: form.bathrooms,
          floor: form.floor, totalFloors: form.totalFloors, facing: form.facing, parking: form.parking,
          roadAccess: form.roadAccess, waterAvailability: form.waterAvailability,
        },
        financials: { price: Number(form.price), negotiable: form.negotiable === 'yes' },
        project: {
          project_name: category?.group === 'Projects' ? form.title : 'Individual property',
          project_type: category?.group || 'Property',
          address: { locality: form.locality, city: form.city, state: form.state, pincode: form.pincode },
        },
      };
      onSubmit(listing);
      setSubmitting(false);
    }, 700);
  };

  const isResidential = form.category === 'apartment' || form.category === 'house';
  const isLand = ['plot','agriculture','estate','industrial'].includes(form.category);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ width: '100%', maxWidth: 820 }} onClick={event => event.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div><h2 style={{ fontWeight: 800, fontSize: '1.15rem' }}>Post Property — Free</h2><p style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Step {step + 1} of 5: {STEPS[step]}</p></div>
          <button onClick={onClose} aria-label="Close" style={{ width: 36, height: 36, border: 0, borderRadius: '50%', background: '#f1f5f9', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><X size={18} /></button>
        </div>
        <div style={{ display: 'flex', gap: '0.25rem', padding: '1rem 1.5rem 0' }}>{STEPS.map((name, index) => <div key={name} title={name} style={{ flex: 1, height: 4, borderRadius: 99, background: index <= step ? 'var(--primary)' : '#e2e8f0' }} />)}</div>
        <div style={{ padding: '1.5rem', maxHeight: 'calc(92vh - 200px)', overflowY: 'auto' }}>
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontWeight: 800 }}>Property Details</h3>
              <div className="grid-2"><div><label className="form-label">Category *</label><select className="form-select" value={form.category} onChange={event => { const selected = findCategory(event.target.value); setForm(previous => ({ ...previous, category: event.target.value, subcategory: selected?.subcategories[0] || '' })); }}><option value="">Select</option>{PROPERTY_CATEGORIES.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}</select></div><div><label className="form-label">Subcategory *</label><select className="form-select" value={form.subcategory} onChange={event => set('subcategory', event.target.value)}>{category?.subcategories.map(item => <option key={item}>{item}</option>)}</select></div></div>
              <div className="grid-2"><div><label className="form-label">Property Listing Type *</label><select className="form-select" value={form.propertyListingType} onChange={event => set('propertyListingType', event.target.value)}><option value="new">New Property</option><option value="used">Used / Resale Property</option></select></div><div><label className="form-label">Current Listing Status</label><select className="form-select" value={form.condition} onChange={event => set('condition', event.target.value)}><option value="ready">Ready to Move</option><option value="under_construction">Under Construction</option><option value="completed">Completed</option><option value="needs_renovation">Needs Renovation</option></select></div></div>
              <div><label className="form-label">Property Title *</label><input className="form-input" value={form.title} onChange={event => set('title', event.target.value)} />{errors.title && <div className="form-error">{errors.title}</div>}</div>
              <div><label className="form-label">Description *</label><textarea className="form-textarea" value={form.description} onChange={event => set('description', event.target.value)} />{errors.description && <div className="form-error">{errors.description}</div>}</div>
              <div className="grid-3"><div><label className="form-label">Sale Price (₹) *</label><input className="form-input" type="number" value={form.price} onChange={event => set('price', event.target.value)} />{errors.price && <div className="form-error">{errors.price}</div>}</div><div><label className="form-label">Negotiable</label><select className="form-select" value={form.negotiable} onChange={event => set('negotiable', event.target.value)}><option value="yes">Yes</option><option value="no">No</option></select></div><div><label className="form-label">Condition</label><select className="form-select" value={form.condition} onChange={event => set('condition', event.target.value)}><option value="ready">Ready to Move</option><option value="under_construction">Under Construction</option><option value="completed">Completed</option><option value="needs_renovation">Needs Renovation</option></select></div></div>
              <div className="grid-3"><div><label className="form-label">Property Size *</label><input className="form-input" type="number" value={form.size} onChange={event => set('size', event.target.value)} />{errors.size && <div className="form-error">{errors.size}</div>}</div><div><label className="form-label">Measurement Unit</label><select className="form-select" value={form.measurementUnit} onChange={event => set('measurementUnit', event.target.value)}><option>sq.ft.</option><option>sq.m.</option><option>acre</option><option>gunta</option><option>hectare</option><option>cent</option></select></div><div><label className="form-label">Facing</label><select className="form-select" value={form.facing} onChange={event => set('facing', event.target.value)}><option value="">Select</option>{['North','South','East','West','North-East','North-West','South-East','South-West'].map(item => <option key={item}>{item}</option>)}</select></div></div>
              {isResidential && <div className="grid-4"><div><label className="form-label">BHK</label><select className="form-select" value={form.bhk} onChange={event => set('bhk', event.target.value)}>{['1','2','3','4','5','6'].map(item => <option key={item} value={item}>{item} BHK</option>)}</select></div><div><label className="form-label">Bedrooms</label><input className="form-input" type="number" value={form.bedrooms} onChange={event => set('bedrooms', event.target.value)} /></div><div><label className="form-label">Bathrooms</label><input className="form-input" type="number" value={form.bathrooms} onChange={event => set('bathrooms', event.target.value)} /></div><div><label className="form-label">Furnishing</label><select className="form-select" value={form.furnishing} onChange={event => set('furnishing', event.target.value)}><option value="unfurnished">Unfurnished</option><option value="semi-furnished">Semi-furnished</option><option value="furnished">Furnished</option></select></div></div>}
              {(isResidential || form.category === 'commercial') && <div className="grid-3"><div><label className="form-label">Floor</label><input className="form-input" value={form.floor} onChange={event => set('floor', event.target.value)} /></div><div><label className="form-label">Total Floors</label><input className="form-input" value={form.totalFloors} onChange={event => set('totalFloors', event.target.value)} /></div><div><label className="form-label">Parking</label><input className="form-input" value={form.parking} onChange={event => set('parking', event.target.value)} /></div></div>}
              {isLand && <div className="grid-2"><div><label className="form-label">Road Access</label><select className="form-select" value={form.roadAccess} onChange={event => set('roadAccess', event.target.value)}><option value="">Select</option><option>Highway</option><option>Main Road</option><option>Village Road</option><option>No Direct Road</option></select></div><div><label className="form-label">Water Availability</label><select className="form-select" value={form.waterAvailability} onChange={event => set('waterAvailability', event.target.value)}><option value="">Select</option><option>Borewell</option><option>Municipal Supply</option><option>Canal</option><option>River / Stream</option></select></div></div>}
            </div>
          )}

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontWeight: 800 }}>Owner Details</h3>
              <div className="grid-2"><div><label className="form-label">Owner Name *</label><input className="form-input" value={form.ownerName} onChange={event => set('ownerName', event.target.value)} />{errors.ownerName && <div className="form-error">{errors.ownerName}</div>}</div><div><label className="form-label">Owner Type</label><select className="form-select" value={form.ownerType} onChange={event => set('ownerType', event.target.value)}><option value="sole">Sole Owner</option><option value="joint">Joint Owner</option><option value="poa">Power of Attorney</option><option value="broker">Authorized Broker / Agent</option><option value="builder">Builder / Developer</option></select></div></div>
              <div className="grid-3"><div><label className="form-label">Mobile Number *</label><input className="form-input" type="tel" value={form.ownerPhone} onChange={event => set('ownerPhone', event.target.value)} />{errors.ownerPhone && <div className="form-error">{errors.ownerPhone}</div>}</div><div><label className="form-label">WhatsApp</label><select className="form-select" value={form.whatsapp} onChange={event => set('whatsapp', event.target.value)}><option value="yes">Yes</option><option value="no">No</option></select></div><div><label className="form-label">Email</label><input className="form-input" type="email" value={form.ownerEmail} onChange={event => set('ownerEmail', event.target.value)} />{errors.ownerEmail && <div className="form-error">{errors.ownerEmail}</div>}</div></div>
              <h3 style={{ fontWeight: 800, borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>Builder / Developer</h3>
              <div className="grid-2"><div><label className="form-label">Builder Name</label><input className="form-input" value={form.builderName} onChange={event => set('builderName', event.target.value)} /></div><div><label className="form-label">Developer Company</label><input className="form-input" value={form.developerCompany} onChange={event => set('developerCompany', event.target.value)} /></div></div>
              <div className="grid-2"><div><label className="form-label">Project Contact</label><input className="form-input" value={form.builderContact} onChange={event => set('builderContact', event.target.value)} /></div><div><label className="form-label">Company Email</label><input className="form-input" type="email" value={form.builderEmail} onChange={event => set('builderEmail', event.target.value)} /></div></div>
              <div><label className="form-label">Company / Project Details</label><textarea className="form-textarea" value={form.companyDetails} onChange={event => set('companyDetails', event.target.value)} placeholder="RERA, approvals and completed projects" /></div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontWeight: 800 }}>India Location</h3>
              <div className="grid-2"><div><label className="form-label">Country</label><input className="form-input" value={form.country} disabled /></div><div><label className="form-label">State / UT *</label><select className="form-select" value={form.state} onChange={event => set('state', event.target.value)}><option value="">Select state</option>{INDIAN_STATES.map(item => <option key={item}>{item}</option>)}</select>{errors.state && <div className="form-error">{errors.state}</div>}</div></div>
              <div className="grid-3"><div><label className="form-label">District *</label>{form.state === 'Karnataka' ? <select className="form-select" value={form.district} onChange={event => set('district', event.target.value)}><option value="">Select district</option>{Object.keys(KarnatakaLocations).map(item => <option key={item}>{item}</option>)}</select> : <input className="form-input" value={form.district} onChange={event => set('district', event.target.value)} />}{errors.district && <div className="form-error">{errors.district}</div>}</div><div><label className="form-label">City *</label><input className="form-input" value={form.city} onChange={event => set('city', event.target.value)} />{errors.city && <div className="form-error">{errors.city}</div>}</div><div><label className="form-label">PIN Code *</label><input className="form-input" maxLength={6} value={form.pincode} onChange={event => set('pincode', event.target.value)} />{errors.pincode && <div className="form-error">{errors.pincode}</div>}</div></div>
              <div className="grid-3"><div><label className="form-label">Taluk / Tehsil</label><input className="form-input" value={form.taluk} onChange={event => set('taluk', event.target.value)} /></div><div><label className="form-label">Village</label><input className="form-input" value={form.village} onChange={event => set('village', event.target.value)} /></div><div><label className="form-label">Locality</label><input className="form-input" value={form.locality} onChange={event => set('locality', event.target.value)} /></div></div>
              <div><label className="form-label">Google Maps Location</label><input className="form-input" value={form.mapsUrl} onChange={event => set('mapsUrl', event.target.value)} placeholder="Paste Google Maps URL or coordinates" /></div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontWeight: 800 }}>Photos & Documents</h3>
              <div><label className="form-label">Property Photos — up to 20</label><div onClick={() => fileRef.current.click()} style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: '#f8fafc' }}><Upload size={28} style={{ margin: '0 auto 0.5rem' }} /><strong>Upload or drag photos</strong><p style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>{form.images.length} / 20 selected</p><input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={event => handleFiles(event.target.files, 'images')} /></div></div>
              {form.images.length > 0 && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(100px,1fr))', gap: '0.6rem' }}>{form.images.map((image, index) => <div key={`${image.name}-${index}`} style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', borderRadius: 'var(--radius-md)', border: index === 0 ? '3px solid var(--primary)' : '1px solid var(--border)' }}><img src={image.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />{index > 0 && <button type="button" onClick={() => makeCover(index)} style={{ position: 'absolute', left: 4, bottom: 4, border: 0, borderRadius: 99, background: 'white', fontSize: '0.65rem', cursor: 'pointer' }}>Cover</button>}<button type="button" onClick={() => removeFile('images', index)} style={{ position: 'absolute', right: 4, top: 4, width: 22, height: 22, border: 0, borderRadius: '50%', background: '#ef4444', color: 'white', cursor: 'pointer' }}><X size={12} /></button></div>)}</div>}
              <div className="grid-2"><div><label className="form-label">Floor Plans</label><input className="form-input" type="file" accept="image/*,.pdf" multiple onChange={event => handleFiles(event.target.files, 'floorPlans')} /><span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{form.floorPlans.length} selected</span></div><div><label className="form-label">Videos</label><input className="form-input" type="file" accept="video/*" multiple onChange={event => handleFiles(event.target.files, 'videos')} /><span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{form.videos.length} selected</span></div></div>
              <div><label className="form-label">Ownership & Approval Documents</label><input className="form-input" type="file" accept="image/*,.pdf" multiple onChange={event => handleFiles(event.target.files, 'documents')} /><span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{form.documents.length} selected</span></div>
            </div>
          )}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontWeight: 800 }}>Review & Submit</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '0.75rem' }}>
                {[
                  ['Property', `${category?.label || ''} — ${form.subcategory}`],
                  ['Title', form.title],
                  ['Price', `₹${Number(form.price || 0).toLocaleString('en-IN')}${form.negotiable === 'yes' ? ' (Negotiable)' : ''}`],
                  ['Size', `${form.size} ${form.measurementUnit}`],
                  ['Owner', `${form.ownerName} — ${form.ownerPhone}`],
                  ['Builder', form.developerCompany || form.builderName || 'Not applicable'],
                  ['Location', [form.locality, form.city, form.district, form.state, form.pincode].filter(Boolean).join(', ')],
                  ['Media', `${form.images.length} photos, ${form.floorPlans.length} floor plan, ${form.videos.length} video, ${form.documents.length} document`],
                ].map(([label, value]) => <div key={label} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}><div style={{ color: 'var(--text-light)', fontSize: '0.72rem', marginBottom: '0.25rem' }}>{label}</div><strong style={{ fontSize: '0.82rem' }}>{value}</strong></div>)}
              </div>
              <div><label className="form-label">Description</label><p style={{ color: 'var(--text-mid)', fontSize: '0.82rem', lineHeight: 1.7 }}>{form.description}</p></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', alignItems: 'end', background: '#f8fafc', borderRadius: 'var(--radius-md)', padding: '0.9rem' }}>
                <div><label className="form-label">Spam check: What is {captcha.a} + {captcha.b}?</label><input className="form-input" type="number" value={captchaAnswer} onChange={event => setCaptchaAnswer(event.target.value)} />{errors.captcha && <div className="form-error">{errors.captcha}</div>}</div>
                <div style={{ color: 'var(--primary-dark)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', paddingBottom: '0.25rem' }}><AlertCircle size={15} /> Public submission</div>
              </div>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderTop: '1px solid var(--border)' }}>
          <button onClick={step === 0 ? onClose : back} className="btn btn-ghost">{step === 0 ? 'Cancel' : '← Back'}</button>
          {step < 4 ? <button onClick={next} className="btn btn-primary">Continue →</button> : <button onClick={submit} className="btn btn-primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Confirm & Submit'}</button>}
        </div>
      </div>
    </div>
  );
}

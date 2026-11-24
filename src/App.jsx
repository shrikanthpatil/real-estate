import { useState, useEffect, useCallback } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ListingsGrid from './components/ListingsGrid';
import PropertyModal from './components/PropertyModal';
import PostPropertyForm from './components/PostPropertyForm';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import AIChatWidget from './components/AIChatWidget';
import NRICorner from './components/NRICorner';
import EmiCalculator from './components/EmiCalculator';
import BrokerPortal from './components/BrokerPortal';
import { sampleListings } from './data/sampleListings';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

// ── Toast system ──────────────────────────────────────────────
function Toast({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === 'success' && <CheckCircle size={18} />}
          {t.type === 'error' && <AlertCircle size={18} />}
          {t.type === 'info' && <Info size={18} />}
          <span style={{ flex: 1 }}>{t.message}</span>
          <button onClick={() => removeToast(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.7, color: 'white', display: 'flex' }}>
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Load listings from localStorage + sample data ────────────
const LS_KEY = 'openestate_listings';
const ENQUIRY_KEY = 'openestate_enquiries';
const BOOKING_KEY = 'openestate_bookings';
const REPORT_KEY = 'openestate_reports';
const BLOCKED_KEY = 'openestate_blocked_users';
const PENDING_KEY = 'openestate_pending_listings';
const AUDIT_KEY = 'openestate_admin_audit';

function loadListings() {
  try {
    const saved = localStorage.getItem(LS_KEY);
    let blocked = [];
    try { blocked = JSON.parse(localStorage.getItem(BLOCKED_KEY) || '[]'); } catch {}
    const isBlocked = listing =>
      blocked.some(user =>
        (listing.sellerPhone && user.phone && listing.sellerPhone.replace(/\D/g, '').slice(-10) === user.phone.replace(/\D/g, '').slice(-10)) ||
        (listing.sellerEmail && user.email && listing.sellerEmail.toLowerCase() === user.email.toLowerCase())
      );
    if (saved) {
      const userListings = JSON.parse(saved);
      const publicUserListings = userListings.filter(l =>
        l.moderationStatus === 'approved' &&
        l.type !== 'rent' &&
        !isBlocked(l)
      );
      // Merge: user listings first, then sample (avoid duplicates by id)
      const sampleIds = new Set(sampleListings.map(l => l.id));
      const userOnly = publicUserListings.filter(l => !sampleIds.has(l.id));
      return [...userOnly, ...sampleListings.filter(l => l.type !== 'rent' && !isBlocked(l))];
    }
  } catch (e) { /* ignore */ }
  return sampleListings;
}

function saveUserListings(listings) {
  try {
    // Only save user-created listings (not sample data)
    const sampleIds = new Set(sampleListings.map(l => l.id));
    const userListings = listings.filter(l => !sampleIds.has(l.id));
    localStorage.setItem(LS_KEY, JSON.stringify(userListings));
    return true;
  } catch {
    return false;
  }
}

export default function App() {
  const [listings, setListings] = useState(loadListings);
  const [enquiries, setEnquiries] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(ENQUIRY_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [activeFilter, setActiveFilter] = useState({ type: null, category: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [submittedListing, setSubmittedListing] = useState(null);
  const [showNRI, setShowNRI] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showBroker, setShowBroker] = useState(false);
  const [supportMenuOpen, setSupportMenuOpen] = useState(false);
  const [bookings, setBookings] = useState(() => {
    try { return JSON.parse(localStorage.getItem(BOOKING_KEY) || '[]'); } catch { return []; }
  });
  const [reports, setReports] = useState(() => {
    try { return JSON.parse(localStorage.getItem(REPORT_KEY) || '[]'); } catch { return []; }
  });
  const [blockedUsers, setBlockedUsers] = useState(() => {
    try { return JSON.parse(localStorage.getItem(BLOCKED_KEY) || '[]'); } catch { return []; }
  });
  const [pendingListings, setPendingListings] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PENDING_KEY) || 'null');
      if (saved) return saved;
    } catch {}
    return [
      {
        id: 'PENDING-001',
        propertyId: 'OE-PENDING-001',
        type: 'sell',
        category: 'apartment',
        subcategory: '2 BHK',
        title: 'Pending 2BHK Listing for Team Review',
        price: 6750000,
        city: 'Mysuru',
        state: 'Karnataka',
        district: 'Mysuru',
        locality: 'Vijayanagar',
        area: 1180,
        bedrooms: 2,
        bathrooms: 2,
        furnishing: 'semi-furnished',
        sellerName: 'Test Seller',
        sellerPhone: '+91 98765 00112',
        sellerEmail: 'pending@example.com',
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'],
        postedAt: new Date().toISOString(),
        moderationStatus: 'pending',
      },
    ];
  });
  const [auditLog, setAuditLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]'); } catch { return []; }
  });
  const [toasts, setToasts] = useState([]);
  const [view, setView] = useState('home'); // 'home' | 'listings'

  // Toast helpers
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4500);
  }, []);
  const removeToast = (id) => setToasts(t => t.filter(x => x.id !== id));

  // Auto-persist user listings
  useEffect(() => {
    if (!saveUserListings(listings)) {
      addToast('This listing could not be saved in this browser. Free up storage and try again.', 'error');
    }
  }, [listings, addToast]);

  useEffect(() => {
    try {
      localStorage.setItem(ENQUIRY_KEY, JSON.stringify(enquiries));
    } catch {
      addToast('The enquiry could not be saved in this browser.', 'error');
    }
  }, [enquiries, addToast]);

  useEffect(() => {
    try { localStorage.setItem(BOOKING_KEY, JSON.stringify(bookings)); } catch {}
  }, [bookings]);

  useEffect(() => {
    try { localStorage.setItem(REPORT_KEY, JSON.stringify(reports)); } catch {}
  }, [reports]);

  useEffect(() => {
    try { localStorage.setItem(BLOCKED_KEY, JSON.stringify(blockedUsers)); } catch {}
  }, [blockedUsers]);

  useEffect(() => {
    try { localStorage.setItem(PENDING_KEY, JSON.stringify(pendingListings)); } catch {}
  }, [pendingListings]);

  useEffect(() => {
    try { localStorage.setItem(AUDIT_KEY, JSON.stringify(auditLog)); } catch {}
  }, [auditLog]);

  // Handle hero search
  const handleHeroSearch = (city, category, budget, listingType, advanced = {}) => {
    const priceRanges = {
      under25: { min: 0, max: 2500000 },
      '25-50': { min: 2500000, max: 5000000 },
      '50-100': { min: 5000000, max: 10000000 },
      '1-3cr': { min: 10000000, max: 30000000 },
      above3cr: { min: 30000000, max: Infinity },
    };
    setSearchQuery(city.trim());
    const filter = {
      type: listingType ? 'sell' : null,
      category: category || null,
      priceRange: priceRanges[budget] || null,
      minPrice: budget?.startsWith?.('min:') ? Number(budget.split(':')[1]) : null,
      maxPrice: advanced.maxBudget ? Number(advanced.maxBudget) : null,
      state: advanced.state || null,
      district: advanced.district || null,
    };
    setActiveFilter(filter);
    setView('listings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle navbar search
  const handleNavSearch = (q) => {
    const search = q.trim();
    setSearchQuery(search);
    setActiveFilter({ type: null, category: null, priceRange: null });
    if (search) setView('listings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearAllFilters = () => {
    setActiveFilter({ type: null, category: null, priceRange: null });
    setSearchQuery('');
  };

  // Nav filter
  const handleFilterNav = (type, category) => {
    setActiveFilter({ type, category });
    setSearchQuery('');
    if (!type && !category) {
      setView('home');
    } else {
      setView('listings');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Category card click
  const handleCategoryClick = (categoryKey) => {
    setActiveFilter({ type: null, category: categoryKey });
    setSearchQuery('');
    setView('listings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnquiry = (enquiry) => {
    setEnquiries(previous => [enquiry, ...previous]);
    addToast('Your property enquiry has been submitted.', 'success');
  };

  const handleBooking = (booking) => {
    setBookings(previous => [booking, ...previous]);
    addToast('Your visit request has been saved.', 'success');
  };

  const handleReport = (reason, listing) => {
    setReports(previous => [{
      id: `RPT-${Date.now()}`,
      targetType: 'listing',
      targetId: listing?.id,
      targetTitle: listing?.title,
      reason,
      status: 'open',
      createdAt: new Date().toISOString(),
    }, ...previous]);
  };

  const handleBlockUser = (listing) => {
    if (!listing) return;
    setBlockedUsers(previous => {
      if (previous.some(user => user.phone === listing.sellerPhone)) return previous;
      return [{
        id: `BLK-${Date.now()}`,
        name: listing.sellerName,
        phone: listing.sellerPhone,
        email: listing.sellerEmail,
        reason: 'Blocked by team report',
        createdAt: new Date().toISOString(),
      }, ...previous];
    });
    setListings(previous => previous.filter(item =>
      !(item.sellerPhone === listing.sellerPhone || item.sellerEmail === listing.sellerEmail)
    ));
    setPendingListings(previous => previous.filter(item =>
      !(item.sellerPhone === listing.sellerPhone || item.sellerEmail === listing.sellerEmail)
    ));
    addAudit('Blocked user and hidden listings', 'user', listing.sellerPhone || listing.sellerEmail);
  };

  const addAudit = (action, targetType, targetId, reason = '') => {
    setAuditLog(previous => [{
      id: `AUD-${Date.now()}`,
      action,
      targetType,
      targetId,
      reason,
      admin: 'Team Admin',
      createdAt: new Date().toISOString(),
    }, ...previous]);
  };

  const handleAdminUpdate = (updated) => {
    if (updated.moderationStatus === 'approved') {
      setPendingListings(previous => previous.filter(item => item.id !== updated.id));
      setListings(previous => [updated, ...previous.filter(item => item.id !== updated.id)]);
      addAudit('Approved listing', 'listing', updated.id);
    } else if (updated.moderationStatus === 'rejected') {
      setPendingListings(previous => previous.map(item => item.id === updated.id ? updated : item));
      setListings(previous => previous.filter(item => item.id !== updated.id));
      addAudit('Rejected listing', 'listing', updated.id, updated.rejectionReason || '');
    } else {
      setListings(previous => previous.map(item => item.id === updated.id ? updated : item));
      setPendingListings(previous => previous.map(item => item.id === updated.id ? updated : item));
      addAudit(updated.status === 'sold' ? 'Marked listing sold' : 'Updated listing', 'listing', updated.id);
    }
  };

  const handleAdminDelete = (id) => {
    setPendingListings(previous => previous.filter(item => item.id !== id));
    setListings(previous => previous.filter(item => item.id !== id));
    addAudit('Removed listing', 'listing', id);
  };

  // Submit new listing
  const handleSubmitListing = (listing) => {
    setPendingListings(prev => [{ ...listing, type: 'sell', moderationStatus: 'pending' }, ...prev]);
    setShowPostForm(false);
    setSubmittedListing(listing);
    addToast('Property submitted for admin approval.', 'success');
  };

  // Compute section title
  const getSectionTitle = () => {
    if (searchQuery) return `Results for "${searchQuery}"`;
    if (activeFilter.type === 'sell' && !activeFilter.category) return 'Properties for Sale';
    if (activeFilter.category) {
      const catMap = { apartment: 'Apartments & Flats', house: 'Houses & Villas', plot: 'Plots & Land', commercial: 'Commercial Spaces' };
      return catMap[activeFilter.category] || 'Listings';
    }
    return 'All Latest Listings';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        onSearch={handleNavSearch}
        onFilterNav={handleFilterNav}
        onPostProperty={() => setShowPostForm(true)}
        onAdmin={() => setShowAdmin(true)}
        activeFilter={activeFilter}
      />

      <main style={{ flex: 1 }}>
        {view === 'home' && (
          <>
            <HeroSection onSearch={handleHeroSearch} onCategoryClick={handleCategoryClick} />
            <ListingsGrid
              listings={listings}
              activeFilter={{ type: null, category: null }}
              searchQuery=""
              onCardClick={setSelectedListing}
              title="Featured & Latest Listings"
            />
          </>
        )}

        {view === 'listings' && (
          <div style={{ paddingTop: '1rem' }}>
            <ListingsGrid
              listings={listings}
              activeFilter={activeFilter}
              searchQuery={searchQuery}
              onCardClick={setSelectedListing}
              title={getSectionTitle()}
              onClearFilters={handleClearAllFilters}
            />
          </div>
        )}
      </main>

      <Footer onCategoryClick={handleCategoryClick} onAdmin={() => setShowAdmin(true)} />

      <div className="support-dock" style={{ position: 'fixed', left: 18, bottom: 18, zIndex: 890, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
        {supportMenuOpen && (
          <div className="support-dock-menu" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', padding: '0.5rem', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
            <button onClick={() => { setShowBroker(true); setSupportMenuOpen(false); }} style={{ border: 0, background: '#f8fafc', borderRadius: 'var(--radius-sm)', padding: '0.55rem 0.75rem', cursor: 'pointer', whiteSpace: 'nowrap', textAlign: 'left' }}>🏢 Broker Portal</button>
            <button onClick={() => { setShowCalculator(true); setSupportMenuOpen(false); }} style={{ border: 0, background: '#f8fafc', borderRadius: 'var(--radius-sm)', padding: '0.55rem 0.75rem', cursor: 'pointer', whiteSpace: 'nowrap', textAlign: 'left' }}>🧮 EMI Calculator</button>
            <button onClick={() => { setShowNRI(true); setSupportMenuOpen(false); }} style={{ border: 0, background: '#f8fafc', borderRadius: 'var(--radius-sm)', padding: '0.55rem 0.75rem', cursor: 'pointer', whiteSpace: 'nowrap', textAlign: 'left' }}>🌍 NRI Corner</button>
          </div>
        )}
        <button className="support-dock-toggle" onClick={() => setSupportMenuOpen(open => !open)} aria-label="Open support tools" style={{ minWidth: 86, border: '1px solid var(--border)', borderRadius: '999px', background: 'white', color: 'var(--text-mid)', padding: '0.7rem 0.9rem', boxShadow: 'var(--shadow-lg)', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem' }}>
          {supportMenuOpen ? '×' : 'Support'}
        </button>
      </div>
      {showNRI && <NRICorner onClose={() => setShowNRI(false)} />}
      {showCalculator && <div className="modal-overlay" onClick={() => setShowCalculator(false)}><div className="modal-box" style={{ width: 'min(520px, calc(100% - 2rem))', padding: '1rem' }} onClick={event => event.stopPropagation()}><EmiCalculator initialPrice={5000000} /></div></div>}
      {showBroker && <BrokerPortal listings={listings} onClose={() => setShowBroker(false)} />}
      <AIChatWidget listing={selectedListing} onBookVisit={() => selectedListing && setSelectedListing({ ...selectedListing })} />

      {/* Property Detail Modal */}
      {selectedListing && (
        <PropertyModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onReport={(reason) => { handleReport(reason || 'Reported by user', selectedListing); addToast('Thank you. This listing has been flagged for review.', 'info'); }}
          onEnquire={handleEnquiry}
          onBooking={handleBooking}
          onChatReport={(reason) => handleReport(reason, selectedListing)}
        />
      )}

      {/* Post Property Form */}
      {showPostForm && (
        <PostPropertyForm
          onClose={() => setShowPostForm(false)}
          onSubmit={handleSubmitListing}
        />
      )}

      {showAdmin && (
        <AdminDashboard
          listings={[...pendingListings, ...listings]}
          enquiries={enquiries}
          bookings={bookings}
          reports={reports}
          blockedUsers={blockedUsers}
          auditLog={auditLog}
          onClose={() => setShowAdmin(false)}
          onUpdate={handleAdminUpdate}
          onDelete={handleAdminDelete}
          onUpdateEnquiry={(updated) => setEnquiries(prev => prev.map(item => item.id === updated.id ? updated : item))}
          onUpdateReport={(updated) => setReports(prev => prev.map(item => item.id === updated.id ? updated : item))}
          onBlockUser={handleBlockUser}
        />
      )}

      {submittedListing && (
        <div className="modal-overlay" onClick={() => setSubmittedListing(null)}>
          <div className="modal-box" style={{ maxWidth: 520, width: '100%', padding: '2rem', textAlign: 'center' }} onClick={event => event.stopPropagation()}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary-light)', display: 'grid', placeItems: 'center', margin: '0 auto 1rem' }}><CheckCircle size={32} color="var(--primary)" /></div>
            <h2 style={{ marginBottom: '0.5rem' }}>Submitted for approval</h2>
            <p style={{ color: 'var(--text-mid)', marginBottom: '1rem', lineHeight: 1.6 }}>Property ID: <strong>{submittedListing.propertyId}</strong></p>
            <p style={{ color: 'var(--text-light)', fontSize: '0.82rem', marginBottom: '1rem' }}>Keep this secure token private. It can be used to manage this listing.</p>
            <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.75rem', wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.75rem', marginBottom: '1rem' }}>{submittedListing.managementToken}</div>
            <button className="btn btn-primary" onClick={() => setSubmittedListing(null)} style={{ width: '100%' }}>Done</button>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

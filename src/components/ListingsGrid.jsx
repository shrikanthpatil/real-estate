import { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal, ChevronDown, X, Filter } from 'lucide-react';
import PropertyCard from './PropertyCard';
import { categoryConfig } from '../data/sampleListings';
import { CITY_COORDINATES, getListingCoordinates, haversineDistance } from '../data/nearMe';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'area-desc', label: 'Area: Largest First' },
];

const BHK_OPTIONS = [1, 2, 3, 4, '5+'];
const PRICE_RANGES = [
  { label: 'Under ₹25L', min: 0, max: 2500000 },
  { label: '₹25L–₹50L', min: 2500000, max: 5000000 },
  { label: '₹50L–₹1Cr', min: 5000000, max: 10000000 },
  { label: '₹1Cr–₹3Cr', min: 10000000, max: 30000000 },
  { label: 'Above ₹3Cr', min: 30000000, max: Infinity },
];

export default function ListingsGrid({ listings, activeFilter, searchQuery, onCardClick, title, onClearFilters }) {
  const [sort, setSort] = useState('newest');
  const [filterType, setFilterType] = useState('');
  const [filterBHK, setFilterBHK] = useState('');
  const [filterPriceRange, setFilterPriceRange] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterListingType, setFilterListingType] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [nearLocation, setNearLocation] = useState(null);
  const [nearRadius, setNearRadius] = useState(10);
  const [nearStatus, setNearStatus] = useState('');
  const [manualCity, setManualCity] = useState('');

  const hasActiveFilters = filterType || filterBHK || filterPriceRange || filterCategory || filterListingType || nearLocation;

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setNearStatus('Location is not supported by this browser.');
      return;
    }
    setNearStatus('Getting your location...');
    navigator.geolocation.getCurrentPosition(
      position => {
        setNearLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setManualCity('');
        setNearStatus('Using your current location');
      },
      () => setNearStatus('Location permission was denied. Select a city manually below.')
    );
  };

  const useManualLocation = (city) => {
    setManualCity(city);
    if (CITY_COORDINATES[city]) {
      setNearLocation(CITY_COORDINATES[city]);
      setNearStatus(`Using ${city} location`);
    }
  };

  useEffect(() => {
    setFilterType('');
    setFilterBHK('');
    setFilterPriceRange(null);
    setFilterCategory('');
    setFilterListingType('');
    setNearLocation(null);
    setNearRadius(10);
    setManualCity('');
    setNearStatus('');
  }, [searchQuery, activeFilter?.type, activeFilter?.category, activeFilter?.priceRange?.label]);

  const filtered = useMemo(() => {
    let result = [...listings];

    // Apply nav/page-level filter
    if (activeFilter?.type) result = result.filter(l => l.type === activeFilter.type);
    if (activeFilter?.category) result = result.filter(l => l.category === activeFilter.category);
    if (activeFilter?.priceRange) {
      result = result.filter(l => l.price >= activeFilter.priceRange.min && l.price < activeFilter.priceRange.max);
    }
    if (activeFilter?.minPrice) result = result.filter(l => l.price >= activeFilter.minPrice);
    if (activeFilter?.maxPrice) result = result.filter(l => l.price <= activeFilter.maxPrice);
    if (activeFilter?.state) result = result.filter(l => (l.state || '').toLowerCase().includes(activeFilter.state.toLowerCase()));
    if (activeFilter?.district) result = result.filter(l => (l.district || '').toLowerCase().includes(activeFilter.district.toLowerCase()));

    // Apply local sidebar filters
    if (filterType) result = result.filter(l => l.type === filterType);
    if (filterCategory) result = result.filter(l => l.category === filterCategory);
    if (filterListingType) result = result.filter(l => (l.propertyListingType || 'used') === filterListingType);
    if (filterBHK) {
      const bk = filterBHK === '5+' ? 5 : Number(filterBHK);
      result = result.filter(l => filterBHK === '5+' ? l.bedrooms >= 5 : l.bedrooms === bk);
    }
    if (filterPriceRange) {
      result = result.filter(l => l.price >= filterPriceRange.min && l.price < filterPriceRange.max);
    }

    // Search
    if (searchQuery.trim()) {
      const terms = searchQuery
        .toLowerCase()
        .replace(/[^a-z0-9\s.-]/g, ' ')
        .split(/\s+/)
        .filter(Boolean);
      result = result.filter(l => {
        const searchable = [
          l.title,
          l.city,
          l.locality,
          l.landmark,
          l.description,
          l.state,
          l.district,
          l.subcategory,
          categoryConfig[l.category]?.label,
        ].join(' ').toLowerCase();
        return terms.every(term => searchable.includes(term));
      });
    }

    if (nearLocation) {
      result = result
        .map(listing => {
          const coordinates = getListingCoordinates(listing);
          const distanceKm = haversineDistance(nearLocation, coordinates);
          return distanceKm === null ? null : { ...listing, distanceKm };
        })
        .filter(listing => listing && listing.distanceKm <= nearRadius);
    }

    // Sort
    if (sort === 'newest') result.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sort === 'area-desc') result.sort((a, b) => b.area - a.area);

    return result;
  }, [listings, activeFilter, filterType, filterBHK, filterPriceRange, filterCategory, filterListingType, searchQuery, sort, nearLocation, nearRadius]);

  const clearFilters = () => {
    setFilterType('');
    setFilterBHK('');
    setFilterPriceRange(null);
    setFilterCategory('');
    setFilterListingType('');
    setNearLocation(null);
    setNearRadius(10);
    setManualCity('');
    setNearStatus('');
    onClearFilters?.();
  };

  return (
    <section style={{ padding: '2.5rem 0' }}>
      <div className="container">
        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.2rem' }}>
              {title || (searchQuery ? `Results for "${searchQuery}"` : 'Latest Property Listings')}
            </h2>
            <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>{filtered.length} {filtered.length === 1 ? 'property' : 'properties'} found</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button onClick={() => setShowFilters(!showFilters)} className="btn btn-ghost" style={{ position: 'relative', fontSize: '0.85rem' }}>
              <SlidersHorizontal size={15} />
              Filters
              {hasActiveFilters && <span style={{ position: 'absolute', top: -4, right: -4, width: 8, height: 8, background: 'var(--primary)', borderRadius: '50%' }} />}
            </button>
            <select className="form-select" value={sort} onChange={e => setSort(e.target.value)} style={{ width: 'auto', fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="animate-fadeIn" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start' }}>
              {/* Listing type */}
              <div>
                <label className="form-label">Listing Type</label>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {[['', 'All'], ['sell', 'For Sale']].map(([v, l]) => (
                    <button key={v} onClick={() => setFilterType(v)} style={{ padding: '0.3rem 0.9rem', borderRadius: 'var(--radius-sm)', border: `1.5px solid ${filterType === v ? 'var(--primary)' : 'var(--border)'}`, background: filterType === v ? 'var(--primary-light)' : 'white', cursor: 'pointer', fontWeight: 500, fontSize: '0.8rem', color: filterType === v ? 'var(--primary-dark)' : 'var(--text-mid)', transition: 'all 0.15s' }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="form-label">New / Used</label>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {[['', 'All'], ['new', 'New'], ['used', 'Used / Resale']].map(([value, label]) => (
                    <button key={value} onClick={() => setFilterListingType(value)} style={{ padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-sm)', border: `1.5px solid ${filterListingType === value ? 'var(--primary)' : 'var(--border)'}`, background: filterListingType === value ? 'var(--primary-light)' : 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.78rem', color: filterListingType === value ? 'var(--primary-dark)' : 'var(--text-mid)' }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Near me */}
              <div style={{ minWidth: 260 }}>
                <label className="form-label">Near Me</label>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <button type="button" onClick={useCurrentLocation} style={{ padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', border: `1.5px solid ${nearLocation ? 'var(--primary)' : 'var(--border)'}`, background: nearLocation ? 'var(--primary-light)' : 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.78rem', color: nearLocation ? 'var(--primary-dark)' : 'var(--text-mid)' }}>📍 Use my location</button>
                  <select className="form-select" value={nearRadius} onChange={e => setNearRadius(Number(e.target.value))} style={{ width: 112, fontSize: '0.78rem', padding: '0.35rem 0.55rem' }}>
                    {[1,5,10,25,50,100].map(radius => <option key={radius} value={radius}>Within {radius} km</option>)}
                  </select>
                </div>
                <select className="form-select" value={manualCity} onChange={e => useManualLocation(e.target.value)} style={{ marginTop: '0.45rem', fontSize: '0.78rem', padding: '0.35rem 0.55rem' }}>
                  <option value="">Or select a city manually</option>
                  {Object.keys(CITY_COORDINATES).filter((city, index, cities) => cities.indexOf(city) === index).map(city => <option key={city} value={city}>{city}</option>)}
                </select>
                {nearStatus && <div style={{ marginTop: '0.35rem', fontSize: '0.72rem', color: 'var(--text-light)' }}>{nearStatus}</div>}
              </div>
              {/* Category */}
              <div>
                <label className="form-label">Category</label>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {[['', 'All'], ...Object.entries(categoryConfig).map(([k, v]) => [k, v.icon + ' ' + v.label.split(' ')[0]])].map(([v, l]) => (
                    <button key={v} onClick={() => setFilterCategory(v)} style={{ padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-sm)', border: `1.5px solid ${filterCategory === v ? 'var(--primary)' : 'var(--border)'}`, background: filterCategory === v ? 'var(--primary-light)' : 'white', cursor: 'pointer', fontWeight: 500, fontSize: '0.78rem', color: filterCategory === v ? 'var(--primary-dark)' : 'var(--text-mid)', transition: 'all 0.15s' }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              {/* BHK */}
              <div>
                <label className="form-label">BHK</label>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button onClick={() => setFilterBHK('')} style={{ padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-sm)', border: `1.5px solid ${!filterBHK ? 'var(--primary)' : 'var(--border)'}`, background: !filterBHK ? 'var(--primary-light)' : 'white', cursor: 'pointer', fontWeight: 500, fontSize: '0.8rem', color: !filterBHK ? 'var(--primary-dark)' : 'var(--text-mid)', transition: 'all 0.15s' }}>Any</button>
                  {BHK_OPTIONS.map(b => (
                    <button key={b} onClick={() => setFilterBHK(String(b))} style={{ padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-sm)', border: `1.5px solid ${filterBHK === String(b) ? 'var(--primary)' : 'var(--border)'}`, background: filterBHK === String(b) ? 'var(--primary-light)' : 'white', cursor: 'pointer', fontWeight: 500, fontSize: '0.8rem', color: filterBHK === String(b) ? 'var(--primary-dark)' : 'var(--text-mid)', transition: 'all 0.15s' }}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              {/* Price */}
              <div>
                <label className="form-label">Price Range</label>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <button onClick={() => setFilterPriceRange(null)} style={{ padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-sm)', border: `1.5px solid ${!filterPriceRange ? 'var(--primary)' : 'var(--border)'}`, background: !filterPriceRange ? 'var(--primary-light)' : 'white', cursor: 'pointer', fontWeight: 500, fontSize: '0.78rem', color: !filterPriceRange ? 'var(--primary-dark)' : 'var(--text-mid)', transition: 'all 0.15s' }}>Any</button>
                  {PRICE_RANGES.map(r => (
                    <button key={r.label} onClick={() => setFilterPriceRange(r)} style={{ padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-sm)', border: `1.5px solid ${filterPriceRange?.label === r.label ? 'var(--primary)' : 'var(--border)'}`, background: filterPriceRange?.label === r.label ? 'var(--primary-light)' : 'white', cursor: 'pointer', fontWeight: 500, fontSize: '0.78rem', color: filterPriceRange?.label === r.label ? 'var(--primary-dark)' : 'var(--text-mid)', transition: 'all 0.15s' }}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              {hasActiveFilters && (
                <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: 'auto' }}>
                  <X size={14} /> Clear Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--text-light)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-mid)' }}>No properties found</h3>
            <p style={{ marginBottom: '1.5rem' }}>Try adjusting your filters or search term.</p>
            <button onClick={clearFilters} className="btn btn-outline">Clear All Filters</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {filtered.map(listing => (
              <PropertyCard key={listing.id} listing={listing} onClick={() => onCardClick(listing)} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

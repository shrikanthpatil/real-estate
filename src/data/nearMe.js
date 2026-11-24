export const CITY_COORDINATES = {
  "New Delhi": { lat: 28.6139, lng: 77.2090 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Hyderabad: { lat: 17.3850, lng: 78.4867 },
  Mysore: { lat: 12.2958, lng: 76.6394 },
  Mysuru: { lat: 12.2958, lng: 76.6394 },
  Mumbai: { lat: 19.0760, lng: 72.8777 },
  Gurugram: { lat: 28.4595, lng: 77.0266 },
  Alibaug: { lat: 18.6414, lng: 72.8722 },
  Kochi: { lat: 9.9312, lng: 76.2673 },
  Hosur: { lat: 12.7409, lng: 77.8253 },
  Ratnagiri: { lat: 16.9944, lng: 73.3008 },
  Sakleshpur: { lat: 12.9447, lng: 75.7848 },
  Valparai: { lat: 10.3269, lng: 76.9552 },
  Kabini: { lat: 11.9440, lng: 76.3650 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Noida: { lat: 28.5355, lng: 77.3910 },
  Devanahalli: { lat: 13.2424, lng: 77.7109 },
};

export function haversineDistance(locationA, locationB) {
  if (!locationA || !locationB) return null;
  const toRadians = (value) => value * Math.PI / 180;
  const earthRadiusKm = 6371;
  const latDistance = toRadians(locationB.lat - locationA.lat);
  const lngDistance = toRadians(locationB.lng - locationA.lng);
  const a =
    Math.sin(latDistance / 2) ** 2 +
    Math.cos(toRadians(locationA.lat)) * Math.cos(toRadians(locationB.lat)) *
    Math.sin(lngDistance / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getListingCoordinates(listing) {
  if (listing.coordinates?.lat && listing.coordinates?.lng) return listing.coordinates;
  if (listing.location?.coordinates?.lat && listing.location?.coordinates?.lng) return listing.location.coordinates;
  if (listing.location?.latitude && listing.location?.longitude) {
    return { lat: Number(listing.location.latitude), lng: Number(listing.location.longitude) };
  }
  return CITY_COORDINATES[listing.city] || null;
}

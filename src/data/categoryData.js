export const PROPERTY_CATEGORIES = [
  { key: 'apartment', label: 'Apartments / Flats', group: 'Residential', icon: '🏢', subcategories: ['1 BHK','2 BHK','3 BHK','4 BHK and above','Apartment','Flat','Duplex','Penthouse'] },
  { key: 'house', label: 'Independent Houses & Villas', group: 'Residential', icon: '🏠', subcategories: ['Independent House','Villa','Luxury Villa','Duplex House','Row House','Farmhouse'] },
  { key: 'plot', label: 'Plots & Land', group: 'Plots and Land', icon: '🌳', subcategories: ['Residential Site','Corner Plot','Gated Community Plot','Approved Layout','Development Land'] },
  { key: 'agriculture', label: 'Agricultural Land', group: 'Agricultural and Estates', icon: '🌾', subcategories: ['Agricultural Land','Farm Land','Coffee Estate','Tea Estate','Rubber Plantation','Arecanut Plantation','Coconut Plantation','Mango Plantation','Fruit Orchard','Other Plantation'] },
  { key: 'estate', label: 'Coffee & Tea Estates', group: 'Agricultural and Estates', icon: '☕', subcategories: ['Coffee Estate','Tea Estate','Mixed Plantation','Fruit Estate'] },
  { key: 'commercial', label: 'Commercial Properties', group: 'Commercial', icon: '🏬', subcategories: ['Shop','Office Space','Showroom','Commercial Building','Shopping Complex','Restaurant'] },
  { key: 'industrial', label: 'Industrial Properties', group: 'Industrial', icon: '🏭', subcategories: ['Industrial Land','Factory','Warehouse','Industrial Shed','Manufacturing Unit'] },
  { key: 'hospitality', label: 'Resorts & Hotels', group: 'Hospitality', icon: '🏨', subcategories: ['Resort','Hotel','Homestay','Guest House','Holiday Home'] },
  { key: 'project', label: 'Projects', group: 'Projects', icon: '🏗️', subcategories: ['New Residential Project','Under-construction Project','Completed Project','Builder Project'] },
];

export const findCategory = (key) => PROPERTY_CATEGORIES.find(category => category.key === key);

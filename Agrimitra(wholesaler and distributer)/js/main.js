/* ==========================================================================
   AgriMitra Core Data Store & Utilities
   Provides unified localStorage persistence and default realistic seed data
   ========================================================================== */

const STORAGE_KEY_DISTRIBUTOR = 'agrimitra_distributor_profile';
const STORAGE_KEY_REQUIREMENTS = 'agrimitra_requirements';
const STORAGE_KEY_ORDERS = 'agrimitra_orders';
const STORAGE_KEY_INVENTORY = 'agrimitra_inventory';

// Default Distributor Profile
const DEFAULT_PROFILE = {
  businessName: 'MahaAgro Wholesale Dist.',
  contactPerson: 'Rahul Deshmukh',
  phone: '9822019482',
  businessType: 'Wholesale & Distribution',
  city: 'Market Yard, Pune',
  district: 'Pune',
  state: 'Maharashtra',
  mainProduce: ['Tomato', 'Onion', 'Potato'],
  purchaseQuantity: '10–25 tonnes',
  storageCapacity: 'Above 10 tonnes',
  mainSupplyArea: 'Pune, Mumbai & Western Maharashtra'
};

// Default My Requirements
const DEFAULT_REQUIREMENTS = [
  {
    id: 'REQ-101',
    crop: 'Tomatoes',
    quantity: '5 tonnes',
    grade: 'Grade A',
    maxPrice: '₹34/kg',
    priceNum: 34,
    requiredBy: '12 Sept',
    location: 'Within 50 km',
    status: 'Open',
    cropImage: 'produce-tomato.svg'
  },
  {
    id: 'REQ-102',
    crop: 'Onions',
    quantity: '8 tonnes',
    grade: 'Grade A',
    maxPrice: '₹30/kg',
    priceNum: 30,
    requiredBy: '15 Sept',
    location: 'Nashik / Pune Belt',
    status: 'Open',
    cropImage: 'produce-onion.svg'
  }
];

// Available Supply Lots
const SEED_SUPPLY_LOTS = [
  {
    id: 'LOT-901',
    crop: 'Tomato',
    cropImage: 'produce-tomato.svg',
    availableQty: 6,
    unit: 'tonnes',
    grade: 'A',
    pricePerKg: 33,
    distanceKm: 28,
    seller: 'Nashik Farmers Collective',
    transportCostPerKg: 1.80,
    landedCostPerKg: 34.80,
    status: 'Available',
    location: 'Dindori, Nashik'
  },
  {
    id: 'LOT-902',
    crop: 'Onion',
    cropImage: 'produce-onion.svg',
    availableQty: 10,
    unit: 'tonnes',
    grade: 'A',
    pricePerKg: 29,
    distanceKm: 41,
    seller: 'Maharashtra FPO Network',
    transportCostPerKg: 2.10,
    landedCostPerKg: 31.10,
    status: 'Available',
    location: 'Lasalgaon, Nashik'
  },
  {
    id: 'LOT-903',
    crop: 'Potato',
    cropImage: 'produce-potato.svg',
    availableQty: 12,
    unit: 'tonnes',
    grade: 'A',
    pricePerKg: 24,
    distanceKm: 65,
    seller: 'Manchar Potato Grower Cooperative',
    transportCostPerKg: 2.30,
    landedCostPerKg: 26.30,
    status: 'Available',
    location: 'Manchar, Pune'
  },
  {
    id: 'LOT-904',
    crop: 'Tomato',
    cropImage: 'produce-tomato.svg',
    availableQty: 5.5,
    unit: 'tonnes',
    grade: 'A',
    pricePerKg: 33,
    distanceKm: 24,
    seller: 'Khadakwasla Vegetable Group',
    transportCostPerKg: 1.80,
    landedCostPerKg: 34.80,
    status: 'Available',
    location: 'Khadakwasla, Pune'
  }
];

// Default Active & Recent Orders
const DEFAULT_ORDERS = [
  {
    id: '#A1048',
    crop: 'Tomatoes',
    cropImage: 'produce-tomato.svg',
    quantity: '5 tonnes',
    pricePerKg: '₹33/kg',
    totalValue: '₹1,65,000',
    supplier: 'Nashik Farmers Collective',
    pickup: 'Nashik',
    delivery: 'Pune Central Cold Storage',
    currentStatus: 'In Transit', // Offer Accepted -> Pickup -> In Transit -> Delivered
    statusStep: 3, // 1 to 4
    paymentStatus: 'Pending',
    deliveryAgent: 'Raj Transport (MH-15-EG-4921)',
    expectedArrival: '12 Sept, 4:00 PM'
  },
  {
    id: '#A1047',
    crop: 'Onions',
    cropImage: 'produce-onion.svg',
    quantity: '3 tonnes',
    pricePerKg: '₹29/kg',
    totalValue: '₹87,000',
    supplier: 'Maharashtra FPO Network',
    pickup: 'Lasalgaon',
    delivery: 'Pune Wholesaler Yard',
    currentStatus: 'Delivered',
    statusStep: 4,
    paymentStatus: 'Completed',
    deliveryAgent: 'Kisan Express Fleet',
    expectedArrival: 'Delivered on 10 Sept'
  },
  {
    id: '#A1046',
    crop: 'Potatoes',
    cropImage: 'produce-potato.svg',
    quantity: '4 tonnes',
    pricePerKg: '₹24/kg',
    totalValue: '₹96,000',
    supplier: 'Manchar Potato Grower Cooperative',
    pickup: 'Manchar',
    delivery: 'Pune Yard Unit 2',
    currentStatus: 'Pickup',
    statusStep: 2,
    paymentStatus: 'Advance Paid (30%)',
    deliveryAgent: 'Shree Logistics',
    expectedArrival: '13 Sept, 10:00 AM'
  },
  {
    id: '#A1045',
    crop: 'Wheat',
    cropImage: 'produce-paddy.svg',
    quantity: '10 tonnes',
    pricePerKg: '₹27/kg',
    totalValue: '₹2,70,000',
    supplier: 'Vidarbha Agro FPO',
    pickup: 'Amravati',
    delivery: 'Bhiwandi Hub',
    currentStatus: 'Offer Accepted',
    statusStep: 1,
    paymentStatus: 'Escrow Initiated',
    deliveryAgent: 'National Bulk Carriers',
    expectedArrival: '16 Sept, 2:00 PM'
  }
];

// Default Inventory Breakdown
const DEFAULT_INVENTORY = [
  {
    crop: 'Tomatoes',
    cropImage: 'produce-tomato.svg',
    stock: '6.2 tonnes',
    incoming: '3 tonnes',
    reserved: '1.5 tonnes',
    available: '4.7 tonnes',
    status: 'Normal',
    statusClass: 'badge-gray',
    recentShipment: {
      qty: '5 tonnes',
      supplier: 'FreshFoods Supplier',
      expected: '11 Sept'
    }
  },
  {
    crop: 'Onions',
    cropImage: 'produce-onion.svg',
    stock: '10.5 tonnes',
    incoming: '4 tonnes',
    reserved: '2.0 tonnes',
    available: '8.5 tonnes',
    status: 'High',
    statusClass: 'badge-amber',
    recentShipment: {
      qty: '3 tonnes',
      supplier: 'Maharashtra FPO Network',
      expected: 'Delivered'
    }
  },
  {
    crop: 'Potatoes',
    cropImage: 'produce-potato.svg',
    stock: '2.1 tonnes',
    incoming: '4 tonnes',
    reserved: '0.8 tonnes',
    available: '1.3 tonnes',
    status: 'Low',
    statusClass: 'badge-red',
    recentShipment: {
      qty: '4 tonnes',
      supplier: 'Manchar Potato Grower Cooperative',
      expected: '13 Sept'
    }
  }
];

// Market Snapshot Intelligence
const MARKET_PRICES = [
  { crop: 'Tomato', price: '₹33/kg', trend: '↑ 4%', trendType: 'up', demand: 'High', supply: 'Moderate' },
  { crop: 'Onion', price: '₹29/kg', trend: 'Stable', trendType: 'stable', demand: 'High', supply: 'Strong' },
  { crop: 'Potato', price: '₹24/kg', trend: '↓ 2%', trendType: 'down', demand: 'Moderate', supply: 'Excess' },
  { crop: 'Wheat', price: '₹27/kg', trend: '↑ 1.5%', trendType: 'up', demand: 'Steady', supply: 'Balanced' }
];

// LocalStorage Helper Utilities
const AgriMitraStore = {
  getProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_DISTRIBUTOR);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch (e) {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profileData) {
    try {
      const current = this.getProfile();
      const merged = { ...current, ...profileData };
      localStorage.setItem(STORAGE_KEY_DISTRIBUTOR, JSON.stringify(merged));
      return merged;
    } catch (e) {
      console.error('Error saving profile:', e);
      return profileData;
    }
  },

  getRequirements() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_REQUIREMENTS);
      return data ? JSON.parse(data) : DEFAULT_REQUIREMENTS;
    } catch (e) {
      return DEFAULT_REQUIREMENTS;
    }
  },

  addRequirement(newReq) {
    const list = this.getRequirements();
    list.unshift(newReq);
    try {
      localStorage.setItem(STORAGE_KEY_REQUIREMENTS, JSON.stringify(list));
    } catch (e) {
      console.error('Error saving requirement:', e);
    }
    return list;
  },

  getOrders() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ORDERS);
      return data ? JSON.parse(data) : DEFAULT_ORDERS;
    } catch (e) {
      return DEFAULT_ORDERS;
    }
  },

  addOrder(order) {
    const list = this.getOrders();
    list.unshift(order);
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(list));
    } catch (e) {
      console.error('Error saving order:', e);
    }
    return list;
  },

  getInventory() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_INVENTORY);
      return data ? JSON.parse(data) : DEFAULT_INVENTORY;
    } catch (e) {
      return DEFAULT_INVENTORY;
    }
  },

  getSupplyLots() {
    return SEED_SUPPLY_LOTS;
  },

  getMarketPrices() {
    return MARKET_PRICES;
  }
};

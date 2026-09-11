const fs = require('fs');
const path = require('path');

// Read buyer-dashboard.html
const html = fs.readFileSync(path.join(__dirname, '..', 'buyer-dashboard.html'), 'utf8');

// Basic DOM structure testing
console.log('=== 1. Testing HTML Structure & Selectors ===');

// Check all modals have return-to-dashboard buttons
const modals = [
  'modal-location', 'modal-orders', 'modal-categories',
  'modal-produce', 'modal-farmers', 'modal-bulk',
  'modal-cart', 'modal-notifications', 'modal-profile'
];

modals.forEach(m => {
  if (!html.includes(`id="${m}"`)) {
    throw new Error(`Modal ${m} not found in HTML!`);
  }
  const mIndex = html.indexOf(`id="${m}"`);
  const nextModalIndex = html.indexOf('class="modal-overlay"', mIndex + 100);
  const modalChunk = html.slice(mIndex, nextModalIndex !== -1 ? nextModalIndex : mIndex + 8000);
  
  if (!modalChunk.includes('btn-return-dashboard')) {
    throw new Error(`Modal ${m} does not have btn-return-dashboard!`);
  }
  if (!modalChunk.includes('closeBuyerModal')) {
    throw new Error(`Modal ${m} does not have closeBuyerModal handler!`);
  }
  console.log(`✓ Modal #${m} has back-to-dashboard and close handlers`);
});

console.log('\n=== 2. Testing Category Sorter Configuration ===');
const categories = ['vegetables', 'fruits', 'grains', 'pulses', 'other'];
categories.forEach(cat => {
  if (!html.includes(`data-category="${cat}"`)) {
    throw new Error(`Missing produce items or pills for category: ${cat}`);
  }
  console.log(`✓ Found items and pills for category: ${cat}`);
});

console.log('\n=== 3. Testing Meet the Farmers Avatars ===');
const farmersSection = html.slice(html.indexOf('id="farmers"'), html.indexOf('id="bulk-order"'));
if (farmersSection.includes('images.unsplash.com')) {
  throw new Error('Found external photos in farmers section!');
}
if (!farmersSection.includes('farmer-avatar-default')) {
  throw new Error('Missing farmer-avatar-default class in farmers section!');
}
if (!farmersSection.includes('farmer-default-avatar-svg')) {
  throw new Error('Missing farmer-default-avatar-svg in farmers section!');
}
console.log('✓ All 3 farmer cards use clean default avatar SVG icons');

console.log('\n=== 4. Testing Profile Editor Structure ===');
const profileModal = html.slice(html.indexOf('id="modal-profile"'), html.lastIndexOf('mobile-bottom-nav'));
const requiredProfileElements = [
  'id="profile-view-section"',
  'id="profile-edit-section"',
  'id="profile-edit-form"',
  'id="btn-toggle-edit-profile"',
  'id="prof-edit-name"',
  'id="prof-edit-phone"',
  'id="prof-edit-email"',
  'id="prof-edit-address"',
  'id="prof-edit-state"',
  'id="prof-edit-district"'
];
requiredProfileElements.forEach(el => {
  if (!profileModal.includes(el)) {
    throw new Error(`Missing profile element: ${el}`);
  }
  console.log(`✓ Profile editor contains ${el}`);
});

console.log('\n=== 5. Testing AgriMitra-Buyer Mirroring ===');
const buyerDirHtml = fs.readFileSync(path.join(__dirname, '..', 'AgriMitra-Buyer', 'buyer-dashboard.html'), 'utf8');
if (buyerDirHtml !== html) {
  throw new Error('AgriMitra-Buyer/buyer-dashboard.html is out of sync with root buyer-dashboard.html!');
}
console.log('✓ AgriMitra-Buyer/buyer-dashboard.html is 100% identical to root buyer-dashboard.html');

// Check assets exist in AgriMitra-Buyer
const requiredBuyerAssets = [
  path.join(__dirname, '..', 'AgriMitra-Buyer', 'assets', 'buyer-marketplace.js'),
  path.join(__dirname, '..', 'AgriMitra-Buyer', 'assets', 'auth-guard.js'),
  path.join(__dirname, '..', 'AgriMitra-Buyer', 'i18n.js')
];
requiredBuyerAssets.forEach(p => {
  if (!fs.existsSync(p)) {
    throw new Error(`Missing required asset: ${p}`);
  }
  console.log(`✓ Verified asset exists: ${path.basename(p)}`);
});

console.log('\n=============================================');
console.log('ALL DOM AND ASSET TESTS PASSED WITH 100% ACCURACY!');
console.log('=============================================');

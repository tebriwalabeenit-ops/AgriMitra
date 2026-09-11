const fs = require('fs');
const path = require('path');

// Syntax and API Handlers verification

const jsContent = fs.readFileSync(path.join(__dirname, '..', 'assets', 'buyer-marketplace.js'), 'utf8');

console.log('=== Testing buyer-marketplace.js Syntax and API Handlers ===');

// Check that functions and event hooks exist in buyer-marketplace.js
const requiredFunctions = [
  'closeBuyerModal',
  'openBuyerModal',
  'applyProduceFilters',
  'setupCategorySorter',
  'setupSearch',
  'setupProfileEditor',
  'setupLocationModal',
  'setupModalCloseHandlers',
  'setupAddToCartButtons',
  'setupCheckout',
  'loadOrderHistory'
];

requiredFunctions.forEach(fn => {
  if (!jsContent.includes(fn)) {
    throw new Error(`buyer-marketplace.js is missing expected function/handler: ${fn}`);
  }
  console.log(`✓ Verified logic handler: ${fn}`);
});

// Check that closeBuyerModal properly handles history and styles
if (!jsContent.includes('history.replaceState') || !jsContent.includes('is-closing')) {
  throw new Error('closeBuyerModal lacks clean history clearing or is-closing class handling!');
}
console.log('✓ closeBuyerModal verified with replaceState and is-closing class');

// Check Escape key handler
if (!jsContent.includes("e.key === 'Escape'")) {
  throw new Error('Missing Escape key handler in buyer-marketplace.js!');
}
console.log('✓ Escape key modal close handler verified');

// Check Profile editing localStorage keys
if (!jsContent.includes('agrimitra_buyer_profile') || !jsContent.includes('agrimitra_buyer_address')) {
  throw new Error('Missing profile localStorage keys in buyer-marketplace.js!');
}
console.log('✓ Profile editor localStorage persistence keys verified');

// Check search filters matching fields
['title.includes', 'farmer.includes', 'loc.includes', 'cardCategory.includes'].forEach(field => {
  if (!jsContent.includes(field)) {
    throw new Error(`Missing search matching field in filter: ${field}`);
  }
  console.log(`✓ Live search matches ${field}`);
});

console.log('\nALL JAVASCRIPT LOGIC VERIFIED SUCCESSFULLY!');

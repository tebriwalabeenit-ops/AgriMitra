const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log('✓ PASS: ' + message);
    passed++;
  } else {
    console.error('✗ FAIL: ' + message);
    failed++;
  }
}

console.log('=== 1. CHECKING INDEX.HTML LINKS ===');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

// Match href="..."
const hrefRegex = /href=["']([^"']+\.html)["']/g;
let match;
const indexHrefs = [];
while ((match = hrefRegex.exec(indexHtml)) !== null) {
  indexHrefs.push(match[1]);
}

indexHrefs.forEach(href => {
  const targetPath = path.resolve(rootDir, href);
  assert(fs.existsSync(targetPath), `index.html link "${href}" exists at ${targetPath}`);
});

console.log('\n=== 2. CHECKING APP.JS ROUTES ===');
const appJs = fs.readFileSync(path.join(rootDir, 'app.js'), 'utf8');

const regMatch = appJs.match(/const roleRegistrationRoutes = \{([\s\S]*?)\};/);
assert(!!regMatch, 'roleRegistrationRoutes found in app.js');
if (regMatch) {
  const routesStr = regMatch[1];
  const urlRegex = /'([^']+\.html)'/g;
  let u;
  while ((u = urlRegex.exec(routesStr)) !== null) {
    const targetPath = path.resolve(rootDir, u[1]);
    assert(fs.existsSync(targetPath), `app.js registration route "${u[1]}" exists`);
  }
}

const dashMatch = appJs.match(/const roleDashboardRoutes = \{([\s\S]*?)\};/);
assert(!!dashMatch, 'roleDashboardRoutes found in app.js');
if (dashMatch) {
  const routesStr = dashMatch[1];
  const urlRegex = /'([^']+\.html)'/g;
  let u;
  while ((u = urlRegex.exec(routesStr)) !== null) {
    const targetPath = path.resolve(rootDir, u[1]);
    assert(fs.existsSync(targetPath), `app.js dashboard route "${u[1]}" exists`);
  }
}

console.log('\n=== 3. CHECKING AGRI MITRA BUYER ===');
const buyerDir = path.join(rootDir, 'AgriMitra-Buyer');
const buyerHtml = fs.readFileSync(path.join(buyerDir, 'buyer.html'), 'utf8');

assert(buyerHtml.includes('href="../index.html"'), 'buyer.html header points to ../index.html');
assert(buyerHtml.includes('action="buyer-dashboard.html"'), 'buyer.html form action is buyer-dashboard.html');
assert(buyerHtml.includes("window.location.href = 'buyer-dashboard.html'"), 'buyer.html redirects to buyer-dashboard.html');
assert(fs.existsSync(path.join(buyerDir, 'buyer-dashboard.html')), 'buyer-dashboard.html exists in AgriMitra-Buyer');

console.log('\n=== 4. CHECKING AGRI MITRA DELIVERY AGENT ===');
const deliveryDir = path.join(rootDir, 'AgriMitra-delivery agent');
const deliveryHtml = fs.readFileSync(path.join(deliveryDir, 'delivery-agent.html'), 'utf8');

assert(deliveryHtml.includes('href="../index.html"'), 'delivery-agent.html header points to ../index.html');
assert(deliveryHtml.includes('action="index.html"'), 'delivery-agent.html form action is index.html');
assert(deliveryHtml.includes("window.location.href = 'index.html'"), 'delivery-agent.html redirects to index.html');
assert(fs.existsSync(path.join(deliveryDir, 'index.html')), 'index.html (dashboard) exists in AgriMitra-delivery agent');

console.log('\n=== 5. CHECKING AGRI MITRA FPO ===');
const fpoDir = path.join(rootDir, 'AgriMitra- FPO');
const fpoHtml = fs.readFileSync(path.join(fpoDir, 'fpo-register.html'), 'utf8');

assert(fpoHtml.includes('href="../index.html"'), 'fpo-register.html header points to ../index.html');
assert(fpoHtml.includes('action="index.html"'), 'fpo-register.html form action is index.html');
assert(fpoHtml.includes("window.location.href = 'index.html'"), 'fpo-register.html redirects to index.html');
assert(fs.existsSync(path.join(fpoDir, 'index.html')), 'index.html (dashboard) exists in AgriMitra- FPO');

console.log('\n=== 6. CHECKING ROOT FORWARDERS ===');
['buyer.html', 'delivery-agent.html', 'fpo-register.html', 'buyer-dashboard.html'].forEach(rf => {
  const filePath = path.join(rootDir, rf);
  assert(fs.existsSync(filePath), `Root forwarder ${rf} exists`);
});

console.log(`\nTOTAL: ${passed} PASSED, ${failed} FAILED`);
process.exit(failed > 0 ? 1 : 0);

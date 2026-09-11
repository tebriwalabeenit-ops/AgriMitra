const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- STARTING MULTI-ROLE ALREADY REGISTERED VERIFICATION ---');

const baseDir = path.resolve(__dirname, '..');

const testCases = [
  {
    roleName: 'Farmer',
    file: 'AgriMitra-Farmer/farmer/register.html',
    expectedRoleParam: 'farmer',
    loginHrefPattern: /index\.html#login\?role=farmer/,
    hasTextId: 'already-registered-text',
    hasLinkId: 'link-login-farmer'
  },
  {
    roleName: 'Buyer (root)',
    file: 'buyer.html',
    expectedRoleParam: 'buyer',
    loginHrefPattern: /index\.html#login\?role=buyer/,
    hasTextId: 'already-registered-text',
    hasLinkId: 'link-login-buyer'
  },
  {
    roleName: 'Buyer (subdir)',
    file: 'AgriMitra-Buyer/buyer.html',
    expectedRoleParam: 'buyer',
    loginHrefPattern: /index\.html#login\?role=buyer/,
    hasTextId: 'already-registered-text',
    hasLinkId: 'link-login-buyer'
  },
  {
    roleName: 'FPO (root)',
    file: 'fpo-register.html',
    expectedRoleParam: 'fpo',
    loginHrefPattern: /index\.html#login\?role=fpo/,
    hasTextId: 'already-registered-text',
    hasLinkId: 'link-login-fpo'
  },
  {
    roleName: 'FPO (subdir 1)',
    file: 'AgriMitra- FPO/fpo-register.html',
    expectedRoleParam: 'fpo',
    loginHrefPattern: /index\.html#login\?role=fpo/,
    hasTextId: 'already-registered-text',
    hasLinkId: 'link-login-fpo'
  },
  {
    roleName: 'FPO (subdir 2)',
    file: 'fpo/fpo-register.html',
    expectedRoleParam: 'fpo',
    loginHrefPattern: /index\.html#login\?role=fpo/,
    hasTextId: 'already-registered-text',
    hasLinkId: 'link-login-fpo'
  },
  {
    roleName: 'Distributor & Wholesaler',
    file: 'Agrimitra(wholesaler and distributer)/register-distributor.html',
    expectedRoleParam: 'distributor',
    loginHrefPattern: /index\.html#login\?role=(distributor|wholesaler)/,
    hasTextId: 'already-registered-text',
    hasLinkId: 'link-login-distributor'
  },
  {
    roleName: 'Delivery Agent (root)',
    file: 'delivery-agent.html',
    expectedRoleParam: 'delivery',
    loginHrefPattern: /index\.html#login\?role=delivery/,
    hasTextId: 'already-registered-text',
    hasLinkId: 'link-login-delivery'
  },
  {
    roleName: 'Delivery Agent (subdir)',
    file: 'AgriMitra-delivery agent/delivery-agent.html',
    expectedRoleParam: 'delivery',
    loginHrefPattern: /index\.html#login\?role=delivery/,
    hasTextId: 'already-registered-text',
    hasLinkId: 'link-login-delivery'
  },
  {
    roleName: 'Delivery Agent (wizard)',
    file: 'AgriMitra-delivery agent/register.html',
    expectedRoleParam: 'delivery',
    loginHrefPattern: /index\.html#login\?role=delivery/,
    hasTextId: 'already-registered-text',
    hasLinkId: 'link-login-delivery'
  }
];

let passedCount = 0;
let totalChecks = 0;

for (const tc of testCases) {
  const filePath = path.join(baseDir, tc.file);
  console.log(`\nChecking [${tc.roleName}] in ${tc.file}...`);
  assert(fs.existsSync(filePath), `File does not exist: ${filePath}`);

  const content = fs.readFileSync(filePath, 'utf8');

  // 1. Check for text ID
  totalChecks++;
  if (content.includes(`id="${tc.hasTextId}"`)) {
    console.log(`  ✓ Found text element with id="${tc.hasTextId}"`);
    passedCount++;
  } else {
    console.error(`  ✗ Missing id="${tc.hasTextId}"`);
  }

  // 2. Check for "Already registered?" text
  totalChecks++;
  if (/Already registered\?/i.test(content)) {
    console.log(`  ✓ Contains "Already registered?" query text`);
    passedCount++;
  } else {
    console.error(`  ✗ Missing "Already registered?" query text`);
  }

  // 3. Check for link ID
  totalChecks++;
  if (content.includes(`id="${tc.hasLinkId}"`)) {
    console.log(`  ✓ Found login link element with id="${tc.hasLinkId}"`);
    passedCount++;
  } else {
    console.error(`  ✗ Missing id="${tc.hasLinkId}"`);
  }

  // 4. Check for login URL pattern
  totalChecks++;
  if (tc.loginHrefPattern.test(content)) {
    console.log(`  ✓ Contains expected login URL pattern: ${tc.loginHrefPattern}`);
    passedCount++;
  } else {
    console.error(`  ✗ Missing login URL pattern ${tc.loginHrefPattern}`);
  }

  // 5. Check for JS handling or attached script
  totalChecks++;
  let hasScriptHandler = false;
  if (content.includes(tc.hasTextId) && (content.includes('addEventListener') || content.includes('onclick'))) {
    hasScriptHandler = true;
  }
  // If external JS is referenced:
  if (!hasScriptHandler) {
    if (tc.file.includes('farmer')) {
      const jsContent = fs.readFileSync(path.join(baseDir, 'AgriMitra-Farmer/farmer/js/main.js'), 'utf8');
      hasScriptHandler = jsContent.includes(tc.hasTextId) && jsContent.includes('addEventListener');
    } else if (tc.file.includes('distributor')) {
      const jsContent = fs.readFileSync(path.join(baseDir, 'Agrimitra(wholesaler and distributer)/js/distributor-registration.js'), 'utf8');
      hasScriptHandler = jsContent.includes(tc.hasTextId) && jsContent.includes('addEventListener');
    } else if (tc.file.includes('register.html') && tc.file.includes('delivery')) {
      const jsContent = fs.readFileSync(path.join(baseDir, 'AgriMitra-delivery agent/register.js'), 'utf8');
      hasScriptHandler = jsContent.includes(tc.hasTextId) && jsContent.includes('addEventListener');
    }
  }

  if (hasScriptHandler) {
    console.log(`  ✓ Script click handler is wired to ${tc.hasTextId}`);
    passedCount++;
  } else {
    console.error(`  ✗ Missing script click handler for ${tc.hasTextId}`);
  }
}

// Check central app.js and index.html login dialog
console.log('\nChecking Central Login controller in app.js and index.html...');
const appJsPath = path.join(baseDir, 'app.js');
const indexHtmlPath = path.join(baseDir, 'index.html');

const appJs = fs.readFileSync(appJsPath, 'utf8');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Check that app.js handles role query and opens dialog
totalChecks++;
if (appJs.includes('handleUrlHash') && appJs.includes('login-role') && appJs.includes('openDialog(loginDialog)')) {
  console.log('  ✓ app.js has handleUrlHash that activates login modal and updates login-role');
  passedCount++;
} else {
  console.error('  ✗ app.js missing handleUrlHash login modal activation');
}

// Check index.html options in #login-role
const requiredRoles = ['farmer', 'buyer', 'fpo', 'wholesaler', 'distributor', 'delivery'];
for (const role of requiredRoles) {
  totalChecks++;
  if (indexHtml.includes(`value="${role}"`)) {
    console.log(`  ✓ #login-role contains option value="${role}"`);
    passedCount++;
  } else {
    console.error(`  ✗ #login-role missing option value="${role}"`);
  }
}

console.log(`\nVerification complete: ${passedCount}/${totalChecks} checks passed.`);
if (passedCount === totalChecks) {
  console.log('SUCCESS: All registration pages correctly implement the "already registered" feature!');
  process.exit(0);
} else {
  console.error('FAILURE: Some checks failed.');
  process.exit(1);
}

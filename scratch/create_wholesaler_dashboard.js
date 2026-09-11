const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const srcPath = path.join(rootDir, 'Agrimitra(wholesaler and distributer)', 'distributor-dashboard.html');
const destPath = path.join(rootDir, 'Agrimitra(wholesaler and distributer)', 'wholesaler-dashboard.html');

let content = fs.readFileSync(srcPath, 'utf8');

// Title & Meta
content = content.replace('<title>Distributor Dashboard | AgriMitra</title>', '<title>Wholesaler Dashboard | AgriMitra</title>');
content = content.replace('content="AgriMitra Distributor Dashboard - Manage agricultural produce sourcing, wholesale inventory, orders and distribution."', 'content="AgriMitra Wholesaler Dashboard - Participate in live mandi bidding, bulk agricultural produce procurement, wholesale storage and trading."');

// Brand & Nav
content = content.replace('href="distributor-dashboard.html" class="dist-brand"', 'href="wholesaler-dashboard.html" class="dist-brand"');
content = content.replace('<span class="dist-brand-name">Agri<span>Mitra</span></span>', '<span class="dist-brand-name">Agri<span>Mitra</span> <span style="font-size: 0.72rem; color: #166534; font-weight: 700; margin-left: 6px; padding: 2px 8px; background: #e8f5e9; border: 1px solid #c8e6c9; border-radius: 4px; vertical-align: middle;">WHOLESALER</span></span>');
content = content.replace('<li><a href="distributor-dashboard.html" class="dist-nav-link active">Overview</a></li>', '<li><a href="wholesaler-dashboard.html" class="dist-nav-link active">Overview</a></li>');
content = content.replace('<li><a href="#live-bidding" class="dist-nav-link" style="color: #1C5A35; font-weight: 700;">Live Bidding</a></li>', '<li><a href="../wholesaler-trading.html" class="dist-nav-link" style="color: #1C5A35; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;"><span style="width: 7px; height: 7px; background: #2E7D32; border-radius: 50%; display: inline-block;"></span>Live Bidding Cockpit</a></li>');

// Header Profile Badge
content = content.replace('<div class="user-avatar-circle">D</div>', '<div class="user-avatar-circle" style="background-color: #0D47A1;">KM</div>');
content = content.replace('<span class="user-business-name" id="header-business-name">MahaAgro Wholesale Dist.</span>', '<span class="user-business-name" id="header-business-name">Kisan Mandi Traders Pvt Ltd</span>');
content = content.replace('title="View Distributor Profile"', 'title="View Wholesaler Profile (#WS-DEL-218)"');

// Welcome Section
const welcomeRegex = /<section class="dist-welcome-section">[\s\S]*?<\/section>/;
const newWelcome = `<section class="dist-welcome-section">
      <div>
        <h1 class="dist-welcome-title">
          Good morning, <span id="greeting-business-name">Kisan Mandi Traders Pvt Ltd</span>
        </h1>
        <p class="dist-welcome-sub">
          Manage your live mandi bidding, bulk agricultural produce sourcing, wholesale inventory and distribution.
        </p>
      </div>
      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <a href="../wholesaler-trading.html" class="btn btn-secondary" style="text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
          <span style="width: 8px; height: 8px; background-color: #2E7D32; border-radius: 50%; display: inline-block;"></span>
          <span>Live Mandi Cockpit →</span>
        </a>
        <button type="button" class="btn btn-primary" data-modal-target="modal-create-requirement">
          <span>+ Create Requirement</span>
        </button>
      </div>
    </section>`;

content = content.replace(welcomeRegex, newWelcome);

// Workflow ribbon: add BID/TRADE
content = content.replace(
  '<span class="workflow-step active">1. SOURCE</span>',
  '<span class="workflow-step active">1. BID / TRADE</span>\n      <span class="workflow-arrow">→</span>\n      <span class="workflow-step active">2. SOURCE</span>'
);
content = content.replace('2. PURCHASE', '3. PURCHASE');
content = content.replace('3. RECEIVE', '4. RECEIVE');
content = content.replace('4. STORE', '5. STORE');
content = content.replace('5. DISTRIBUTE', '6. DISTRIBUTE');

// Profile modal content
content = content.replace('<h3 class="modal-title" id="title-prof">Distributor Profile</h3>', '<h3 class="modal-title" id="title-prof">Wholesaler Profile</h3>');
content = content.replace('<h4 class="prof-name" id="profile-business-name">MahaAgro Wholesale Dist.</h4>', '<h4 class="prof-name" id="profile-business-name">Kisan Mandi Traders Pvt Ltd</h4>');
content = content.replace('<span class="prof-badge" id="profile-business-type">Wholesale & Distribution</span>', '<span class="prof-badge" id="profile-business-type">Wholesaler & Mandi Trading (#WS-DEL-218)</span>');
content = content.replace('<span class="detail-value" id="profile-contact">Rahul Deshmukh</span>', '<span class="detail-value" id="profile-contact">Praveen Singhania</span>');
content = content.replace('<span class="detail-value" id="profile-phone">+91 98220 19482</span>', '<span class="detail-value" id="profile-phone">+91 98234 56789</span>');
content = content.replace('<span class="detail-value" id="profile-type">Wholesale & Distribution</span>', '<span class="detail-value" id="profile-type">Agricultural Wholesaler & Mandi Trading</span>');
content = content.replace('<span class="detail-value" id="profile-location">Market Yard, Pune, Maharashtra</span>', '<span class="detail-value" id="profile-location">Azadpur Mandi Hub, Delhi NCR</span>');
content = content.replace('<span class="detail-value" id="profile-capacity">Above 10 tonnes</span>', '<span class="detail-value" id="profile-capacity">Above 25 tonnes</span>');

// Before js/distributor-dashboard.js, inject wholesaler defaults initialization
const initScript = `
  <script>
    (function() {
      // Set Wholesaler profile seed in localStorage if empty or default
      try {
        const authUser = window.AgriMitraAuth ? window.AgriMitraAuth.getCurrentUser() : null;
        const stored = localStorage.getItem('agrimitra_distributor_profile');
        if (!stored || (authUser && authUser.role === 'wholesaler')) {
          const wsProfile = {
            businessName: (authUser && authUser.full_name) ? authUser.full_name : 'Kisan Mandi Traders Pvt Ltd',
            contactPerson: (authUser && authUser.full_name) ? authUser.full_name : 'Praveen Singhania',
            phone: (authUser && authUser.phone) ? authUser.phone : '9823456789',
            businessType: 'Wholesaler & Mandi Trading',
            city: 'Azadpur Mandi',
            district: (authUser && authUser.district) ? authUser.district : 'North Delhi',
            state: (authUser && authUser.state) ? authUser.state : 'Delhi',
            mainProduce: ['Wheat', 'Tomato', 'Onion', 'Potato'],
            purchaseQuantity: '20–50 tonnes',
            storageCapacity: 'Above 25 tonnes',
            mainSupplyArea: 'Delhi NCR, Punjab, Haryana & Western UP'
          };
          localStorage.setItem('agrimitra_distributor_profile', JSON.stringify(wsProfile));
        }
      } catch(e) { console.warn('Wholesaler seed error:', e); }
    })();
  </script>
`;

content = content.replace('<script src="js/distributor-dashboard.js"></script>', initScript + '  <script src="js/distributor-dashboard.js"></script>');

fs.writeFileSync(destPath, content, 'utf8');
console.log('Successfully created Agrimitra(wholesaler and distributer)/wholesaler-dashboard.html');

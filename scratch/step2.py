import re

with open('buyer-dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace images in #modal-farmers
modal_farmer_avatar = """<div class="farmer-avatar-default" aria-label="Default Farmer Avatar" style="width:48px; height:48px; border-radius:50%;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:24px; height:24px;">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>"""

content = re.sub(
    r'<img\s+src="https://images\.unsplash\.com/photo-[^"]+"\s+alt="Rajesh Kumar"\s+style="width:\s*52px;[^"]+">',
    modal_farmer_avatar,
    content
)
content = re.sub(
    r'<img\s+src="https://images\.unsplash\.com/photo-[^"]+"\s+alt="Ramesh Patel"\s+style="width:\s*52px;[^"]+">',
    modal_farmer_avatar,
    content
)
content = re.sub(
    r'<img\s+src="https://images\.unsplash\.com/photo-[^"]+"\s+alt="Sunita Devi"\s+style="width:\s*52px;[^"]+">',
    modal_farmer_avatar,
    content
)

# 1. Update #modal-location
content = content.replace(
    """  <!-- 0. DELIVERY LOCATION & EDIT ADDRESS POPUP MODAL -->
  <div id="modal-location" class="modal-overlay" role="dialog" aria-labelledby="modal-loc-title" aria-modal="true">
    <a href="#" class="modal-backdrop-close" aria-label="Close location popup"></a>
    <div class="modal-window">
      <div class="modal-window-header">
        <h3 id="modal-loc-title" class="modal-window-title">
          <span class="ui-icon" aria-hidden="true" style="color: var(--color-primary);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </span>
          Delivery Address &amp; Location
        </h3>
        <a href="#" class="modal-window-close" aria-label="Close location popup">&times;</a>
      </div>""",
    """  <!-- 0. DELIVERY LOCATION & EDIT ADDRESS POPUP MODAL -->
  <div id="modal-location" class="modal-overlay" role="dialog" aria-labelledby="modal-loc-title" aria-modal="true">
    <a href="#!" class="modal-backdrop-close" onclick="window.closeBuyerModal()" aria-label="Close location popup"></a>
    <div class="modal-window">
      <div class="modal-window-header">
        <h3 id="modal-loc-title" class="modal-window-title">
          <span class="ui-icon" aria-hidden="true" style="color: var(--color-primary);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </span>
          Delivery Address &amp; Location
        </h3>
        <div style="display:flex; align-items:center; gap:8px;">
          <button type="button" class="btn-return-dashboard" onclick="window.closeBuyerModal()">← Back to Dashboard</button>
          <button type="button" class="modal-window-close" onclick="window.closeBuyerModal()" aria-label="Close location popup">&times;</button>
        </div>
      </div>"""
)

content = content.replace(
    """      <div class="modal-window-footer">
        <a href="#" class="btn btn-secondary" style="font-size: var(--font-size-xs);">Close</a>
      </div>
    </div>
  </div>

  <!-- 1. RECENT ORDERS & LIVE DELIVERY TRACKING MODAL -->""",
    """      <div class="modal-window-footer">
        <button type="button" class="btn btn-secondary btn-return-dashboard" onclick="window.closeBuyerModal()">← Back to Dashboard</button>
      </div>
    </div>
  </div>

  <!-- 1. RECENT ORDERS & LIVE DELIVERY TRACKING MODAL -->"""
)

# 2. Update #modal-orders
content = content.replace(
    """  <!-- 1. RECENT ORDERS & LIVE DELIVERY TRACKING MODAL -->
  <div id="modal-orders" class="modal-overlay" role="dialog" aria-labelledby="modal-orders-title" aria-modal="true">
    <a href="#" class="modal-backdrop-close" aria-label="Close orders popup"></a>
    <div class="modal-window">
      <div class="modal-window-header">
        <h3 id="modal-orders-title" class="modal-window-title">
          <span class="ui-icon" aria-hidden="true" style="color: var(--color-primary);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </span>
          Your Orders &amp; Live Deliveries
        </h3>
        <a href="#" class="modal-window-close" aria-label="Close orders popup">&times;</a>
      </div>""",
    """  <!-- 1. RECENT ORDERS & LIVE DELIVERY TRACKING MODAL -->
  <div id="modal-orders" class="modal-overlay" role="dialog" aria-labelledby="modal-orders-title" aria-modal="true">
    <a href="#!" class="modal-backdrop-close" onclick="window.closeBuyerModal()" aria-label="Close orders popup"></a>
    <div class="modal-window">
      <div class="modal-window-header">
        <h3 id="modal-orders-title" class="modal-window-title">
          <span class="ui-icon" aria-hidden="true" style="color: var(--color-primary);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </span>
          Your Orders &amp; Live Deliveries
        </h3>
        <div style="display:flex; align-items:center; gap:8px;">
          <button type="button" class="btn-return-dashboard" onclick="window.closeBuyerModal()">← Back to Dashboard</button>
          <button type="button" class="modal-window-close" onclick="window.closeBuyerModal()" aria-label="Close orders popup">&times;</button>
        </div>
      </div>"""
)

content = content.replace(
    """      <div class="modal-window-footer">
        <a href="#" class="btn btn-secondary" style="font-size: var(--font-size-xs);">Close Window</a>
      </div>
    </div>
  </div>

  <!-- 2. PRODUCE CATEGORIES DIRECTORY POPUP MODAL -->""",
    """      <div class="modal-window-footer">
        <button type="button" class="btn btn-primary btn-return-dashboard" onclick="window.closeBuyerModal()">← Back to Dashboard / Continue Shopping</button>
      </div>
    </div>
  </div>

  <!-- 2. PRODUCE CATEGORIES DIRECTORY POPUP MODAL -->"""
)

# 3. Update #modal-categories
content = content.replace(
    """  <!-- 2. PRODUCE CATEGORIES DIRECTORY POPUP MODAL -->
  <div id="modal-categories" class="modal-overlay" role="dialog" aria-labelledby="modal-cat-title" aria-modal="true">
    <a href="#" class="modal-backdrop-close" aria-label="Close categories popup"></a>
    <div class="modal-window">
      <div class="modal-window-header">
        <h3 id="modal-cat-title" class="modal-window-title">
          <span class="ui-icon" aria-hidden="true" style="color: var(--color-primary);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </span>
          All Product Categories
        </h3>
        <a href="#" class="modal-window-close" aria-label="Close categories popup">&times;</a>
      </div>""",
    """  <!-- 2. PRODUCE CATEGORIES DIRECTORY POPUP MODAL -->
  <div id="modal-categories" class="modal-overlay" role="dialog" aria-labelledby="modal-cat-title" aria-modal="true">
    <a href="#!" class="modal-backdrop-close" onclick="window.closeBuyerModal()" aria-label="Close categories popup"></a>
    <div class="modal-window">
      <div class="modal-window-header">
        <h3 id="modal-cat-title" class="modal-window-title">
          <span class="ui-icon" aria-hidden="true" style="color: var(--color-primary);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </span>
          All Product Categories
        </h3>
        <div style="display:flex; align-items:center; gap:8px;">
          <button type="button" class="btn-return-dashboard" onclick="window.closeBuyerModal()">← Back to Dashboard</button>
          <button type="button" class="modal-window-close" onclick="window.closeBuyerModal()" aria-label="Close categories popup">&times;</button>
        </div>
      </div>"""
)

content = content.replace(
    """      <div class="modal-window-footer">
        <a href="#fresh-produce" class="btn btn-primary" style="font-size: var(--font-size-xs);">View Products on Dashboard</a>
        <a href="#" class="btn btn-secondary" style="font-size: var(--font-size-xs);">Close</a>
      </div>
    </div>
  </div>

  <!-- 3. PRODUCE DISCOVERY & MANDI PRICING POPUP MODAL -->""",
    """      <div class="modal-window-footer">
        <button type="button" class="btn btn-primary" onclick="window.closeBuyerModal()">View Products on Dashboard</button>
        <button type="button" class="btn btn-secondary btn-return-dashboard" onclick="window.closeBuyerModal()">← Back to Dashboard</button>
      </div>
    </div>
  </div>

  <!-- 3. PRODUCE DISCOVERY & MANDI PRICING POPUP MODAL -->"""
)

# 4. Update #modal-produce
content = content.replace(
    """  <!-- 3. PRODUCE DISCOVERY & MANDI PRICING POPUP MODAL -->
  <div id="modal-produce" class="modal-overlay" role="dialog" aria-labelledby="modal-prod-title" aria-modal="true">
    <a href="#" class="modal-backdrop-close" aria-label="Close produce pricing popup"></a>
    <div class="modal-window">
      <div class="modal-window-header">
        <h3 id="modal-prod-title" class="modal-window-title">
          <span class="ui-icon" aria-hidden="true" style="color: var(--color-primary);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
          </span>
          Daily Mandi Pricing Guide
        </h3>
        <a href="#" class="modal-window-close" aria-label="Close produce pricing popup">&times;</a>
      </div>""",
    """  <!-- 3. PRODUCE DISCOVERY & MANDI PRICING POPUP MODAL -->
  <div id="modal-produce" class="modal-overlay" role="dialog" aria-labelledby="modal-prod-title" aria-modal="true">
    <a href="#!" class="modal-backdrop-close" onclick="window.closeBuyerModal()" aria-label="Close produce pricing popup"></a>
    <div class="modal-window">
      <div class="modal-window-header">
        <h3 id="modal-prod-title" class="modal-window-title">
          <span class="ui-icon" aria-hidden="true" style="color: var(--color-primary);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
          </span>
          Daily Mandi Pricing Guide
        </h3>
        <div style="display:flex; align-items:center; gap:8px;">
          <button type="button" class="btn-return-dashboard" onclick="window.closeBuyerModal()">← Back to Dashboard</button>
          <button type="button" class="modal-window-close" onclick="window.closeBuyerModal()" aria-label="Close produce pricing popup">&times;</button>
        </div>
      </div>"""
)

content = content.replace(
    """      <div class="modal-window-footer">
        <a href="#fresh-produce" class="btn btn-primary" style="font-size: var(--font-size-xs);">Shop Available Produce</a>
        <a href="#" class="btn btn-secondary" style="font-size: var(--font-size-xs);">Close</a>
      </div>
    </div>
  </div>

  <!-- 4. MEET FARMERS DIRECTORY POPUP MODAL -->""",
    """      <div class="modal-window-footer">
        <button type="button" class="btn btn-primary" onclick="window.closeBuyerModal()">Shop Available Produce</button>
        <button type="button" class="btn btn-secondary btn-return-dashboard" onclick="window.closeBuyerModal()">← Back to Dashboard</button>
      </div>
    </div>
  </div>

  <!-- 4. MEET FARMERS DIRECTORY POPUP MODAL -->"""
)

# 5. Update #modal-farmers
content = content.replace(
    """  <!-- 4. MEET FARMERS DIRECTORY POPUP MODAL -->
  <div id="modal-farmers" class="modal-overlay" role="dialog" aria-labelledby="modal-farmers-title" aria-modal="true">
    <a href="#" class="modal-backdrop-close" aria-label="Close farmers popup"></a>
    <div class="modal-window">
      <div class="modal-window-header">
        <h3 id="modal-farmers-title" class="modal-window-title">
          <span class="ui-icon" aria-hidden="true" style="color: var(--color-primary);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </span>
          Meet Verified Regional Farmers
        </h3>
        <a href="#" class="modal-window-close" aria-label="Close farmers popup">&times;</a>
      </div>""",
    """  <!-- 4. MEET FARMERS DIRECTORY POPUP MODAL -->
  <div id="modal-farmers" class="modal-overlay" role="dialog" aria-labelledby="modal-farmers-title" aria-modal="true">
    <a href="#!" class="modal-backdrop-close" onclick="window.closeBuyerModal()" aria-label="Close farmers popup"></a>
    <div class="modal-window">
      <div class="modal-window-header">
        <h3 id="modal-farmers-title" class="modal-window-title">
          <span class="ui-icon" aria-hidden="true" style="color: var(--color-primary);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </span>
          Meet Verified Regional Farmers
        </h3>
        <div style="display:flex; align-items:center; gap:8px;">
          <button type="button" class="btn-return-dashboard" onclick="window.closeBuyerModal()">← Back to Dashboard</button>
          <button type="button" class="modal-window-close" onclick="window.closeBuyerModal()" aria-label="Close farmers popup">&times;</button>
        </div>
      </div>"""
)

content = content.replace(
    """      <div class="modal-window-footer">
        <a href="#" class="btn btn-secondary" style="font-size: var(--font-size-xs);">Close Directory</a>
      </div>
    </div>
  </div>

  <!-- 5. BULK ORDER FORM POPUP MODAL -->""",
    """      <div class="modal-window-footer">
        <button type="button" class="btn btn-secondary btn-return-dashboard" onclick="window.closeBuyerModal()">← Back to Dashboard</button>
      </div>
    </div>
  </div>

  <!-- 5. BULK ORDER FORM POPUP MODAL -->"""
)

# 6. Update #modal-bulk
content = content.replace(
    """  <!-- 5. BULK ORDER FORM POPUP MODAL -->
  <div id="modal-bulk" class="modal-overlay" role="dialog" aria-labelledby="modal-bulk-title" aria-modal="true">
    <a href="#" class="modal-backdrop-close" aria-label="Close bulk order popup"></a>
    <div class="modal-window">
      <div class="modal-window-header">
        <h3 id="modal-bulk-title" class="modal-window-title">
          <span class="ui-icon" aria-hidden="true" style="color: var(--color-primary);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m7.5 4.27 9 5.15"/>
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
              <path d="m3.3 7 8.7 5 8.7-5"/>
              <path d="M12 22V12"/>
            </svg>
          </span>
          Place Bulk Farm Order
        </h3>
        <a href="#" class="modal-window-close" aria-label="Close bulk order popup">&times;</a>
      </div>""",
    """  <!-- 5. BULK ORDER FORM POPUP MODAL -->
  <div id="modal-bulk" class="modal-overlay" role="dialog" aria-labelledby="modal-bulk-title" aria-modal="true">
    <a href="#!" class="modal-backdrop-close" onclick="window.closeBuyerModal()" aria-label="Close bulk order popup"></a>
    <div class="modal-window">
      <div class="modal-window-header">
        <h3 id="modal-bulk-title" class="modal-window-title">
          <span class="ui-icon" aria-hidden="true" style="color: var(--color-primary);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m7.5 4.27 9 5.15"/>
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
              <path d="m3.3 7 8.7 5 8.7-5"/>
              <path d="M12 22V12"/>
            </svg>
          </span>
          Place Bulk Farm Order
        </h3>
        <div style="display:flex; align-items:center; gap:8px;">
          <button type="button" class="btn-return-dashboard" onclick="window.closeBuyerModal()">← Back to Dashboard</button>
          <button type="button" class="modal-window-close" onclick="window.closeBuyerModal()" aria-label="Close bulk order popup">&times;</button>
        </div>
      </div>"""
)

content = content.replace(
    """      <div class="modal-window-footer">
        <a href="#" class="btn btn-secondary" style="font-size: var(--font-size-xs);">Cancel</a>
      </div>
    </div>
  </div>

  <!-- 6. SHOPPING CART POPUP MODAL -->""",
    """      <div class="modal-window-footer">
        <button type="button" class="btn btn-secondary btn-return-dashboard" onclick="window.closeBuyerModal()">← Back to Dashboard / Cancel</button>
      </div>
    </div>
  </div>

  <!-- 6. SHOPPING CART POPUP MODAL -->"""
)

# 7. Update #modal-cart
content = content.replace(
    """  <!-- 6. SHOPPING CART POPUP MODAL -->
  <div id="modal-cart" class="modal-overlay" role="dialog" aria-labelledby="modal-cart-title" aria-modal="true">
    <a href="#" class="modal-backdrop-close" aria-label="Close cart popup"></a>
    <div class="modal-window">
      <div class="modal-window-header">
        <h3 id="modal-cart-title" class="modal-window-title">
          <span class="ui-icon" aria-hidden="true" style="color: var(--color-primary);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </span>
          Your Mandi Cart (3 Items)
        </h3>
        <a href="#" class="modal-window-close" aria-label="Close cart popup">&times;</a>
      </div>""",
    """  <!-- 6. SHOPPING CART POPUP MODAL -->
  <div id="modal-cart" class="modal-overlay" role="dialog" aria-labelledby="modal-cart-title" aria-modal="true">
    <a href="#!" class="modal-backdrop-close" onclick="window.closeBuyerModal()" aria-label="Close cart popup"></a>
    <div class="modal-window">
      <div class="modal-window-header">
        <h3 id="modal-cart-title" class="modal-window-title">
          <span class="ui-icon" aria-hidden="true" style="color: var(--color-primary);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </span>
          Your Mandi Cart (3 Items)
        </h3>
        <div style="display:flex; align-items:center; gap:8px;">
          <button type="button" class="btn-return-dashboard" onclick="window.closeBuyerModal()">← Back to Dashboard</button>
          <button type="button" class="modal-window-close" onclick="window.closeBuyerModal()" aria-label="Close cart popup">&times;</button>
        </div>
      </div>"""
)

content = content.replace(
    """      <div class="modal-window-footer">
        <a href="#" class="btn btn-secondary" style="font-size: var(--font-size-xs);">Keep Shopping</a>
        <a href="#modal-orders" class="btn btn-primary" style="font-size: var(--font-size-xs);">Proceed to Checkout (₹410)</a>
      </div>
    </div>
  </div>

  <!-- 7. NOTIFICATIONS & SYSTEM ALERTS POPUP MODAL -->""",
    """      <div class="modal-window-footer">
        <button type="button" class="btn btn-secondary btn-return-dashboard" onclick="window.closeBuyerModal()">← Continue Shopping / Back to Dashboard</button>
        <button type="button" class="btn btn-primary btn-checkout">Proceed to Checkout (₹410)</button>
      </div>
    </div>
  </div>

  <!-- 7. NOTIFICATIONS & SYSTEM ALERTS POPUP MODAL -->"""
)

# 8. Update #modal-notifications
content = content.replace(
    """  <!-- 7. NOTIFICATIONS & SYSTEM ALERTS POPUP MODAL -->
  <div id="modal-notifications" class="modal-overlay" role="dialog" aria-labelledby="modal-notif-title" aria-modal="true">
    <a href="#" class="modal-backdrop-close" aria-label="Close notifications popup"></a>
    <div class="modal-window">
      <div class="modal-window-header">
        <h3 id="modal-notif-title" class="modal-window-title">
          <span class="ui-icon" aria-hidden="true" style="color: var(--color-primary);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </span>
          Notifications &amp; Price Alerts
        </h3>
        <a href="#" class="modal-window-close" aria-label="Close notifications popup">&times;</a>
      </div>""",
    """  <!-- 7. NOTIFICATIONS & SYSTEM ALERTS POPUP MODAL -->
  <div id="modal-notifications" class="modal-overlay" role="dialog" aria-labelledby="modal-notif-title" aria-modal="true">
    <a href="#!" class="modal-backdrop-close" onclick="window.closeBuyerModal()" aria-label="Close notifications popup"></a>
    <div class="modal-window">
      <div class="modal-window-header">
        <h3 id="modal-notif-title" class="modal-window-title">
          <span class="ui-icon" aria-hidden="true" style="color: var(--color-primary);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </span>
          Notifications &amp; Price Alerts
        </h3>
        <div style="display:flex; align-items:center; gap:8px;">
          <button type="button" class="btn-return-dashboard" onclick="window.closeBuyerModal()">← Back to Dashboard</button>
          <button type="button" class="modal-window-close" onclick="window.closeBuyerModal()" aria-label="Close notifications popup">&times;</button>
        </div>
      </div>"""
)

content = content.replace(
    """      <div class="modal-window-footer">
        <a href="#" class="btn btn-secondary" style="font-size: var(--font-size-xs);">Dismiss All</a>
      </div>
    </div>
  </div>

  <!-- 8. PROFILE & PREFERENCES POPUP MODAL -->""",
    """      <div class="modal-window-footer">
        <button type="button" class="btn btn-secondary btn-return-dashboard" onclick="window.closeBuyerModal()">← Back to Dashboard</button>
      </div>
    </div>
  </div>

  <!-- 8. PROFILE & PREFERENCES POPUP MODAL -->"""
)

# 9. Update #modal-profile with View mode & Edit mode form
new_profile_modal = """  <!-- 8. PROFILE & PREFERENCES POPUP MODAL -->
  <div id="modal-profile" class="modal-overlay" role="dialog" aria-labelledby="modal-prof-title" aria-modal="true">
    <a href="#!" class="modal-backdrop-close" onclick="window.closeBuyerModal()" aria-label="Close profile popup"></a>
    <div class="modal-window">
      <div class="modal-window-header">
        <h3 id="modal-prof-title" class="modal-window-title">
          <span class="ui-icon" aria-hidden="true" style="color: var(--color-primary);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </span>
          Buyer Profile &amp; Preferences
        </h3>
        <div style="display:flex; align-items:center; gap:8px;">
          <button type="button" id="btn-toggle-edit-profile" class="btn-return-dashboard" style="background:var(--color-primary); color:#ffffff; border-color:var(--color-primary);">✎ Edit Profile</button>
          <button type="button" class="btn-return-dashboard" onclick="window.closeBuyerModal()">← Back to Dashboard</button>
          <button type="button" class="modal-window-close" onclick="window.closeBuyerModal()" aria-label="Close profile popup">&times;</button>
        </div>
      </div>

      <div class="modal-window-body">
        <!-- View Mode Section -->
        <div id="profile-view-section">
          <div class="profile-card-top">
            <div class="profile-avatar-box">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <h4 id="prof-view-name" style="font-size: 1.15rem; font-weight: 700; color: var(--color-text-main);">Amit Sharma</h4>
              <span style="font-size: var(--font-size-xs); color: var(--color-primary); font-weight: 600;">Verified Individual Household Buyer</span>
              <div style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: 2px;">Member since January 2026</div>
            </div>
          </div>

          <div class="profile-details-grid">
            <div class="profile-detail-item">
              <span class="profile-detail-label">Primary Contact</span>
              <span class="profile-detail-val" id="prof-view-contact">+91 98765 43210 • amit.sharma@example.com</span>
            </div>

            <div class="profile-detail-item">
              <span class="profile-detail-label">Default Delivery Address</span>
              <span class="profile-detail-val" id="prof-view-address">
                Flat 402, Tower B, Green Meadows, Sector 56, Gurugram, Haryana - 122001
              </span>
            </div>

            <div class="profile-detail-item">
              <span class="profile-detail-label">Direct Farm Preferences</span>
              <span class="profile-detail-val" id="prof-view-pref">Organic / Chemical-Free Soil Preferred • Weekly Harvest Deliveries</span>
            </div>

            <div class="profile-detail-item">
              <span class="profile-detail-label">Mandi Radius</span>
              <span class="profile-detail-val" id="prof-view-radius">Local Farm Hubs within 60 km</span>
            </div>
          </div>
        </div>

        <!-- Edit Mode Section -->
        <div id="profile-edit-section" style="display: none;">
          <h4 style="font-size: 1rem; font-weight: 700; color: var(--color-primary); margin-bottom: 0.5rem;">Edit Your Buyer Profile</h4>
          <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 1rem;">Keep your contact and address details up to date for smooth farmer dispatches.</p>
          
          <form id="profile-edit-form">
            <div class="profile-form-grid">
              <div class="profile-input-group">
                <label class="profile-input-label" for="prof-edit-name">Full Name</label>
                <input type="text" id="prof-edit-name" class="profile-form-input" required>
              </div>

              <div class="profile-input-group">
                <label class="profile-input-label" for="prof-edit-business">Household / Business</label>
                <input type="text" id="prof-edit-business" class="profile-form-input" placeholder="e.g. Sharma Household">
              </div>

              <div class="profile-input-group">
                <label class="profile-input-label" for="prof-edit-phone">Phone Number</label>
                <input type="tel" id="prof-edit-phone" class="profile-form-input" required>
              </div>

              <div class="profile-input-group">
                <label class="profile-input-label" for="prof-edit-email">Email Address</label>
                <input type="email" id="prof-edit-email" class="profile-form-input" required>
              </div>

              <div class="profile-input-group full-width">
                <label class="profile-input-label" for="prof-edit-address">Delivery Address</label>
                <input type="text" id="prof-edit-address" class="profile-form-input" required>
              </div>

              <div class="profile-input-group">
                <label class="profile-input-label" for="prof-edit-district">District / City</label>
                <input type="text" id="prof-edit-district" class="profile-form-input" required>
              </div>

              <div class="profile-input-group">
                <label class="profile-input-label" for="prof-edit-state">State</label>
                <input type="text" id="prof-edit-state" class="profile-form-input" required>
              </div>

              <div class="profile-input-group">
                <label class="profile-input-label" for="prof-edit-radius">Mandi Radius</label>
                <select id="prof-edit-radius" class="profile-form-input">
                  <option value="25 km">Local Hubs within 25 km</option>
                  <option value="50 km">Regional Hubs within 50 km</option>
                  <option value="60 km" selected>Direct Hubs within 60 km</option>
                  <option value="100 km">Statewide Hubs within 100 km</option>
                </select>
              </div>

              <div class="profile-input-group">
                <label class="profile-input-label" for="prof-edit-pref">Produce Preference</label>
                <select id="prof-edit-pref" class="profile-form-input">
                  <option value="Organic / Chemical-Free Soil Preferred" selected>Organic / Chemical-Free Soil</option>
                  <option value="Farm Fresh Harvest (Standard)">Farm Fresh Direct Harvest</option>
                  <option value="Grade A Premium Export Lots">Grade A Premium Lots</option>
                </select>
              </div>
            </div>

            <div style="display: flex; gap: 10px; margin-top: 1.25rem;">
              <button type="submit" class="btn btn-primary" style="font-size: 0.85rem; padding: 0.55rem 1.4rem;">Save Profile Changes</button>
              <button type="button" id="btn-cancel-profile-edit" class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.55rem 1.2rem;">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <div class="modal-window-footer">
        <a href="index.html" class="btn btn-secondary" style="font-size: var(--font-size-xs);">Log Out</a>
        <button type="button" class="btn btn-primary btn-return-dashboard" onclick="window.closeBuyerModal()" style="font-size: var(--font-size-xs);">← Done &amp; Return to Dashboard</button>
      </div>
    </div>
  </div>"""

old_profile_regex = r'  <!-- 8\. PROFILE & PREFERENCES POPUP MODAL -->.*?</div>\s*</div>\s*</div>\s*(?=<!-- ==========================================================================\s*9\. MOBILE BOTTOM NAVIGATION)'
content = re.sub(old_profile_regex, new_profile_modal + '\n\n', content, flags=re.DOTALL)

with open('buyer-dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)

# Copy to AgriMitra-Buyer/buyer-dashboard.html
with open('AgriMitra-Buyer/buyer-dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Stage 2 completed successfully. Both files synchronized.")

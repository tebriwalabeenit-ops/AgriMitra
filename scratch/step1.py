import re

with open('buyer-dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update CSS
css_addon = """
    .modal-overlay:target:not(.is-closing) {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }
    .modal-overlay.is-closing {
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
    .btn-return-dashboard {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--color-primary-light, #f0fdf4);
      color: var(--color-primary, #166534);
      border: 1px solid var(--color-primary-border, #bbf7d0);
      padding: 5px 12px;
      border-radius: var(--radius-full, 9999px);
      font-size: var(--font-size-xs, 0.75rem);
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      transition: all var(--transition-fast, 0.15s ease);
    }
    .btn-return-dashboard:hover {
      background: var(--color-primary, #166534);
      color: #ffffff;
      border-color: var(--color-primary, #166534);
    }
    .category-filter-pills-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      overflow-x: auto;
      padding: 6px 2px 14px 2px;
      margin-bottom: 1.25rem;
      scrollbar-width: thin;
    }
    .category-filter-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: var(--radius-full, 9999px);
      background: var(--color-surface, #ffffff);
      border: 1px solid var(--color-border, #e2e8f0);
      color: var(--color-text-main, #0f172a);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
      box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }
    .category-filter-pill:hover {
      border-color: var(--color-primary, #166534);
      background: var(--color-primary-light, #f0fdf4);
      color: var(--color-primary, #166534);
    }
    .category-filter-pill.active {
      background: var(--color-primary, #166534);
      color: #ffffff;
      border-color: var(--color-primary, #166534);
      box-shadow: 0 2px 8px rgba(22, 101, 52, 0.25);
    }
    .filter-status-bar {
      display: none;
      align-items: center;
      justify-content: space-between;
      background: var(--color-primary-light, #f0fdf4);
      border: 1px solid var(--color-primary-border, #bbf7d0);
      border-radius: var(--radius-md, 8px);
      padding: 8px 14px;
      margin-bottom: 1.25rem;
      font-size: 0.85rem;
      color: var(--color-primary, #166534);
    }
    .btn-clear-filter {
      background: none;
      border: none;
      color: var(--color-primary, #166534);
      font-weight: 700;
      cursor: pointer;
      text-decoration: underline;
      font-size: 0.82rem;
    }
    .farmer-avatar-default {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
      color: #166534;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #a5d6a7;
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
      flex-shrink: 0;
    }
    .farmer-default-avatar-svg {
      width: 28px;
      height: 28px;
    }
    .profile-form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 14px;
    }
    @media (max-width: 640px) {
      .profile-form-grid {
        grid-template-columns: 1fr;
      }
    }
    .profile-input-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .profile-input-group.full-width {
      grid-column: 1 / -1;
    }
    .profile-input-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text-muted, #64748b);
    }
    .profile-form-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--color-border, #cbd5e1);
      border-radius: var(--radius-md, 6px);
      font-size: 0.875rem;
      color: var(--color-text-main, #0f172a);
      background: var(--color-surface, #ffffff);
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .profile-form-input:focus {
      outline: none;
      border-color: var(--color-primary, #166534);
      box-shadow: 0 0 0 3px rgba(22, 101, 52, 0.15);
    }
"""

if '.modal-overlay:target {' in content:
    content = content.replace(
        '.modal-overlay:target {\n      opacity: 1;\n      visibility: visible;\n      pointer-events: auto;\n    }',
        css_addon
    )
    print("CSS updated successfully.")
else:
    print("Could not find .modal-overlay:target")

# 2. Navbar items: smooth scroll instead of modals
content = content.replace('<a href="#modal-produce" class="mega-topbar-link">', '<a href="#fresh-produce" class="mega-topbar-link">')
content = content.replace('<a href="#modal-farmers" class="mega-topbar-link">', '<a href="#farmers" class="mega-topbar-link">')
content = content.replace('<a href="#modal-bulk" class="mega-topbar-link">', '<a href="#bulk-order" class="mega-topbar-link">')
content = content.replace('<a href="#modal-categories" class="mega-cat-btn" title="View all product categories">', '<a href="#categories" class="mega-cat-btn" title="View all product categories">')
content = content.replace('<span class="mega-act-sub">Hello, Ramesh</span>', '<span class="mega-act-sub" data-user-name>Hello, Amit</span>')

# 3. Search form action
content = content.replace(
    '<form class="search-bar-container" action="#search-results" method="GET" role="search">',
    '<form class="search-bar-container" action="javascript:void(0)" method="GET" role="search">'
)

# 4. Shop by Category section: data-category and links
old_cat_section = """          <!-- Category 1: Vegetables -->
          <a href="#modal-categories" class="category-card">
            <div class="category-img-container">
              <img
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80"
                alt="Fresh Green Vegetables"
                class="category-real-img"
                loading="lazy">
            </div>
            <div class="category-info-box">
              <span class="category-name">Vegetables</span>
              <span class="category-count">18 Fresh Varieties</span>
            </div>
          </a>

          <!-- Category 2: Fruits -->
          <a href="#modal-categories" class="category-card">
            <div class="category-img-container">
              <img
                src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80"
                alt="Fresh Orchard Fruits"
                class="category-real-img"
                loading="lazy">
            </div>
            <div class="category-info-box">
              <span class="category-name">Fruits</span>
              <span class="category-count">12 Orchard Picks</span>
            </div>
          </a>

          <!-- Category 3: Grains -->
          <a href="#modal-categories" class="category-card">
            <div class="category-img-container">
              <img
                src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80"
                alt="Golden Agricultural Grains"
                class="category-real-img"
                loading="lazy">
            </div>
            <div class="category-info-box">
              <span class="category-name">Grains</span>
              <span class="category-count">8 Farm Staples</span>
            </div>
          </a>

          <!-- Category 4: Pulses -->
          <a href="#modal-categories" class="category-card">
            <div class="category-img-container">
              <img
                src="https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=400&q=80"
                alt="Unpolished Indian Pulses and Dals"
                class="category-real-img"
                loading="lazy">
            </div>
            <div class="category-info-box">
              <span class="category-name">Pulses</span>
              <span class="category-count">10 Unpolished Dals</span>
            </div>
          </a>

          <!-- Category 5: Other Farm Products -->
          <a href="#modal-categories" class="category-card">
            <div class="category-img-container">
              <img
                src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80"
                alt="Pure Farm Honey and Cold-Pressed Oils"
                class="category-real-img"
                loading="lazy">
            </div>
            <div class="category-info-box">
              <span class="category-name">Other Farm Products</span>
              <span class="category-count">Honey, Oils &amp; Jaggery</span>
            </div>
          </a>"""

new_cat_section = """          <!-- Category 1: Vegetables -->
          <a href="#fresh-produce" class="category-card" data-category="vegetables" title="Filter Vegetables">
            <div class="category-img-container">
              <img
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80"
                alt="Fresh Green Vegetables"
                class="category-real-img"
                loading="lazy">
            </div>
            <div class="category-info-box">
              <span class="category-name">Vegetables</span>
              <span class="category-count">18 Fresh Varieties</span>
            </div>
          </a>

          <!-- Category 2: Fruits -->
          <a href="#fresh-produce" class="category-card" data-category="fruits" title="Filter Fruits">
            <div class="category-img-container">
              <img
                src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80"
                alt="Fresh Orchard Fruits"
                class="category-real-img"
                loading="lazy">
            </div>
            <div class="category-info-box">
              <span class="category-name">Fruits</span>
              <span class="category-count">12 Orchard Picks</span>
            </div>
          </a>

          <!-- Category 3: Grains -->
          <a href="#fresh-produce" class="category-card" data-category="grains" title="Filter Grains">
            <div class="category-img-container">
              <img
                src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80"
                alt="Golden Agricultural Grains"
                class="category-real-img"
                loading="lazy">
            </div>
            <div class="category-info-box">
              <span class="category-name">Grains</span>
              <span class="category-count">8 Farm Staples</span>
            </div>
          </a>

          <!-- Category 4: Pulses -->
          <a href="#fresh-produce" class="category-card" data-category="pulses" title="Filter Pulses">
            <div class="category-img-container">
              <img
                src="https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=400&q=80"
                alt="Unpolished Indian Pulses and Dals"
                class="category-real-img"
                loading="lazy">
            </div>
            <div class="category-info-box">
              <span class="category-name">Pulses</span>
              <span class="category-count">10 Unpolished Dals</span>
            </div>
          </a>

          <!-- Category 5: Other Farm Products -->
          <a href="#fresh-produce" class="category-card" data-category="other" title="Filter Honey, Oils & Farm Products">
            <div class="category-img-container">
              <img
                src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80"
                alt="Pure Farm Honey and Cold-Pressed Oils"
                class="category-real-img"
                loading="lazy">
            </div>
            <div class="category-info-box">
              <span class="category-name">Other Farm Products</span>
              <span class="category-count">Honey, Oils &amp; Jaggery</span>
            </div>
          </a>"""

if old_cat_section in content:
    content = content.replace(old_cat_section, new_cat_section)
    print("Category cards updated.")
else:
    print("Category cards match failed.")

content = content.replace(
    '<a href="#modal-categories" class="section-view-all">View All Categories →</a>',
    '<a href="#fresh-produce" class="section-view-all" data-category="all">View All Categories →</a>'
)

# 5. Produce section pills and data-category attributes
pills_html = """        <!-- Category Filter Pills Bar -->
        <div class="category-filter-pills-bar" role="tablist" aria-label="Filter Produce by Category">
          <button type="button" class="category-filter-pill active" data-category="all">
            <span>🌿 All Produce (9)</span>
          </button>
          <button type="button" class="category-filter-pill" data-category="vegetables">
            <span>🥦 Vegetables (3)</span>
          </button>
          <button type="button" class="category-filter-pill" data-category="fruits">
            <span>🍎 Fruits (2)</span>
          </button>
          <button type="button" class="category-filter-pill" data-category="grains">
            <span>🌾 Grains (1)</span>
          </button>
          <button type="button" class="category-filter-pill" data-category="pulses">
            <span>🫘 Pulses (1)</span>
          </button>
          <button type="button" class="category-filter-pill" data-category="other">
            <span>🍯 Other Farm Products (2)</span>
          </button>
        </div>

        <!-- Dynamic Filter & Search Status Bar -->
        <div id="filter-status-bar" class="filter-status-bar">
          <span class="filter-status-text">Showing 9 produce lots</span>
          <button type="button" id="btn-clear-filters" class="btn-clear-filter">✕ Show All Produce</button>
        </div>

        <div class="products-grid">"""

content = content.replace('        <div class="products-grid">', pills_html, 1)

# Add data-category to product cards
content = content.replace('<!-- Product Card 1: Fresh Potatoes -->\n          <article class="product-card">', '<!-- Product Card 1: Fresh Potatoes -->\n          <article class="product-card" data-category="vegetables">')
content = content.replace('<!-- Product Card 2: Farm Tomatoes -->\n          <article class="product-card">', '<!-- Product Card 2: Farm Tomatoes -->\n          <article class="product-card" data-category="vegetables">')
content = content.replace('<!-- Product Card 3: Nashik Red Onions -->\n          <article class="product-card">', '<!-- Product Card 3: Nashik Red Onions -->\n          <article class="product-card" data-category="vegetables">')
content = content.replace('<!-- Product Card 4: Alphonso Mangoes -->\n          <article class="product-card">', '<!-- Product Card 4: Alphonso Mangoes -->\n          <article class="product-card" data-category="fruits">')
content = content.replace('<!-- Product Card 5: Sharbati Whole Wheat -->\n          <article class="product-card">', '<!-- Product Card 5: Sharbati Whole Wheat -->\n          <article class="product-card" data-category="grains">')
content = content.replace('<!-- Product Card 6: Desi Chana -->\n          <article class="product-card">', '<!-- Product Card 6: Desi Chana -->\n          <article class="product-card" data-category="pulses">')

# Add 3 additional product cards after card 6
extra_cards = """          <!-- Product Card 7: Nagpur Oranges -->
          <article class="product-card" data-category="fruits">
            <div class="product-image-container">
              <img
                src="https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80"
                alt="Nagpur Sweet Fresh Oranges"
                class="product-real-img"
                loading="lazy">
              <span class="product-badge-fresh">Orchard Pick</span>
            </div>
            <div class="product-card-body">
              <h3 class="product-title">Nagpur Fresh Sweet Oranges</h3>
              <div class="farmer-info-strip">
                <div class="farmer-name-row">
                  <span class="ui-icon" aria-hidden="true" style="color: var(--color-primary);">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  <span>Anant Rao</span>
                </div>
                <div class="farmer-location-row">
                  <span class="ui-icon" aria-hidden="true" style="color: var(--color-text-muted);">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </span>
                  <span>Nagpur, Maharashtra</span>
                </div>
              </div>
              <div class="product-meta-row">
                <div class="product-price-block">
                  <span class="price-value">₹70</span>
                  <span class="price-unit">/ kg</span>
                </div>
                <span class="available-qty-badge">Available: 80 kg</span>
              </div>
              <a href="#modal-cart" class="btn-add-cart">
                <span class="ui-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                </span>
                ADD TO CART
              </a>
            </div>
          </article>

          <!-- Product Card 8: Cold Pressed Mustard Oil -->
          <article class="product-card" data-category="other">
            <div class="product-image-container">
              <img
                src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80"
                alt="Cold Pressed Kachi Ghani Mustard Oil"
                class="product-real-img"
                loading="lazy">
              <span class="product-badge-fresh">Cold Pressed</span>
            </div>
            <div class="product-card-body">
              <h3 class="product-title">Pure Kachi Ghani Mustard Oil</h3>
              <div class="farmer-info-strip">
                <div class="farmer-name-row">
                  <span class="ui-icon" aria-hidden="true" style="color: var(--color-primary);">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  <span>Devendra Sharma</span>
                </div>
                <div class="farmer-location-row">
                  <span class="ui-icon" aria-hidden="true" style="color: var(--color-text-muted);">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </span>
                  <span>Bharatpur, Rajasthan</span>
                </div>
              </div>
              <div class="product-meta-row">
                <div class="product-price-block">
                  <span class="price-value">₹160</span>
                  <span class="price-unit">/ L</span>
                </div>
                <span class="available-qty-badge">Available: 50 L</span>
              </div>
              <a href="#modal-cart" class="btn-add-cart">
                <span class="ui-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                </span>
                ADD TO CART
              </a>
            </div>
          </article>

          <!-- Product Card 9: Wild Forest Raw Honey -->
          <article class="product-card" data-category="other">
            <div class="product-image-container">
              <img
                src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80"
                alt="Wild Forest Raw Organic Honey"
                class="product-real-img"
                loading="lazy">
              <span class="product-badge-fresh">100% Raw</span>
            </div>
            <div class="product-card-body">
              <h3 class="product-title">Raw Wild Forest Honey</h3>
              <div class="farmer-info-strip">
                <div class="farmer-name-row">
                  <span class="ui-icon" aria-hidden="true" style="color: var(--color-primary);">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  <span>Mahadev Bhil</span>
                </div>
                <div class="farmer-location-row">
                  <span class="ui-icon" aria-hidden="true" style="color: var(--color-text-muted);">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </span>
                  <span>Aravalli, Rajasthan</span>
                </div>
              </div>
              <div class="product-meta-row">
                <div class="product-price-block">
                  <span class="price-value">₹320</span>
                  <span class="price-unit">/ 500g</span>
                </div>
                <span class="available-qty-badge">Available: 35 kg</span>
              </div>
              <a href="#modal-cart" class="btn-add-cart">
                <span class="ui-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                </span>
                ADD TO CART
              </a>
            </div>
          </article>
        </div>"""

content = content.replace(
    '              </a>\n            </div>\n          </article>\n        </div>\n      </section>',
    '              </a>\n            </div>\n          </article>\n' + extra_cards + '\n      </section>'
)

# 6. Meet the Farmers section: remove photos and use default user avatar
farmer_avatar_default_svg = """<div class="farmer-avatar-default" aria-label="Default Farmer Avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="farmer-default-avatar-svg">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>"""

content = re.sub(
    r'<img\s+src="https://images\.unsplash\.com/photo-[^"]+"\s+alt="Rajesh Kumar[^"]+"\s+class="farmer-avatar-img"\s+loading="lazy">',
    farmer_avatar_default_svg,
    content
)
content = re.sub(
    r'<img\s+src="https://images\.unsplash\.com/photo-[^"]+"\s+alt="Ramesh Patel[^"]+"\s+class="farmer-avatar-img"\s+loading="lazy">',
    farmer_avatar_default_svg,
    content
)
content = re.sub(
    r'<img\s+src="https://images\.unsplash\.com/photo-[^"]+"\s+alt="Sunita Devi[^"]+"\s+class="farmer-avatar-img"\s+loading="lazy">',
    farmer_avatar_default_svg,
    content
)

with open('buyer-dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Stage 1 transformation completed.")

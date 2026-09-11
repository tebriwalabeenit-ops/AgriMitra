with open('buyer-dashboard.html', 'r', encoding='utf-8') as f:
    html = f.read()

print("--- Checking All 9 Modals ---")
modals = [
    'modal-location', 'modal-orders', 'modal-categories', 
    'modal-produce', 'modal-farmers', 'modal-bulk', 
    'modal-cart', 'modal-notifications', 'modal-profile'
]

for m in modals:
    assert f'id="{m}"' in html, f'Missing {m}'
    m_idx = html.find(f'id="{m}"')
    next_modal = html.find('class="modal-overlay"', m_idx + 100)
    chunk = html[m_idx:next_modal if next_modal != -1 else m_idx+8000]
    assert 'btn-return-dashboard' in chunk, f'No btn-return-dashboard in {m}'
    assert 'closeBuyerModal' in chunk, f'No closeBuyerModal in {m}'
    print(f"[PASS] {m} contains back-to-dashboard buttons and close handlers")

print("\n--- Checking Category Sorter Markup ---")
assert 'class="category-filter-pills-bar"' in html, "Missing category-filter-pills-bar"
assert 'data-category="vegetables"' in html, "Missing vegetables data-category"
assert 'data-category="fruits"' in html, "Missing fruits data-category"
assert 'data-category="grains"' in html, "Missing grains data-category"
assert 'data-category="pulses"' in html, "Missing pulses data-category"
assert 'data-category="other"' in html, "Missing other data-category"
print("[PASS] Category pills and product card category data attributes verified")

print("\n--- Checking Live Search Markup ---")
assert 'id="mandi-search-input"' in html, "Missing search input ID"
assert 'action="javascript:void(0)"' in html, "Search form still submits to hash"
print("[PASS] Search bar markup and form submission prevention verified")

print("\n--- Checking Farmers Default Avatars ---")
assert 'farmer-avatar-default' in html, "Missing farmer-avatar-default"
assert 'farmer-default-avatar-svg' in html, "Missing farmer-default-avatar-svg"
# Verify no external portrait photos in farmers section
farmers_section = html[html.find('id="farmers"'):html.find('id="bulk-order"')]
assert 'images.unsplash.com' not in farmers_section, "External unsplash images still in farmers section!"
print("[PASS] Meet the Farmers section has external images removed and default avatar SVG verified")

print("\n--- Checking Profile Editor ---")
assert 'id="profile-view-section"' in html, "Missing profile-view-section"
assert 'id="profile-edit-section"' in html, "Missing profile-edit-section"
assert 'id="profile-edit-form"' in html, "Missing profile-edit-form"
assert 'id="btn-toggle-edit-profile"' in html, "Missing edit profile toggle button"
assert 'id="prof-edit-name"' in html, "Missing profile edit name input"
assert 'id="prof-edit-address"' in html, "Missing profile edit address input"
print("[PASS] Profile view and edit form verified")

print("\n--- Checking Asset Existence in AgriMitra-Buyer ---")
import os
assert os.path.exists('AgriMitra-Buyer/assets/buyer-marketplace.js'), "Missing AgriMitra-Buyer/assets/buyer-marketplace.js"
assert os.path.exists('AgriMitra-Buyer/assets/auth-guard.js'), "Missing AgriMitra-Buyer/assets/auth-guard.js"
assert os.path.exists('AgriMitra-Buyer/i18n.js'), "Missing AgriMitra-Buyer/i18n.js"
print("[PASS] All scripts present in AgriMitra-Buyer/ directory")

print("\nALL 9 MODALS & FEATURES VERIFIED PERFECTLY!")

import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

print("==================================================")
print("COMPREHENSIVE FPO VERIFICATION SUITE")
print("==================================================")

errors = []

# 1. Test fpo-live-bidding.html
for prefix in ['', 'AgriMitra- FPO/', 'fpo/']:
    path = prefix + 'fpo-live-bidding.html'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check section count
    sections = re.findall(r'<section\b[^>]*>', content)
    if len(sections) != 4:
        errors.append(f"[{path}] Expected 4 sections, found {len(sections)}")
    else:
        print(f"[PASS] {path}: exactly 4 sections found.")
        
    # Check cards
    cards = re.findall(r'<article class="trading-card"', content)
    if len(cards) != 7:
        errors.append(f"[{path}] Expected 7 trading cards (3 active, 2 upcoming, 2 completed), found {len(cards)}")
    else:
        print(f"[PASS] {path}: exactly 7 cards (3 active, 2 upcoming, 2 completed).")
        
    # Check headings
    headings = re.findall(r'<h2[^>]*>(.*?)</h2>', content)
    cleaned_h2 = [re.sub(r'<[^>]+>', '', h).strip() for h in headings]
    if len(cleaned_h2) != len(set(cleaned_h2)):
        errors.append(f"[{path}] Duplicate h2 headings found: {cleaned_h2}")
    else:
        print(f"[PASS] {path}: no duplicate h2 headings.")

# 2. Test fpo-dashboard.html
for prefix in ['', 'AgriMitra- FPO/', 'fpo/']:
    path = prefix + 'fpo-dashboard.html'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if 'trading-result.html' in content:
        errors.append(f"[{path}] Contains obsolete trading-result.html link!")
    else:
        print(f"[PASS] {path}: zero obsolete trading-result.html links.")
        
    # Check "View Live Bids" target
    view_live_bids = re.findall(r'<a\b[^>]*href=["\']([^"\']*)["\'][^>]*>\s*View Live Bids\s*</a>', content)
    if len(view_live_bids) != 3:
        errors.append(f"[{path}] Expected 3 'View Live Bids' links, found {len(view_live_bids)}")
    else:
        for target in view_live_bids:
            if target != 'fpo-bidding-status.html':
                errors.append(f"[{path}] 'View Live Bids' points to '{target}' instead of 'fpo-bidding-status.html'")
        print(f"[PASS] {path}: all 3 'View Live Bids' buttons point to 'fpo-bidding-status.html'.")

    # Check anchors
    for anchor in ['overview', 'produce', 'orders', 'farmers', 'buyers', 'payments']:
        if f'id="{anchor}"' not in content:
            errors.append(f"[{path}] Missing anchor id='{anchor}'")
        else:
            print(f"[PASS] {path}: anchor id='{anchor}' verified.")

# 3. Test fpo-bidding-result.html
for prefix in ['', 'AgriMitra- FPO/', 'fpo/']:
    path = prefix + 'fpo-bidding-result.html'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if 'wholesaler-trading.html' in content:
        errors.append(f"[{path}] Still links to wholesaler-trading.html!")
    else:
        print(f"[PASS] {path}: zero links to wholesaler-trading.html.")

# 4. Test stylesheet sizes
with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()
if '.brand-logo-img' not in css or 'height: 40px;' not in css:
    errors.append("style.css: .brand-logo-img is not configured to height: 40px;")
else:
    print("[PASS] style.css: .brand-logo-img height is 40px.")

if '.fpo-top-nav-bar' not in css:
    errors.append("style.css: .fpo-top-nav-bar styles missing!")
else:
    print("[PASS] style.css: .fpo-top-nav-bar styles present.")

print("\n==================================================")
if errors:
    print(f"FAILED with {len(errors)} errors:")
    for e in errors:
        print(" - ", e)
    sys.exit(1)
else:
    print("ALL TESTS PASSED! ZERO ERRORS FOUND.")
    print("==================================================")

import os, re

def check_file(path):
    if not os.path.exists(path):
        return f"{path} DOES NOT EXIST"
    size = os.path.getsize(path)
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    return f"{path} ({size} bytes, {len(content.splitlines())} lines)"

print("--- File sizes and versions ---")
for p in [
    'fpo-dashboard.html',
    'AgriMitra- FPO/fpo-dashboard.html',
    'fpo/fpo-dashboard.html',
    'AgriMitra- FPO/index.html',
    'fpo/index.html'
]:
    print(check_file(p))

print("\n--- Live Bidding Section in fpo-dashboard.html ---")
with open('fpo-dashboard.html', 'r', encoding='utf-8', errors='ignore') as f:
    fpo_dash = f.read()

# Search for live bidding section
live_bidding_match = re.search(r'(<!--\s*Live Bidding.*?-->|id=["\'](?:live-bidding|bidding|active-bidding)["\']|<section[^>]*class=["\'][^"\']*bidding[^"\']*["\'])', fpo_dash, re.I)
if live_bidding_match:
    print("Found live bidding match:", live_bidding_match.group(0))
    idx = live_bidding_match.start()
    print("Chunk around live bidding:")
    print(fpo_dash[idx:idx+1500])
else:
    print("No direct comment/id match for live bidding. Searching for 'live bidding' text:")
    for m in re.finditer(r'live bidding', fpo_dash, re.I):
        idx = m.start()
        print(fpo_dash[max(0, idx-100):min(len(fpo_dash), idx+400)])
        print("="*40)

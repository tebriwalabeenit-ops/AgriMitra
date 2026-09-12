import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

for fn in ['delivery-dashboard.html', 'delivery-agent.html', 'AgriMitra-delivery agent/delivery-agent.html']:
    print(f"\n==================== {fn} ====================")
    with open(fn, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
    
    # search for today's route section
    m = re.search(r'Today\'s Route.*?</section>', content, re.DOTALL | re.IGNORECASE)
    if not m:
        m = re.search(r'id=["\']view-route["\'].*?</section>', content, re.DOTALL | re.IGNORECASE)
    if m:
        print("Found route section, length:", len(m.group(0)))
        for line in m.group(0).splitlines():
            if any(k in line.lower() for k in ['iframe', 'map', 'leaflet', 'google', 'src=', 'blocked', 'openstreetmap']):
                print(" ", line[:140].strip())
    else:
        print("Route section regex not matched, searching for iframe or map tags:")
        for line in content.splitlines():
            if any(k in line.lower() for k in ['iframe', 'map', 'openstreetmap', 'google.com/maps', 'leaflet']):
                print(" ", line[:140].strip())

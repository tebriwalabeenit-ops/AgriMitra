import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

with open('delivery-dashboard.html', 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

# Let's find where view-route is used or how tabs are displayed
print("Occurrences of view-route:")
for i, l in enumerate(content.splitlines()):
    if 'view-route' in l:
        print(f"Line {i+1}: {l.strip()}")

# Search for iframes in delivery-dashboard.html
iframes = re.findall(r'<iframe\b[^>]*>', content, re.IGNORECASE)
print(f"\nIframes count: {len(iframes)}")
for ifr in iframes:
    print(" ", ifr)

# Search for maps in scripts
scripts = re.findall(r'<script\b[^>]*>.*?</script>', content, re.DOTALL | re.IGNORECASE)
print(f"\nScripts count: {len(scripts)}")
for idx, sc in enumerate(scripts):
    if 'map' in sc.lower() or 'leaflet' in sc.lower() or 'l.map' in sc.lower():
        print(f"Script {idx+1} has map keyword, length: {len(sc)}")
        for line in sc.splitlines()[:25]:
            print("  ", line.strip())

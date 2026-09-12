import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('fpo-dashboard.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# Find all cards under id="live-bidding"
idx = text.find('id="live-bidding"')
end_idx = text.find('</section>', idx)
live_bidding_section = text[idx:end_idx]

cards = re.findall(r'<h3[^>]*>(.*?)</h3>', live_bidding_section)
print("Cards under id='live-bidding' in fpo-dashboard.html:")
for c in cards:
    print("  -", c)

# Let's check all sections in fpo-dashboard.html
print("\nAll sections in fpo-dashboard.html:")
for s in re.finditer(r'<section[^>]*id=["\']([^"\']+)["\']', text):
    print("  Section id:", s.group(1))

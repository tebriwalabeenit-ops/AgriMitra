import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('fpo-live-bidding.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

print("File size:", len(text), "Lines:", len(text.splitlines()))

# Let's see the main sections and cards
import re
print("Headings in fpo-live-bidding.html:")
for h in re.finditer(r'<h[1-4][^>]*>(.*?)</h[1-4]>', text, re.I | re.DOTALL):
    print("  ", ' '.join(h.group(0).split())[:100])

print("\nCards / Table rows in fpo-live-bidding.html:")
for card in re.finditer(r'(?:class=["\'][^"\']*(?:bidding-card|session-card|auction-card|trading-card|lot-card|card|table)[^"\']*["\']|id=["\'][^"\']*(?:bidding|session|auction)[^"\']*["\'])', text, re.I):
    print("  ", card.group(0))

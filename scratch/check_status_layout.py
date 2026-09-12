import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

with open('fpo-bidding-status.html', 'r', encoding='utf-8', errors='replace') as f:
    html = f.read()

sections = re.findall(r'<section\b[^>]*>', html)
print(f"Sections in fpo-bidding-status.html ({len(sections)}):")
for s in sections:
    print(" ", s)

grids = re.findall(r'<(?:div|section)\b[^>]*class=["\'][^"\']*(?:grid|columns|layout)[^"\']*["\'][^>]*>', html)
print(f"\nGrids/layouts in fpo-bidding-status.html ({len(grids)}):")
for g in grids:
    print(" ", g)

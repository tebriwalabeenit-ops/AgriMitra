import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

for path in ['fpo-live-bidding.html', 'AgriMitra- FPO/fpo-live-bidding.html', 'fpo/fpo-live-bidding.html']:
    print(f"\nChecking {path}...")
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    sections = re.findall(r'<section\b[^>]*>', html)
    print(f"Total sections: {len(sections)}")
    for s in sections:
        print("  ", s)
    
    cards = re.findall(r'<article class="trading-card"', html)
    print(f"Trading cards: {len(cards)}")
    
    headings = re.findall(r'<h[23][^>]*>(.*?)</h[23]>', html)
    for h in headings:
        print("  Heading:", h)

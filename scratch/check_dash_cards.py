import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

with open('fpo-dashboard.html', 'r', encoding='utf-8') as f:
    html = f.read()

m = re.search(r'id=["\']live-trading["\'].*?</section>', html, re.DOTALL)
if m:
    cards = re.findall(r'<div style="background-color: var\(--color-surface-alt.*?(?=<div style="background-color: var\(--color-surface-alt|</section>)', m.group(0), re.DOTALL)
    print(f"Cards found in live-trading: {len(cards)}")
    for idx, c in enumerate(cards, 1):
        print(f"\n--- Card {idx} length: {len(c)} ---")
        title = re.search(r'<h3[^>]*>(.*?)</h3>', c)
        print("Title:", title.group(1) if title else "None")
        print("First 300 chars:")
        print(c[:300].strip())

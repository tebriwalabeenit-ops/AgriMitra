import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

with open('fpo-live-bidding.html', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'<article class="trading-card">.*?</article>', content, re.DOTALL)
if m:
    print(m.group(0))

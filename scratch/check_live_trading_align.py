import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

with open('fpo-dashboard.html', 'r', encoding='utf-8', errors='replace') as f:
    html = f.read()

m = re.search(r'<section[^>]*id=["\']live-trading["\'][^>]*>.*?</section>', html, re.DOTALL)
if m:
    sec = m.group(0)
    print("live-trading section length:", len(sec))
    # print grid or flex wrapper
    grids = re.findall(r'<div[^>]*style=["\'][^"\']*(?:grid|flex)[^"\']*["\'][^>]*>', sec)
    for g in grids:
        print("Container:", g)

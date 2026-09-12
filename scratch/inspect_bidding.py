import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

with open('fpo-bidding-result.html', 'r', encoding='utf-8', errors='replace') as f:
    res_code = f.read()

import re
m1 = re.search(r'id=["\']state-sold["\'].*?>', res_code)
m2 = re.search(r'id=["\']state-nobids["\'].*?>', res_code)
print(m1.group(0) if m1 else "No state-sold")
print(m2.group(0) if m2 else "No state-nobids")










with open('fpo-bidding-result.html', 'r', encoding='utf-8', errors='replace') as f:
    res_html = f.read()

buttons2 = re.findall(r'<button\b[^>]*>(.*?)</button>', res_html, re.DOTALL)
print(f"Buttons in fpo-bidding-result.html ({len(buttons2)}):")
for b in buttons2:
    print(" ", ' '.join(b.split())[:80])






















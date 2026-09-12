import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

with open('delivery-dashboard.html', 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

m = re.search(r'id=["\']panel-route["\'].*?</section>', content, re.DOTALL)
if m:
    print("Found panel-route, length:", len(m.group(0)))
    for line in m.group(0).splitlines():
        print(line)
else:
    print("panel-route not found")

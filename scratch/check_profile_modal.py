import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

with open('fpo-dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'id=["\']fpoProfileModal["\'].*?</dialog>|id=["\']fpoProfileModal["\'].*?</div>\s*</div>\s*</div>', content, re.DOTALL)
if m:
    print("Found fpoProfileModal, length:", len(m.group(0)))
    print(m.group(0)[:600])
else:
    print("fpoProfileModal not found")

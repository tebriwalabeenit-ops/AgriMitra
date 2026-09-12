import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('AgriMitra- FPO/app.js', 'r', encoding='utf-8', errors='ignore') as fp:
    text = fp.read()

print("Occurrences of 'bidding' in app.js:")
for m in re.finditer(r'[^\n]*bidding[^\n]*', text, re.I):
    print("  ", m.group(0).strip())

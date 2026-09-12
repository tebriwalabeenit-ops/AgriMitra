import sys, re
sys.stdout.reconfigure(encoding='utf-8')

print("=== 1. Links in index.html to FPO ===")
with open('index.html', 'r', encoding='utf-8') as f:
    index_text = f.read()

for m in re.finditer(r'<a[^>]*href=["\'][^"\']*fpo[^"\']*["\'][^>]*>(.*?)</a>', index_text, re.I | re.DOTALL):
    print("Match:", m.group(0).replace('\n', ' ')[:140])

print("\n=== 2. Check FPO files comparison ===")
# Which FPO files exist and which ones are the main ones?
fpo_files = [
    'fpo-dashboard.html',
    'fpo-live-bidding.html',
    'fpo-bidding-status.html',
    'fpo-bidding-result.html',
    'create-live-bidding.html',
    'fpo-register.html',
    'fpo-trading-dashboard.html'
]
for f in fpo_files:
    print(f"File: {f}")

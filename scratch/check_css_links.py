import sys, re
sys.stdout.reconfigure(encoding='utf-8')

pages = ['create-live-bidding.html', 'fpo-bidding-status.html', 'fpo-bidding-result.html', 'fpo-live-bidding.html', 'fpo-dashboard.html']
for p in pages:
    with open(p, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    links = re.findall(r'<link[^>]*rel=["\']stylesheet["\'][^>]*>', text, re.I)
    print(f"CSS links in {p}:")
    for l in links:
        print("  ", l)

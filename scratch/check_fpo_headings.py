import sys, re
sys.stdout.reconfigure(encoding='utf-8')

for path in ['fpo-dashboard.html', 'AgriMitra- FPO/fpo-dashboard.html', 'fpo-live-bidding.html', 'AgriMitra- FPO/fpo-live-bidding.html']:
    print(f"\n=================== {path} ===================")
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    
    # Check all h2 and h3
    headings = re.findall(r'<h[23][^>]*>(.*?)</h[23]>', text, re.I | re.DOTALL)
    for h in headings:
        cleaned = ' '.join(re.sub(r'<[^>]+>', '', h).split())
        print("  -", cleaned)

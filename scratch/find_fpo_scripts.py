import sys, re
sys.stdout.reconfigure(encoding='utf-8')

for f in ['fpo-dashboard.html', 'AgriMitra- FPO/fpo-dashboard.html', 'fpo-live-bidding.html', 'AgriMitra- FPO/fpo-live-bidding.html']:
    with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
        text = fp.read()
    scripts = re.findall(r'<script[^>]*>.*?</script>', text, re.I | re.DOTALL)
    print(f"\n*** Scripts in {f} ({len(scripts)} found) ***")
    for s in scripts:
        src = re.search(r'src=["\']([^"\']+)["\']', s)
        if src:
            print("  - External script:", src.group(1))
        else:
            inline_snip = s[:200].replace('\n', ' ')
            print("  - Inline script:", inline_snip)

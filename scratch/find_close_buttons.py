import os, re, sys
sys.stdout.reconfigure(encoding='utf-8')

print("=== Scanning all HTML files for modals and close buttons ===")
for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root or 'scratch' in root:
        continue
    for f in files:
        if f.endswith('.html'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
                text = fp.read()
            # check for modal or popup
            has_modal = 'modal' in text.lower() or 'popup' in text.lower()
            if has_modal:
                close_btns = re.findall(r'<[a-z0-9]+[^>]*class=["\'][^"\']*(?:close|modal)[^"\']*["\'][^>]*>.*?<\/[a-z0-9]+>', text, re.I | re.DOTALL)
                times_btns = re.findall(r'<[a-z0-9]+[^>]*>(?:&times;|✕|×|&#215;).*?<\/[a-z0-9]+>', text, re.I | re.DOTALL)
                all_hits = set(close_btns + times_btns)
                if all_hits:
                    print(f"\n[FILE] {path} -> {len(all_hits)} close/times buttons found:")
                    for h in list(all_hits)[:5]:
                        print("   ", " ".join(h.replace('\n', ' ').split())[:120])

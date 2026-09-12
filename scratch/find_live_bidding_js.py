import os, re

for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root or 'scratch' in root:
        continue
    for f in files:
        if f.endswith('.js') or f.endswith('.html'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
                content = fp.read()
            # check for live bidding rendering or auction fetching
            if 'api/auctions' in content or 'api/fpo/auctions' in content or 'renderbidding' in content.lower() or 'livebidding' in content.lower() or 'live-bidding' in content.lower():
                print(f"[HIT] {path}")
                for m in re.finditer(r'(?:api/auctions|api/fpo/auctions|render.*bidd|live.*bidd)', content, re.I):
                    start = max(0, m.start()-50)
                    end = min(len(content), m.end()+150)
                    print("   ", content[start:end].replace('\n', ' ')[:140])
                    break

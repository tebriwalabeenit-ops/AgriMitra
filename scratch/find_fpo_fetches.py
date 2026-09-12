import sys, os, re
sys.stdout.reconfigure(encoding='utf-8')

for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root or 'scratch' in root:
        continue
    for f in files:
        if f.endswith('.js') or f.endswith('.html'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
                text = fp.read()
            if 'api/fpo' in text or 'api/auction' in text or 'fetch(' in text:
                matches = re.findall(r'fetch\([\'"`][^\'"`]+[\'"`]', text)
                if matches:
                    fpo_matches = [m for m in matches if 'fpo' in m or 'auction' in m]
                    if fpo_matches:
                        print(f"[PATH] {path}:")
                        for m in fpo_matches:
                            print("   ", m)

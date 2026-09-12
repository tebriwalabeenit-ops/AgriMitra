import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('assets/frontend_api.js', 'r', encoding='utf-8', errors='replace') as f:
    lines = f.readlines()

for i in range(1340, min(1500, len(lines))):
    print(f"{i+1}: {lines[i].rstrip()}")

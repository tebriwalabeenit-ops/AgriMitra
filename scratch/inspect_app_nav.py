import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('AgriMitra- FPO/app.js', 'r', encoding='utf-8', errors='replace') as f:
    lines = f.readlines()

for i in range(180, 270):
    print(f"{i+1}: {lines[i].strip()}")

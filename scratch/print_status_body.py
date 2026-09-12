import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('fpo-bidding-status.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(100, min(220, len(lines))):
    print(f"{i+1}: {lines[i].rstrip()}")

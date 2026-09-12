import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('fpo-dashboard.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(184, 326):
    print(f"{i+1}: {lines[i].rstrip()}")

import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

with open('style.css', 'r', encoding='utf-8', errors='replace') as f:
    css = f.read()

targets = [
    '.fpo-top-nav-bar',
    '.trading-header-bar',
    '.trading-cards-grid',
    '.trading-card',
    '.app-layout',
    '.dashboard-main',
    '.metrics-grid'
]

for t in targets:
    m = re.search(re.escape(t) + r'\s*\{[^}]+\}', css)
    if m:
        print(f"--- {t} ---")
        print(m.group(0).strip())
    else:
        print(f"--- {t} NOT FOUND ---")

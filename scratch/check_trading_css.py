import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

with open('style.css', 'r', encoding='utf-8', errors='replace') as f:
    css = f.read()

classes = [
    'trading-metrics-grid',
    'trading-metric-item',
    'trading-card-body',
    'trading-card-banner',
    'trading-card-title-group',
    'trading-card-title',
    'trading-card-footer',
    'fpo-top-nav-bar',
    'card-header',
    'header-inner'
]

for c in classes:
    m = re.findall(r'(\.' + c + r'[^{]*\{[^}]+\})', css)
    print(f"=== .{c} ({len(m)}) ===")
    for rule in m:
        clean = ' '.join(rule.split())
        print(" ", clean[:120])

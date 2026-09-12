import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

# 1. Update style.css
with open('style.css', 'r', encoding='utf-8', errors='replace') as f:
    css = f.read()

# Fix brand-logo-img height from 100px to 40px
css = re.sub(
    r'\.brand-logo-img\s*\{[^}]*height:\s*100px;[^}]*\}',
    '''.brand-logo-img {
  height: 40px;
  width: auto;
  max-height: 40px;
  object-fit: contain;
  border-radius: var(--radius-sm);
  display: block;
  flex-shrink: 0;
}''',
    css
)

# Fix trading-hero-inner align-items to center
css = re.sub(
    r'\.trading-hero-inner\s*\{[^}]*align-items:\s*flex-start;[^}]*\}',
    '''.trading-hero-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  flex-wrap: wrap;
}''',
    css
)

# Add .fpo-top-nav-bar styles if not present
if '.fpo-top-nav-bar' not in css:
    fpo_nav_css = '''
/* ==========================================================================
   FPO Horizontal Top Navigation Bar
   ========================================================================== */
.fpo-top-nav-bar {
  background-color: var(--bg-surface, #FFFFFF);
  border-bottom: 1px solid var(--border-subtle, #E2E8F0);
  padding: 0.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  overflow-x: auto;
  position: sticky;
  top: 0;
  z-index: 30;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.fpo-top-nav-bar .nav-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary, #4B6354);
  text-decoration: none;
  padding: 0.45rem 0.9rem;
  border-radius: var(--radius-sm, 6px);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  transition: all 0.15s ease;
  line-height: 1.3;
}

.fpo-top-nav-bar .nav-link:hover {
  color: var(--primary-green, #1C5A35);
  background-color: var(--bg-surface-alt, #F1F6F2);
}

.fpo-top-nav-bar .nav-link.active {
  color: var(--primary-green, #1C5A35);
  font-weight: 700;
  background-color: var(--primary-green-light, rgba(28, 90, 53, 0.08));
  border-bottom: none;
}
'''
    css += '\n' + fpo_nav_css

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css)
with open('AgriMitra- FPO/style.css', 'w', encoding='utf-8') as f:
    f.write(css)
with open('fpo/style.css', 'w', encoding='utf-8') as f:
    f.write(css)
print("Updated and synced all 3 style.css files!")

# 2. Update fpo-bidding-status.html to use Nashik Farmers Collective
for p in ['fpo-bidding-status.html', 'AgriMitra- FPO/fpo-bidding-status.html', 'fpo/fpo-bidding-status.html']:
    with open(p, 'r', encoding='utf-8') as f:
        html = f.read()
    html = html.replace('Punjab Farmers FPO', 'Nashik Farmers Collective')
    html = html.replace('Punjab Farmers Producer Organization', 'Nashik Farmers Collective')
    html = html.replace('FPO #PB-LDH-104', 'FPO #MH-NSK-401 · Active')
    with open(p, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Updated organization name in {p}")

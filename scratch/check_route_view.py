import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

with open('delivery-dashboard.html', 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

# Let's see how views are controlled:
radios = re.findall(r'<input type="radio" name="app-view"[^>]*>', content)
print("Radio views:")
for r in radios:
    print(" ", r)

# Search for what changes when #view-route:checked
style_blocks = re.findall(r'<style\b[^>]*>(.*?)</style>', content, re.DOTALL | re.IGNORECASE)
print(f"Style blocks count: {len(style_blocks)}")
for s in style_blocks:
    for line in s.splitlines():
        if 'view-route' in line or 'route' in line and 'display' in line:
            print("  CSS:", line.strip())

# Also check linked stylesheets
css_links = re.findall(r'<link[^>]*rel=["\']stylesheet["\'][^>]*>', content)
for c in css_links:
    print("CSS link:", c)

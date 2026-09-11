import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('AgriMitra-Farmer/farmer/dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

overlays = re.findall(r'<div[^>]*class=["\'][^"\']*modal[^"\']*["\'][^>]*>', content)
print('Farmer modal overlays:', overlays)

btns = re.findall(r'<button[^>]*class=["\'][^"\']*(?:close|cancel)[^"\']*["\'][^>]*>.*?</button>', content, re.DOTALL)
for b in btns:
    print('Farmer close/cancel btn:', ' '.join(b.split()))

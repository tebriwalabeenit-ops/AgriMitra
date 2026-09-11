import sys, re
sys.stdout.reconfigure(encoding='utf-8')
with open('Agrimitra(wholesaler and distributer)/distributor-dashboard.html', 'r', encoding='utf-8') as f:
    text = f.read()

close_btns = re.findall(r'<button[^>]*class=["\'][^"\']*close[^"\']*["\'][^>]*>.*?</button>', text, re.I | re.DOTALL)
print(f'distributor-dashboard.html has {len(close_btns)} close buttons')
for b in close_btns[:5]:
    print('  ', ' '.join(b.split()))

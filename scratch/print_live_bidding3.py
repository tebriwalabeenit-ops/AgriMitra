import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('fpo-dashboard.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

idx = text.find('Bathinda Hub')
print(text[idx:idx+5000])

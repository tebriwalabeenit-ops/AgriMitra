import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('fpo-dashboard.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

idx = text.find('id="live-bidding"')
# Print next 8000 characters from idx+3000
print(text[idx+2500:idx+9000])

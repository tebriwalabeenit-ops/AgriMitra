import sys, re
sys.stdout.reconfigure(encoding='utf-8')
with open('buyer-dashboard.html', 'r', encoding='utf-8') as f:
    text = f.read()

for m in ['modal-location', 'modal-orders', 'modal-categories', 'modal-produce', 'modal-farmers', 'modal-bulk', 'modal-cart', 'modal-notifications', 'modal-profile']:
    idx = text.find(f'id="{m}"')
    chunk = text[idx:idx+2500]
    header_match = re.search(r'<div class="modal-window-header">(.*?)<div class="modal-window-body"', chunk, re.DOTALL)
    if header_match:
        print(f'*** {m} HEADER ***')
        print(header_match.group(1).strip())

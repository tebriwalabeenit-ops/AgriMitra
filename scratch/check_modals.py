with open('buyer-dashboard.html', 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f, 1):
        for m in ['modal-produce', 'modal-farmers', 'modal-bulk', 'modal-location', 'modal-categories', 'modal-orders', 'modal-profile', 'modal-notifications', 'modal-cart']:
            if f'id="{m}"' in line:
                print(f"Line {idx}: {line.strip()[:120]}")

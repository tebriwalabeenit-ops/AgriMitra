with open('buyer-dashboard.html', 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f, 1):
        if '<footer' in line or 'id="modal-' in line:
            print(f"Line {idx}: {line.strip()[:80]}")

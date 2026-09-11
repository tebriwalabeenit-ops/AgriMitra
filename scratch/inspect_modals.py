import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('buyer-dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

modals = re.findall(r'<div[^>]*id=["\'](modal-[^"\']+)["\'][^>]*>', content)
print('Modals found in buyer-dashboard.html:', modals)

for m in modals:
    start = content.find(f'id="{m}"')
    chunk = content[start:start+1500]
    print(f'=== MODAL {m} ===')
    for line in chunk.splitlines()[:25]:
        print('  ', line)

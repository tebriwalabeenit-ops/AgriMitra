import sys, re
sys.stdout.reconfigure(encoding='utf-8')

pages = [
    'fpo-dashboard.html',
    'AgriMitra- FPO/fpo-dashboard.html',
    'fpo-live-bidding.html',
    'AgriMitra- FPO/fpo-live-bidding.html',
    'fpo-bidding-status.html',
    'AgriMitra- FPO/fpo-bidding-status.html',
    'fpo-bidding-result.html',
    'AgriMitra- FPO/fpo-bidding-result.html',
    'create-live-bidding.html',
    'AgriMitra- FPO/create-live-bidding.html'
]

for page in pages:
    print(f"\n=================== Links in {page} ===================")
    try:
        with open(page, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        links = re.findall(r'<a[^>]*href=["\']([^"\']*)["\'][^>]*>(.*?)</a>', content, re.DOTALL)
        for href, text in links:
            clean_text = ' '.join(re.sub(r'<[^>]+>', '', text).split())[:40]
            print(f"  {clean_text:40} -> {href}")
    except Exception as e:
        print("Error:", e)

import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

files = [
    'fpo-dashboard.html',
    'AgriMitra- FPO/fpo-dashboard.html',
    'fpo/fpo-dashboard.html',
    'fpo-live-bidding.html',
    'AgriMitra- FPO/fpo-live-bidding.html',
    'fpo/fpo-live-bidding.html',
    'fpo-bidding-status.html',
    'AgriMitra- FPO/fpo-bidding-status.html',
    'fpo/fpo-bidding-status.html',
    'fpo-bidding-result.html',
    'AgriMitra- FPO/fpo-bidding-result.html',
    'fpo/fpo-bidding-result.html',
    'create-live-bidding.html',
    'AgriMitra- FPO/create-live-bidding.html',
    'fpo/create-live-bidding.html'
]

for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        html = f.read()
    scripts = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', html)
    css = re.findall(r'<link[^>]+href=["\']([^"\']+\.css)["\']', html)
    fonts = 'fonts.googleapis.com' in html
    has_trading_result = 'trading-result.html' in html
    has_wholesaler_flash = 'wholesaler-trading.html' in html
    print(f"{fpath:<40} | Fonts: {str(fonts):<5} | CSS: {css} | trading-result: {has_trading_result} | wholesaler-flash: {has_wholesaler_flash}")

import os
import re

rootDir = os.path.dirname(os.path.abspath(__file__))
passed = 0
failed = 0

def check(condition, message):
    global passed, failed
    if condition:
        print('[PASS] ' + message)
        passed += 1
    else:
        print('[FAIL] ' + message)
        failed += 1

print('=== 1. CHECKING INDEX.HTML LINKS ===')
with open(os.path.join(rootDir, 'index.html'), 'r', encoding='utf-8') as f:
    index_html = f.read()

hrefs = re.findall(r'href=["\']([^"\']+\.html)["\']', index_html)
for href in hrefs:
    target = os.path.normpath(os.path.join(rootDir, href))
    check(os.path.exists(target), f'index.html link "{href}" exists at {target}')

print('\n=== 2. CHECKING APP.JS ROUTES ===')
with open(os.path.join(rootDir, 'app.js'), 'r', encoding='utf-8') as f:
    app_js = f.read()

reg_match = re.search(r'const roleRegistrationRoutes = \{([\s\S]*?)\};', app_js)
check(bool(reg_match), 'roleRegistrationRoutes found in app.js')
if reg_match:
    for u in re.findall(r"'([^']+\.html)'", reg_match.group(1)):
        target = os.path.normpath(os.path.join(rootDir, u))
        check(os.path.exists(target), f'app.js registration route "{u}" exists')

dash_match = re.search(r'const roleDashboardRoutes = \{([\s\S]*?)\};', app_js)
check(bool(dash_match), 'roleDashboardRoutes found in app.js')
if dash_match:
    for u in re.findall(r"'([^']+\.html)'", dash_match.group(1)):
        target = os.path.normpath(os.path.join(rootDir, u))
        check(os.path.exists(target), f'app.js dashboard route "{u}" exists')

print('\n=== 3. CHECKING AGRI MITRA BUYER ===')
buyerDir = os.path.join(rootDir, 'AgriMitra-Buyer')
with open(os.path.join(buyerDir, 'buyer.html'), 'r', encoding='utf-8') as f:
    buyer_html = f.read()
check('href="../index.html"' in buyer_html, 'buyer.html header points to ../index.html')
check('action="buyer-dashboard.html"' in buyer_html, 'buyer.html form action is buyer-dashboard.html')
check("window.location.href = 'buyer-dashboard.html'" in buyer_html, 'buyer.html redirects to buyer-dashboard.html')
check(os.path.exists(os.path.join(buyerDir, 'buyer-dashboard.html')), 'buyer-dashboard.html exists in AgriMitra-Buyer')

print('\n=== 4. CHECKING AGRI MITRA DELIVERY AGENT ===')
deliveryDir = os.path.join(rootDir, 'AgriMitra-delivery agent')
with open(os.path.join(deliveryDir, 'delivery-agent.html'), 'r', encoding='utf-8') as f:
    delivery_html = f.read()
check('href="../index.html"' in delivery_html, 'delivery-agent.html header points to ../index.html')
check('action="index.html"' in delivery_html, 'delivery-agent.html form action is index.html')
check("window.location.href = 'index.html'" in delivery_html, 'delivery-agent.html redirects to index.html')
check(os.path.exists(os.path.join(deliveryDir, 'index.html')), 'index.html (dashboard) exists in AgriMitra-delivery agent')

print('\n=== 5. CHECKING AGRI MITRA FPO ===')
fpoDir = os.path.join(rootDir, 'AgriMitra- FPO')
with open(os.path.join(fpoDir, 'fpo-register.html'), 'r', encoding='utf-8') as f:
    fpo_html = f.read()
check('href="../index.html"' in fpo_html, 'fpo-register.html header points to ../index.html')
check('action="index.html"' in fpo_html, 'fpo-register.html form action is index.html')
check("window.location.href = 'index.html'" in fpo_html, 'fpo-register.html redirects to index.html')
check(os.path.exists(os.path.join(fpoDir, 'index.html')), 'index.html (dashboard) exists in AgriMitra- FPO')

print('\n=== 6. CHECKING ROOT FORWARDERS ===')
for rf in ['buyer.html', 'delivery-agent.html', 'fpo-register.html', 'buyer-dashboard.html']:
    check(os.path.exists(os.path.join(rootDir, rf)), f'Root forwarder {rf} exists')

print(f'\nTOTAL: {passed} PASSED, {failed} FAILED')
if failed > 0:
    exit(1)

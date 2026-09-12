import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('fpo-bidding-result.html', 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

# 1. Add Google Fonts
font_block = '''  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
'''
if 'fonts.googleapis.com' not in content:
    content = content.replace('<link rel="stylesheet" href="style.css">', font_block + '  <link rel="stylesheet" href="style.css">')

# 2. Fix CONFIRM FLASH SALE button
content = content.replace('href="wholesaler-trading.html#mandi-flash"', 'href="fpo-live-bidding.html?flash_sale=confirmed&lot=TRD-POT-311"')

# 3. Add script to handle hash switching between #sold and #nobids
hash_script = '''
  <script>
    function syncResultHash() {
      const hash = window.location.hash.toLowerCase();
      const radioSold = document.getElementById('state-sold');
      const radioNoBids = document.getElementById('state-nobids');
      if (hash.includes('nobid')) {
        if (radioNoBids) radioNoBids.checked = true;
      } else {
        if (radioSold) radioSold.checked = true;
      }
    }
    window.addEventListener('DOMContentLoaded', syncResultHash);
    window.addEventListener('hashchange', syncResultHash);
  </script>
'''

if 'syncResultHash' not in content:
    content = content.replace('</body>', hash_script + '\n</body>')

with open('fpo-bidding-result.html', 'w', encoding='utf-8') as f:
    f.write(content)
with open('AgriMitra- FPO/fpo-bidding-result.html', 'w', encoding='utf-8') as f:
    f.write(content)
with open('fpo/fpo-bidding-result.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated fpo-bidding-result.html across all locations!")

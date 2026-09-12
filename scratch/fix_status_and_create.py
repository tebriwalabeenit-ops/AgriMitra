import sys
sys.stdout.reconfigure(encoding='utf-8')

font_block = '''  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
'''

for base_fn in ['fpo-bidding-status.html', 'create-live-bidding.html']:
    for prefix in ['', 'AgriMitra- FPO/', 'fpo/']:
        fpath = prefix + base_fn
        with open(fpath, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        
        if 'fonts.googleapis.com' not in content:
            content = content.replace('<link rel="stylesheet" href="style.css">', font_block + '  <link rel="stylesheet" href="style.css">')
        
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {fpath} with Google Fonts!")

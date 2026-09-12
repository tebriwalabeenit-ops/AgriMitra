import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('fpo-live-bidding.html', 'r', encoding='utf-8', errors='replace') as f:
    lines = f.readlines()

# Check font
content = ''.join(lines)
font_block = '''  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
'''

if 'fonts.googleapis.com' not in content:
    content = content.replace('<link rel="stylesheet" href="style.css">', font_block + '  <link rel="stylesheet" href="style.css">')

# Split at line 492
lines = content.splitlines(keepends=True)
print("Total lines before:", len(lines))

# Find the end of second completed card (Fresh Potatoes no bids)
cut_start = -1
for i, l in enumerate(lines):
    if 'fpo-bidding-result.html#nobids' in l and i < 500:
        # find the closing </article> after this
        for j in range(i, i+15):
            if '</article>' in lines[j]:
                cut_start = j + 1
                break
        break

print("Cut start line:", cut_start)

# Find the end of duplicate completed section (around line 690)
cut_end = -1
for i in range(cut_start, len(lines)):
    if '</main>' in lines[i]:
        cut_end = i
        break

print("Cut end line (main):", cut_end)

new_lines = lines[:cut_start] + [
    '\n',
    '        </div>\n',
    '      </section>\n',
    '\n',
    '    </div>\n'
] + lines[cut_end:]

new_content = ''.join(new_lines)
with open('fpo-live-bidding.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated fpo-live-bidding.html, total lines:", len(new_lines))

# Also copy to AgriMitra- FPO/ and fpo/
with open('AgriMitra- FPO/fpo-live-bidding.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
with open('fpo/fpo-live-bidding.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Synced to AgriMitra- FPO/ and fpo/")

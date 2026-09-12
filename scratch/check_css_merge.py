import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('style.css', 'r', encoding='utf-8', errors='replace') as f:
    root_css = f.read()

with open('AgriMitra- FPO/style.css', 'r', encoding='utf-8', errors='replace') as f:
    fpo_css = f.read()

fpo_start = fpo_css.find('/* === FPO DASHBOARD LAYOUT STYLES === */')
print("FPO start index:", fpo_start)
if fpo_start != -1:
    fpo_addition = fpo_css[fpo_start:]
    print("Length of FPO addition:", len(fpo_addition))
    
    # Check if this addition is already in root_css
    if '/* === FPO DASHBOARD LAYOUT STYLES === */' in root_css:
        print("FPO styles already in root_css!")
    else:
        print("FPO styles NOT in root_css. Appending will give full styles.")
        new_root_css = root_css + "\n\n" + fpo_addition
        with open('style.css', 'w', encoding='utf-8') as out_f:
            out_f.write(new_root_css)
        print("Updated root style.css successfully! New length:", len(new_root_css))
        
        # Also sync to AgriMitra- FPO/style.css and fpo/style.css
        with open('AgriMitra- FPO/style.css', 'w', encoding='utf-8') as out_f:
            out_f.write(new_root_css)
        with open('fpo/style.css', 'w', encoding='utf-8') as out_f:
            out_f.write(new_root_css)
        print("Synced to AgriMitra- FPO/style.css and fpo/style.css")

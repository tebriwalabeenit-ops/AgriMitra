for p in ['AgriMitra- FPO/fpo-dashboard.html', 'fpo/fpo-dashboard.html']:
    with open(p, 'r', encoding='utf-8') as f:
        html = f.read()
    html = html.replace('<link rel="stylesheet" href="style.css">\n  <link rel="stylesheet" href="style.css">', '<link rel="stylesheet" href="style.css">')
    with open(p, 'w', encoding='utf-8') as f:
        f.write(html)
print("Cleaned duplicate stylesheet links!")

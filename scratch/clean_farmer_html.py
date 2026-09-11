with open('AgriMitra-Farmer/farmer/dashboard.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(r"this.closest(\'.produce-modal-overlay\').classList.remove(\'active\');", "this.closest('.produce-modal-overlay').classList.remove('active');")

with open('AgriMitra-Farmer/farmer/dashboard.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Cleaned escaped quotes in dashboard.html')

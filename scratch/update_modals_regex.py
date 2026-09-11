import re

with open('buyer-dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update backdrop links
content = re.sub(
    r'<a\s+href="#"\s+class="modal-backdrop-close"[^>]*></a>',
    r'<a href="#!" class="modal-backdrop-close" onclick="window.closeBuyerModal()" aria-label="Close popup"></a>',
    content
)

# 2. Update modal headers that don't already have btn-return-dashboard
def header_replacer(match):
    header_content = match.group(0)
    if 'btn-return-dashboard' in header_content:
        return header_content
    
    # Replace the close link with return-to-dashboard and button
    subbed = re.sub(
        r'<a\s+href="#"\s+class="modal-window-close"[^>]*>&times;</a>',
        r'''<div style="display:flex; align-items:center; gap:8px;">
          <button type="button" class="btn-return-dashboard" onclick="window.closeBuyerModal()">← Back to Dashboard</button>
          <button type="button" class="modal-window-close" onclick="window.closeBuyerModal()" aria-label="Close popup">&times;</button>
        </div>''',
        header_content
    )
    return subbed

content = re.sub(
    r'<div class="modal-window-header">.*?</div>',
    header_replacer,
    content,
    flags=re.DOTALL
)

# 3. Update modal footers
# Cart modal footer
cart_footer_old = r'<div class="modal-window-footer">\s*<a\s+href="#"\s+class="btn btn-secondary"[^>]*>Keep Shopping</a>\s*<a\s+href="#modal-orders"\s+class="btn btn-primary"[^>]*>Proceed to Checkout[^<]*</a>\s*</div>'
cart_footer_new = """<div class="modal-window-footer">
        <button type="button" class="btn btn-secondary btn-return-dashboard" onclick="window.closeBuyerModal()">← Continue Shopping / Back to Dashboard</button>
        <button type="button" class="btn btn-primary btn-checkout">Proceed to Checkout</button>
      </div>"""
content = re.sub(cart_footer_old, cart_footer_new, content)

# Generic close buttons in other footers
content = re.sub(
    r'<a\s+href="#"\s+class="btn btn-secondary"[^>]*>(Close|Close Window|Close Directory|Cancel|Dismiss All)</a>',
    r'<button type="button" class="btn btn-secondary btn-return-dashboard" onclick="window.closeBuyerModal()">← Back to Dashboard</button>',
    content
)

# Orders modal footer
orders_footer_old = r'(id="modal-orders".*?<div class="modal-window-footer">\s*)<a\s+href="#"\s+class="btn btn-secondary"[^>]*>.*?</a>(\s*</div>)'
content = re.sub(
    orders_footer_old,
    r'\1<button type="button" class="btn btn-primary btn-return-dashboard" onclick="window.closeBuyerModal()">← Back to Dashboard / Continue Shopping</button>\2',
    content,
    flags=re.DOTALL
)

with open('buyer-dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)

# Mirror to AgriMitra-Buyer/buyer-dashboard.html
with open('AgriMitra-Buyer/buyer-dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Modals regex update completed.")

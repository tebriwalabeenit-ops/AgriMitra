import re

with open('buyer-dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace backdrop close
content_new = re.sub(
    r'<a href="#!?" class="modal-backdrop-close"[^>]*>',
    r'<a href="#!" class="modal-backdrop-close" onclick="window.closeBuyerModal(event)" aria-label="Close popup">',
    content
)

# Replace header return buttons
content_new = re.sub(
    r'<(?:button|a)[^>]*class="btn-return-dashboard"[^>]*>← Back to Dashboard<\/(?:button|a)>',
    r'<a href="#!" class="btn-return-dashboard" onclick="window.closeBuyerModal(event)">← Back to Dashboard</a>',
    content_new
)

# Replace modal-window-close buttons
content_new = re.sub(
    r'<(?:button|a)[^>]*class="modal-window-close"[^>]*>.*?</(?:button|a)>',
    r'<a href="#!" class="modal-window-close" onclick="window.closeBuyerModal(event)" aria-label="Close popup">✕</a>',
    content_new
)

# Replace footer return buttons
content_new = re.sub(
    r'<(?:button|a)[^>]*class="btn btn-secondary btn-return-dashboard"[^>]*>.*?</(?:button|a)>',
    r'<a href="#!" class="btn btn-secondary btn-return-dashboard" onclick="window.closeBuyerModal(event)">← Back to Dashboard</a>',
    content_new
)

content_new = re.sub(
    r'<(?:button|a)[^>]*class="btn btn-primary btn-return-dashboard"[^>]*>.*?</(?:button|a)>',
    r'<a href="#!" class="btn btn-primary btn-return-dashboard" onclick="window.closeBuyerModal(event)">← Back to Dashboard / Continue Shopping</a>',
    content_new
)

# Check differences
print("Replacements done.")
print("Occurrences of modal-window-close:", content_new.count('class="modal-window-close"'))
print("Occurrences of modal-backdrop-close:", content_new.count('class="modal-backdrop-close"'))
print("Occurrences of btn-return-dashboard:", content_new.count('class="btn-return-dashboard"'))

with open('buyer-dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content_new)

print("Saved updated buyer-dashboard.html")

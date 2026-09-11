import re

with open('AgriMitra-Farmer/farmer/dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add inline onclick to close buttons
content_new = re.sub(
    r'<button type="button" class="btn-close-modal" id="([^"]+)" aria-label="Close modal">',
    r'<button type="button" class="btn-close-modal" id="\1" aria-label="Close modal" onclick="this.closest(\'.produce-modal-overlay\').classList.remove(\'active\');">',
    content
)

# Add inline onclick to cancel buttons
content_new = re.sub(
    r'<button type="button" class="btn btn-secondary" id="(cancel-[^"]+|close-crop-bids-btn)">',
    r'<button type="button" class="btn btn-secondary" id="\1" onclick="this.closest(\'.produce-modal-overlay\').classList.remove(\'active\');">',
    content_new
)

with open('AgriMitra-Farmer/farmer/dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content_new)

print("Updated AgriMitra-Farmer/farmer/dashboard.html successfully.")

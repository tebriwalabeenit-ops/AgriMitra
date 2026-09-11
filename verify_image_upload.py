import urllib.request
import json
import base64
import os

urls = [
    'http://127.0.0.1:5000/create-live-bidding.html',
    'http://127.0.0.1:5000/fpo-live-bidding.html',
    'http://127.0.0.1:5000/fpo-bidding-status.html',
    'http://127.0.0.1:5000/assets/frontend_api.js'
]

print("=== CHECKING SERVED STATIC ASSETS AND HTML ===")
for u in urls:
    req = urllib.request.urlopen(u)
    content = req.read().decode('utf-8')
    print(f"Checked {u}: Status {req.status}, Length {len(content)}")
    if 'create-live-bidding' in u:
        assert 'bidding-product-image' in content, "Missing bidding-product-image input"
        assert 'image-upload-dropzone' in content, "Missing dropzone"
        assert 'Choose Photo from Device' in content, "Missing trigger button"
        assert 'accept="image/*"' in content, "Missing accept image"
        print("  -> Verified all image upload HTML elements in create-live-bidding.html!")
    if 'frontend_api.js' in u:
        assert 'bidding-product-image' in content, "Missing file input handler in frontend_api.js"
        assert 'handleSelectedFile' in content, "Missing handleSelectedFile in frontend_api.js"
        assert 'image_data' in content, "Missing image_data attachment in frontend_api.js"
        print("  -> Verified image upload handlers and payload wiring in frontend_api.js!")

print("\n=== TESTING FULL FPO AUCTION CREATION WITH DEVICE IMAGE ===")
tiny_png = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
b64_image = 'data:image/png;base64,' + base64.b64encode(tiny_png).decode('ascii')

payload = {
    "product_name": "Premium Basmati Rice",
    "category": "grains",
    "description": "Export quality 1121 steam basmati rice with farm lot photograph.",
    "quality_grade": "A",
    "quality_specs": "Average grain length 8.35mm, Moisture 11.2%",
    "quantity": 10000.0,
    "unit": "kg",
    "starting_price": 68.0,
    "min_increment": 1.00,
    "schedule_date": "2026-09-18",
    "schedule_start": "14:00",
    "schedule_end": "15:30",
    "image_data": b64_image
}

post_req = urllib.request.Request(
    'http://127.0.0.1:5000/api/fpo/auctions',
    data=json.dumps(payload).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

with urllib.request.urlopen(post_req) as resp:
    data = json.loads(resp.read().decode('utf-8'))
    print("Auction creation response HTTP status:", resp.status)
    print("Auction creation response:", data)
    assert data.get('success') is True
    saved_img = data.get('auction', {}).get('image_url')
    print("Saved image URL:", saved_img)
    assert saved_img and saved_img.startswith('assets/uploads/produce_')
    assert os.path.exists(saved_img)
    print(f"Verified image file exists on disk: {saved_img} (Size: {os.path.getsize(saved_img)} bytes)")

# Test fetching image via HTTP
img_req = urllib.request.urlopen(f'http://127.0.0.1:5000/{saved_img}')
assert img_req.status == 200
img_bytes = img_req.read()
assert len(img_bytes) == len(tiny_png)
print(f"Verified image is served over HTTP with 200 OK ({len(img_bytes)} bytes)")

print("\nALL SYSTEM VERIFICATIONS PASSED SUCCESSFULLY!")

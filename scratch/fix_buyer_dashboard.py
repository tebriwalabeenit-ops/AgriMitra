with open('buyer-dashboard.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Find the first </footer>
pos = text.find('</footer>')
if pos != -1:
    clean_text = text[:pos + len('</footer>')] + """

  <!-- AgriMitra Multi-Language Support Engine -->
  <script src="i18n.js"></script>
  <script src="assets/auth-guard.js"></script>
  <script src="assets/buyer-marketplace.js"></script>
</body>
</html>
"""
    with open('buyer-dashboard.html', 'w', encoding='utf-8') as f:
        f.write(clean_text)
    print("Cleaned buyer-dashboard.html successfully.")
else:
    print("</footer> not found!")

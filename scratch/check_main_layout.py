import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

with open('fpo-dashboard.html', 'r', encoding='utf-8') as f:
    html = f.read()

# find all top-level elements inside <main class="dashboard-content" id="dashboardMain">
main_m = re.search(r'<main class="dashboard-content"[^>]*>(.*?)</main>', html, re.DOTALL)
if main_m:
    main_body = main_m.group(1)
    # find top level tags
    top_tags = re.findall(r'<(?:section|div)\b[^>]*id=["\']([^"\']+)["\'][^>]*>', main_body)
    print("Main elements with IDs:")
    for t in top_tags:
        print(" ", t)

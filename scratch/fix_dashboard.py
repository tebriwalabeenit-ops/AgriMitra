import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

with open('fpo-dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace trading-result.html#sold with fpo-bidding-status.html
print("Replacing trading-result.html#sold occurrences...")
print("Found before:", content.count('trading-result.html#sold'))
content = content.replace('href="trading-result.html#sold"', 'href="fpo-bidding-status.html"')

# 2. Add anchor IDs to sections for direct linking:
# produceSection -> id="produceSection" id="produce"
# Let's ensure <div id="overview" ...> is at top of main
if 'id="overview"' not in content:
    content = content.replace('<main class="dashboard-content" id="dashboardMain">',
                              '<main class="dashboard-content" id="dashboardMain">\n        <div id="overview" style="position: relative; top: -80px;"></div>')

if '<div id="produce"' not in content:
    content = content.replace('<section class="content-card" id="produceSection">',
                              '<div id="produce" style="position: relative; top: -80px;"></div>\n        <section class="content-card" id="produceSection">')

if '<div id="orders"' not in content:
    content = content.replace('<section class="content-card" id="ordersSection">',
                              '<div id="orders" style="position: relative; top: -80px;"></div>\n        <section class="content-card" id="ordersSection">')

if '<div id="farmers"' not in content:
    content = content.replace('<section class="content-card" id="farmerActivitySection">',
                              '<div id="farmers" style="position: relative; top: -80px;"></div>\n        <section class="content-card" id="farmerActivitySection">')

if '<div id="buyers"' not in content:
    content = content.replace('<section class="content-card" id="demandSection">',
                              '<div id="buyers" style="position: relative; top: -80px;"></div>\n        <section class="content-card" id="demandSection">')

if '<div id="payments"' not in content:
    content = content.replace('<section class="content-card" id="paymentsSection">',
                              '<div id="payments" style="position: relative; top: -80px;"></div>\n        <section class="content-card" id="paymentsSection">')

# 3. Ensure stylesheet in fpo-dashboard.html at root uses style.css
# In root: <link rel="stylesheet" href="style.css"> is sufficient since style.css has all merged styles!
# But let's check <link rel="stylesheet" href="AgriMitra- FPO/style.css">
# We can keep it or replace it with <link rel="stylesheet" href="style.css">

with open('fpo-dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated root fpo-dashboard.html successfully!")

# Now handle AgriMitra- FPO/fpo-dashboard.html
with open('AgriMitra- FPO/fpo-dashboard.html', 'r', encoding='utf-8') as f:
    fpo_dash = f.read()

fpo_dash = fpo_dash.replace('href="trading-result.html#sold"', 'href="fpo-bidding-status.html"')
# Fix 404 paths in subfolder:
fpo_dash = fpo_dash.replace('<link rel="stylesheet" href="AgriMitra- FPO/style.css">', '<link rel="stylesheet" href="style.css">')
fpo_dash = fpo_dash.replace('<script src="AgriMitra- FPO/app.js"></script>', '<script src="app.js"></script>')

# Add anchors
if 'id="overview"' not in fpo_dash:
    fpo_dash = fpo_dash.replace('<main class="dashboard-content" id="dashboardMain">',
                                '<main class="dashboard-content" id="dashboardMain">\n        <div id="overview" style="position: relative; top: -80px;"></div>')
if '<div id="produce"' not in fpo_dash:
    fpo_dash = fpo_dash.replace('<section class="content-card" id="produceSection">',
                                '<div id="produce" style="position: relative; top: -80px;"></div>\n        <section class="content-card" id="produceSection">')
if '<div id="orders"' not in fpo_dash:
    fpo_dash = fpo_dash.replace('<section class="content-card" id="ordersSection">',
                                '<div id="orders" style="position: relative; top: -80px;"></div>\n        <section class="content-card" id="ordersSection">')
if '<div id="farmers"' not in fpo_dash:
    fpo_dash = fpo_dash.replace('<section class="content-card" id="farmerActivitySection">',
                                '<div id="farmers" style="position: relative; top: -80px;"></div>\n        <section class="content-card" id="farmerActivitySection">')
if '<div id="buyers"' not in fpo_dash:
    fpo_dash = fpo_dash.replace('<section class="content-card" id="demandSection">',
                                '<div id="buyers" style="position: relative; top: -80px;"></div>\n        <section class="content-card" id="demandSection">')
if '<div id="payments"' not in fpo_dash:
    fpo_dash = fpo_dash.replace('<section class="content-card" id="paymentsSection">',
                                '<div id="payments" style="position: relative; top: -80px;"></div>\n        <section class="content-card" id="paymentsSection">')

with open('AgriMitra- FPO/fpo-dashboard.html', 'w', encoding='utf-8') as f:
    f.write(fpo_dash)
print("Updated AgriMitra- FPO/fpo-dashboard.html successfully!")

with open('fpo/fpo-dashboard.html', 'w', encoding='utf-8') as f:
    f.write(fpo_dash)
print("Updated fpo/fpo-dashboard.html successfully!")

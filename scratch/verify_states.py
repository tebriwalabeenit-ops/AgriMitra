import re
import ast

with open(r'AgriMitra-Farmer/farmer/register.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract select options
select_match = re.search(r'<select id="reg-state-select"[^>]*>(.*?)</select>', html, re.DOTALL)
if not select_match:
    print('ERROR: reg-state-select not found in register.html')
    exit(1)

state_options = re.findall(r'<option value="([^"]+)"', select_match.group(1))
states_in_html = [s for s in state_options if s and not s.startswith('--')]
print(f'Total states/UTs in register.html select: {len(states_in_html)}')

with open(r'AgriMitra-Farmer/farmer/js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

s_idx = js.find('const stateDistricts = {')
e_idx = js.find('};', s_idx)
dict_str = js[s_idx + len('const stateDistricts = '):e_idx + 1]

state_districts = ast.literal_eval(dict_str)
print(f'Total states/UTs in main.js stateDistricts: {len(state_districts)}')

diff_html_js = set(states_in_html) - set(state_districts.keys())
diff_js_html = set(state_districts.keys()) - set(states_in_html)

print('In HTML but not in JS:', diff_html_js)
print('In JS but not in HTML:', diff_js_html)

empty_districts = [k for k, v in state_districts.items() if len(v) == 0]
print('States with 0 districts:', empty_districts)

total_districts = sum(len(v) for v in state_districts.values())
print(f'Total districts mapped: {total_districts}')

# Test syntax of whole main.js with Node
import subprocess
try:
    res = subprocess.run(['node', '-c', r'AgriMitra-Farmer/farmer/js/main.js'], capture_output=True, text=True)
    if res.returncode == 0:
        print('Node JS syntax check: PASSED! (0 errors)')
    else:
        print('Node JS syntax check failed:', res.stderr)
except Exception as e:
    print('Node not available or skipped:', e)

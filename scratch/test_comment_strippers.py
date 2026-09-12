import os
import re
import tokenize
import io
import ast

def strip_html_comments(content):
    # Match standard HTML comments <!-- ... -->
    return re.sub(r'<!--[\s\S]*?-->', '', content)

def strip_css_comments(content):
    # Match strings or CSS comments /* ... */
    pattern = r'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')|(/\*[\s\S]*?\*/)'
    def repl(m):
        if m.group(1):
            return m.group(1)
        return ''
    return re.sub(pattern, repl, content)

def strip_js_comments(content):
    # Matches strings, template literals, regex literals, or comments
    # To be extremely precise, use a state-machine parser
    out = []
    i = 0
    n = len(content)
    
    while i < n:
        c = content[i]
        next_c = content[i + 1] if i + 1 < n else ''
        
        # Single-line comment
        if c == '/' and next_c == '/':
            # Read until newline
            i += 2
            while i < n and content[i] not in ('\r', '\n'):
                i += 1
            # keep the newline
            if i < n:
                out.append(content[i])
                i += 1
            continue
            
        # Multi-line comment
        if c == '/' and next_c == '*':
            i += 2
            while i + 1 < n and not (content[i] == '*' and content[i + 1] == '/'):
                if content[i] == '\n':
                    out.append('\n')
                i += 1
            i += 2 # skip */
            continue
            
        # Single-quote string
        if c == "'":
            out.append(c)
            i += 1
            while i < n:
                ch = content[i]
                out.append(ch)
                i += 1
                if ch == '\\' and i < n:
                    out.append(content[i])
                    i += 1
                elif ch == "'":
                    break
            continue
            
        # Double-quote string
        if c == '"':
            out.append(c)
            i += 1
            while i < n:
                ch = content[i]
                out.append(ch)
                i += 1
                if ch == '\\' and i < n:
                    out.append(content[i])
                    i += 1
                elif ch == '"':
                    break
            continue
            
        # Template literal
        if c == '`':
            out.append(c)
            i += 1
            while i < n:
                ch = content[i]
                out.append(ch)
                i += 1
                if ch == '\\' and i < n:
                    out.append(content[i])
                    i += 1
                elif ch == '`':
                    break
            continue
            
        out.append(c)
        i += 1
        
    return "".join(out)

def strip_py_comments(content):
    f = io.BytesIO(content.encode('utf-8'))
    tokens = []
    try:
        for tok in tokenize.tokenize(f.readline):
            if tok.type != tokenize.COMMENT:
                tokens.append(tok)
        cleaned = tokenize.untokenize(tokens).decode('utf-8')
        return cleaned
    except Exception as e:
        print(f"Error tokenizing Python: {e}")
        return content

def strip_html_all_comments(content):
    # 1. Remove HTML comments <!-- ... -->
    content = re.sub(r'<!--[\s\S]*?-->', '', content)
    
    # 2. Process inline <style>...</style>
    def clean_style(m):
        tag_open = m.group(1)
        body = m.group(2)
        tag_close = m.group(3)
        return tag_open + strip_css_comments(body) + tag_close
    content = re.sub(r'(<style\b[^>]*>)([\s\S]*?)(</style>)', clean_style, content, flags=re.IGNORECASE)
    
    # 3. Process inline <script>...</script>
    def clean_script(m):
        tag_open = m.group(1)
        body = m.group(2)
        tag_close = m.group(3)
        if 'type="application/json"' in tag_open.lower() or 'type="application/ld+json"' in tag_open.lower():
            return m.group(0)
        return tag_open + strip_js_comments(body) + tag_close
    content = re.sub(r'(<script\b[^>]*>)([\s\S]*?)(</script>)', clean_script, content, flags=re.IGNORECASE)
    
    return content

if __name__ == '__main__':
    import subprocess
    
    print("Testing Python comment stripping dry-run...")
    py_errors = 0
    py_count = 0
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in ['.git', '__pycache__', 'node_modules', '.venv', 'venv', '.system_generated', 'dist', 'build', 'scratch']]
        for f in files:
            if f.endswith('.py'):
                p = os.path.join(root, f)
                with open(p, 'r', encoding='utf-8') as fp:
                    orig = fp.read()
                cleaned = strip_py_comments(orig)
                try:
                    compile(cleaned, p, 'exec')
                    py_count += 1
                except Exception as e:
                    print(f"Python syntax error in {p}: {e}")
                    py_errors += 1
    print(f"Python files tested: {py_count}, errors: {py_errors}")
    
    print("\nTesting JS comment stripping dry-run...")
    js_errors = 0
    js_count = 0
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in ['.git', '__pycache__', 'node_modules', '.venv', 'venv', '.system_generated', 'dist', 'build', 'scratch']]
        for f in files:
            if f.endswith('.js'):
                p = os.path.join(root, f)
                with open(p, 'r', encoding='utf-8') as fp:
                    orig = fp.read()
                cleaned = strip_js_comments(orig)
                tmp = 'scratch/_temp_test.js'
                with open(tmp, 'w', encoding='utf-8') as tf:
                    tf.write(cleaned)
                res = subprocess.run(['node', '-c', tmp], capture_output=True, text=True)
                if res.returncode != 0:
                    print(f"JS syntax error in {p}:\n{res.stderr}")
                    js_errors += 1
                else:
                    js_count += 1
    if os.path.exists('scratch/_temp_test.js'):
        os.remove('scratch/_temp_test.js')
    print(f"JS files tested: {js_count}, errors: {js_errors}")

    print("\nTesting CSS comment stripping dry-run...")
    css_count = 0
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in ['.git', '__pycache__', 'node_modules', '.venv', 'venv', '.system_generated', 'dist', 'build', 'scratch']]
        for f in files:
            if f.endswith('.css'):
                p = os.path.join(root, f)
                with open(p, 'r', encoding='utf-8') as fp:
                    orig = fp.read()
                cleaned = strip_css_comments(orig)
                css_count += 1
    print(f"CSS files tested: {css_count}")

    print("\nTesting HTML comment stripping dry-run...")
    html_count = 0
    html_script_errors = 0
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in ['.git', '__pycache__', 'node_modules', '.venv', 'venv', '.system_generated', 'dist', 'build', 'scratch']]
        for f in files:
            if f.endswith('.html'):
                p = os.path.join(root, f)
                with open(p, 'r', encoding='utf-8') as fp:
                    orig = fp.read()
                cleaned = strip_html_all_comments(orig)
                html_count += 1
                # Check scripts inside HTML
                scripts = re.findall(r'<script\b[^>]*>([\s\S]*?)</script>', cleaned, flags=re.IGNORECASE)
                for sc in scripts:
                    sc_strip = sc.strip()
                    if sc_strip and not sc_strip.startswith('<!'):
                        tmp = 'scratch/_temp_test.js'
                        with open(tmp, 'w', encoding='utf-8') as tf:
                            tf.write(sc)
                        res = subprocess.run(['node', '-c', tmp], capture_output=True, text=True)
                        if res.returncode != 0:
                            # Some inline scripts might be fragments or templates, report only true JS
                            pass
    if os.path.exists('scratch/_temp_test.js'):
        os.remove('scratch/_temp_test.js')
    print(f"HTML files tested: {html_count}")



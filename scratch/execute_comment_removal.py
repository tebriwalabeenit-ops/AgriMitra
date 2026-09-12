import os
import re
import tokenize
import io
import subprocess

def clean_whitespace(text):
    lines = [line.rstrip() for line in text.splitlines()]
    res = "\n".join(lines)
    # Collapse 3 or more newlines into max 2
    res = re.sub(r'\n{3,}', '\n\n', res)
    if res and not res.endswith('\n'):
        res += '\n'
    return res

def strip_css_comments(content):
    pattern = r'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')|(/\*[\s\S]*?\*/)'
    def repl(m):
        if m.group(1):
            return m.group(1)
        return ''
    cleaned = re.sub(pattern, repl, content)
    return clean_whitespace(cleaned)

def strip_js_comments(content):
    out = []
    i = 0
    n = len(content)
    
    while i < n:
        c = content[i]
        next_c = content[i + 1] if i + 1 < n else ''
        
        # Single-line comment
        if c == '/' and next_c == '/':
            i += 2
            while i < n and content[i] not in ('\r', '\n'):
                i += 1
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
            i += 2
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
        
    return clean_whitespace("".join(out))

def strip_html_all_comments(content):
    # 1. Strip HTML comments <!-- ... -->
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
    
    return clean_whitespace(content)

def strip_py_comments(content):
    f = io.BytesIO(content.encode('utf-8'))
    tokens = []
    try:
        for tok in tokenize.tokenize(f.readline):
            if tok.type != tokenize.COMMENT:
                tokens.append(tok)
        cleaned = tokenize.untokenize(tokens).decode('utf-8')
        return clean_whitespace(cleaned)
    except Exception as e:
        print(f"Error tokenizing Python: {e}")
        return content

def process_repository():
    html_files = []
    css_files = []
    js_files = []
    py_files = []
    
    exclude_dirs = {'.git', '__pycache__', 'node_modules', '.venv', 'venv', '.system_generated', 'dist', 'build', 'scratch', '.gemini'}
    
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for f in files:
            path = os.path.join(root, f)
            if f.endswith('.html'):
                html_files.append(path)
            elif f.endswith('.css'):
                css_files.append(path)
            elif f.endswith('.js'):
                js_files.append(path)
            elif f.endswith('.py'):
                py_files.append(path)
                
    print(f"Discovered: {len(html_files)} HTML, {len(css_files)} CSS, {len(js_files)} JS, {len(py_files)} Python files.")
    
    # 1. Process HTML
    print("\nProcessing HTML files...")
    for path in html_files:
        with open(path, 'r', encoding='utf-8') as f:
            orig = f.read()
        cleaned = strip_html_all_comments(orig)
        if cleaned != orig:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(cleaned)
            print(f"  [CLEANED] {path}")
        else:
            print(f"  [UNCHANGED] {path}")
            
    # 2. Process CSS
    print("\nProcessing CSS files...")
    for path in css_files:
        with open(path, 'r', encoding='utf-8') as f:
            orig = f.read()
        cleaned = strip_css_comments(orig)
        if cleaned != orig:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(cleaned)
            print(f"  [CLEANED] {path}")
        else:
            print(f"  [UNCHANGED] {path}")
            
    # 3. Process JS
    print("\nProcessing JS files...")
    js_errors = 0
    for path in js_files:
        with open(path, 'r', encoding='utf-8') as f:
            orig = f.read()
        cleaned = strip_js_comments(orig)
        if cleaned != orig:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(cleaned)
            # Verify with node -c
            res = subprocess.run(['node', '-c', path], capture_output=True, text=True)
            if res.returncode != 0:
                print(f"  [ERROR] {path} failed node syntax check:\n{res.stderr}")
                js_errors += 1
            else:
                print(f"  [CLEANED & VERIFIED] {path}")
        else:
            print(f"  [UNCHANGED] {path}")
            
    # 4. Process Python
    print("\nProcessing Python files...")
    py_errors = 0
    for path in py_files:
        with open(path, 'r', encoding='utf-8') as f:
            orig = f.read()
        cleaned = strip_py_comments(orig)
        if cleaned != orig:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(cleaned)
            # Verify compilation
            try:
                compile(cleaned, path, 'exec')
                print(f"  [CLEANED & VERIFIED] {path}")
            except Exception as e:
                print(f"  [ERROR] {path} failed python compile: {e}")
                py_errors += 1
        else:
            print(f"  [UNCHANGED] {path}")
            
    print(f"\nCompleted! JS errors: {js_errors}, Python errors: {py_errors}")
    return js_errors == 0 and py_errors == 0

if __name__ == '__main__':
    success = process_repository()
    if not success:
        exit(1)

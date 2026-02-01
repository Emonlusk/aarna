
import re

try:
    with open('backend/.env', 'r') as f:
        content = f.read()
    
    # regex for Google API Key (approximate)
    match = re.search(r'(AIza[0-9A-Za-z\-_]{35})', content)
    if match:
        print(f"FOUND_KEY: {match.group(1)}")
    else:
        # Try looser match if strict fails
        match_loose = re.search(r'(Iza[0-9A-Za-z\-_]+)', content)
        if match_loose:
             print(f"FOUND_LOOSE_KEY: {match_loose.group(1)}")
        else:
            print("NO_KEY_FOUND")
            print("CONTENT_DEBUG:", repr(content))

except Exception as e:
    print(f"ERROR: {e}")

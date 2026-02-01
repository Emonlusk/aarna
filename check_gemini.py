
import os
import requests
from dotenv import load_dotenv

load_dotenv('backend/.env')

API_KEY = os.environ.get('GOOGLE_API_KEY')

models_to_test = ["gemini-1.5-flash", "gemini-pro"]

for model in models_to_test:
    print(f"\nTesting {model}...")
    URL = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    
    payload = {
        "contents": [{
            "parts": [{"text": "Hello"}]
        }]
    }
    
    try:
        response = requests.post(f"{URL}?key={API_KEY}", json=payload)
        if response.status_code == 200:
            print(f"SUCCESS with {model}!")
            print(response.json()['candidates'][0]['content']['parts'][0]['text'])
            break
        else:
            print(f"FAILED {model}: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Error: {e}")

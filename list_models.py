
import os
import requests
from dotenv import load_dotenv

load_dotenv('backend/.env')
API_KEY = os.environ.get('GOOGLE_API_KEY')

# List models
URL = "https://generativelanguage.googleapis.com/v1beta/models"
try:
    response = requests.get(f"{URL}?key={API_KEY}")
    if response.status_code == 200:
        models = response.json().get('models', [])
        print("Available models:")
        for m in models:
            if 'generateContent' in m['supportedGenerationMethods']:
                print(m['name'])
    else:
        print(f"Failed to list models: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"Error: {e}")

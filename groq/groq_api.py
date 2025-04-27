import requests
import os

def get_groq_response(message, model="llama3-8b-8192"):
    GROQ_API_KEY = os.getenv("GROQ_API_KEY") or "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"
    GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": f"You are a helpful AI assistant."},
            {"role": "user", "content": message}
        ]
    }
    try:
        response = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=30)
        data = response.json()
        return data['choices'][0]['message']['content']
    except Exception as e:
        return f"Error: {str(e)}"

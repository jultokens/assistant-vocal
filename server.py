# -*- coding: utf-8 -*-
from flask import Flask, request, jsonify
import requests
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Remplace ceci par ta vraie clé OpenRouter
OPENROUTER_API_KEY = os.environ.get("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", "ta_clé_ici")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message", "")
    
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "openrouter/codellama-13b-chat",  # ou un autre modèle
        "messages": [
            {"role": "user", "content": user_message}
        ]
    }

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers=headers,
        json=payload
    )

    return jsonify(response.json())

if __name__ == "__main__":
    app.run(port=5001)

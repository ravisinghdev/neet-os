import requests
from config import GROQ_API_KEY

def enrich_with_ai(questions):
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    for q in questions:
        try:
            prompt = f"""You are an expert NEET teacher. Given the MCQ, provide:
1. The most likely correct answer
2. A short explanation (1-2 lines)
3. A confidence score (0–100)

Question: {q['question']}
Options: {q['options']}

Reply like:
ANSWER: <option>
EXPLANATION: <text>
CONFIDENCE: <score>
"""

            payload = {
                "model": "llama3-8b-8192",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.4
            }

            res = requests.post(url, json=payload, headers=headers, timeout=20)
            reply = res.json()["choices"][0]["message"]["content"]
            for line in reply.splitlines():
                if line.startswith("ANSWER:"):
                    answer = line.replace("ANSWER:", "").strip()
                    if answer in ["A", "B", "C", "D"]:
                        q["answer_index"] = ["A", "B", "C", "D"].index(answer)
                elif line.startswith("EXPLANATION:"):
                    q["explanation"] = line.replace("EXPLANATION:", "").strip()
                elif line.startswith("CONFIDENCE:"):
                    q["confidence"] = int(line.replace("CONFIDENCE:", "").strip())
        except:
            q["explanation"] = "AI explanation unavailable."
            q["confidence"] = 0

    return questions

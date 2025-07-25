import re
from datetime import datetime
from config import DEFAULT_SUBJECT, DEFAULT_CHAPTER, DEFAULT_DPP

def parse_questions_from_text(text: str, source: str = ""):
    raw_blocks = re.split(r"\n\s*\d{1,2}\.\s+", text)
    questions = []

    for block in raw_blocks:
        block = block.strip()
        if not block or "(a)" not in block.lower():
            continue

        try:
            q_text = re.split(r"\([a-dA-D]\)", block)[0].strip()
            options = re.findall(r"\([a-dA-D]\)\s*(.*?)(?=\([a-dA-D]\)|$)", block)
            questions.append({
                "question": q_text,
                "options": options,
                "answer_index": 0,
                "explanation": "",
                "subject": DEFAULT_SUBJECT,
                "chapter": DEFAULT_CHAPTER,
                "dpp": DEFAULT_DPP,
                "confidence": 0,
                "source": source,
                "created_at": datetime.utcnow().isoformat()
            })
        except Exception:
            continue

    return questions

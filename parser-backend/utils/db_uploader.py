import psycopg2
import json
from config import SUPABASE_DB

def insert_questions_to_db(questions):
    conn = psycopg2.connect(**SUPABASE_DB)
    cur = conn.cursor()
    inserted = skipped = 0

    for q in questions:
        q_text = q["question"].strip().lower()
        cur.execute("SELECT 1 FROM questions WHERE lower(trim(question)) = %s", (q_text,))
        if cur.fetchone():
            skipped += 1
            continue

        cur.execute(
            """
            INSERT INTO questions (
                subject, chapter, question, options, answer_index, explanation,
                confidence, source, created_at
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                q["subject"], q["chapter"], q["question"],
                json.dumps(q["options"]), q["answer_index"], q["explanation"],
                q.get("confidence", 0), q.get("source", ""), q.get("created_at")
            )
        )

        inserted += 1

    conn.commit()
    cur.close()
    conn.close()

    return inserted, skipped

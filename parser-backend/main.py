from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import shutil
import os

from utils.pdf_parser import extract_text_from_pdf
from utils.image_ocr import extract_text_from_image
from utils.question_parser import parse_questions_from_text
from utils.groq_ai import enrich_with_ai
from utils.db_uploader import insert_questions_to_db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with frontend origin if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    os.makedirs("temp", exist_ok=True)
    temp_path = f"./temp/{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    ext = Path(temp_path).suffix.lower()
    if ext == ".pdf":
        raw_text = extract_text_from_pdf(temp_path)
    elif ext in [".jpg", ".jpeg", ".png"]:
        raw_text = extract_text_from_image(temp_path)
    else:
        return {"error": "Unsupported file format"}

    questions = parse_questions_from_text(raw_text, source=temp_path)
    questions = enrich_with_ai(questions)
    inserted, skipped = insert_questions_to_db(questions)

    return {
        "message": "Parsed and uploaded successfully.",
        "total": len(questions),
        "inserted": inserted,
        "skipped": skipped
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

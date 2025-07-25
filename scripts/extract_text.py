import pdfplumber
import os

# === Configuration ===
INPUT_PDF = "./586ce3a3-3715-4559-8abd-a29ec9dc7ae4.pdf"  # Change to your actual file name
OUTPUT_TEXT = "parsed_questions.txt"

# === Step 1: Check if file exists ===
if not os.path.exists(INPUT_PDF):
    print(f"❌ File not found: {INPUT_PDF}")
    exit(1)

# === Step 2: Extract text from all pages ===
print(f"📄 Extracting text from: {INPUT_PDF}")
with pdfplumber.open(INPUT_PDF) as pdf:
    full_text = ""
    for i, page in enumerate(pdf.pages):
        text = page.extract_text()
        if text:
            full_text += f"\n\n--- Page {i + 1} ---\n\n"
            full_text += text

# === Step 3: Save output ===
with open(OUTPUT_TEXT, "w", encoding="utf-8") as f:
    f.write(full_text)

print(f"✅ Text extracted and saved to: {OUTPUT_TEXT}")

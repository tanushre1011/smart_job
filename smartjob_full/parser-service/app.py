from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile, os
from pdfminer.high_level import extract_text
from docx import Document
import spacy, re, json

nlp = spacy.load('en_core_web_sm')

app = Flask(__name__)
CORS(app)

SKILLS = ['python','javascript','react','node','django','flask','sql','mongodb','aws','docker','java','c++','c#','tensorflow','pytorch','spark']

def extract_text_from_file(path):
    p = path.lower()
    try:
        if p.endswith('.pdf'):
            return extract_text(path)
        if p.endswith('.docx'):
            doc = Document(path)
            return '\n'.join(p.text for p in doc.paragraphs)
        with open(path, 'r', errors='ignore') as f:
            return f.read()
    except Exception:
        return ''

def extract_email(text):
    m = re.search(r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}', text)
    return m.group(0) if m else None

def extract_phone(text):
    m = re.search(r'(\+?\d[\d\s\-\(\)]{7,}\d)', text)
    return m.group(0).strip() if m else None

def extract_name(doc):
    for ent in doc.ents:
        if ent.label_ == 'PERSON':
            return ent.text
    lines = [l.strip() for l in doc.text.splitlines() if l.strip()]
    if lines:
        for line in lines[:5]:
            if len(line.split()) <= 4:
                return line
        return lines[0]
    return None

def extract_experience_sections(text):
    sections = {}
    lowered = text.lower()
    if 'experience' in lowered:
        parts = re.split(r'(experience|work experience|professional experience)', text, flags=re.I)
        if len(parts) > 2:
            sections['experience'] = parts[2].strip()
    if 'experience' not in sections:
        sections['experience'] = text[:800]
    return sections

def extract_skills(text):
    found = []
    t = text.lower()
    for s in SKILLS:
        if re.search(r'\b' + re.escape(s) + r'\b', t):
            found.append(s)
    return list(sorted(set(found)))

@app.route('/parse', methods=['POST'])
def parse_resume():
    if 'file' not in request.files:
        return jsonify({'error':'file required'}), 400
    f = request.files['file']
    suffix = os.path.splitext(f.filename)[1].lower()
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    f.save(tmp.name)
    try:
        raw_text = extract_text_from_file(tmp.name)
        doc = nlp(raw_text[:20000])
        name = extract_name(doc)
        email = extract_email(raw_text)
        phone = extract_phone(raw_text)
        skills = extract_skills(raw_text)
        experience = extract_experience_sections(raw_text).get('experience', '')
        education = []
        years = re.findall(r'\b(19|20)\d{2}\b', raw_text)
        years_mentioned = sorted(set(years))
        out = {
            'rawText': raw_text,
            'name': name,
            'email': email,
            'phone': phone,
            'skills': skills,
            'experienceText': experience,
            'education': education,
            'yearsMentioned': years_mentioned
        }
        return jsonify(out)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        try:
            os.unlink(tmp.name)
        except Exception:
            pass

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)

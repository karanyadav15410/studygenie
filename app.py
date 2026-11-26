import os
import json
import uuid
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pypdf import PdfReader
from werkzeug.utils import secure_filename

import ai_service

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
LIBRARY_FILE = os.path.join(DATA_DIR, "library.json")

FRONTEND_DIST = os.path.join(os.path.dirname(BASE_DIR), "frontend", "dist")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Initialize Library file if it doesn't exist
if not os.path.exists(LIBRARY_FILE):
    initial_library = [
        {
            "id": "item-demo-1",
            "type": "note",
            "title": "Data Structures: Red-Black Trees & Balancing Invariants",
            "subject": "Computer Science",
            "date": "2026-11-20T10:30:00Z",
            "content": "# Red-Black Trees\n\nSelf-balancing binary search tree where each node has a color bit (red or black).\n\n### 5 Invariant Properties:\n1. Every node is either red or black.\n2. The root is always black.\n3. Every leaf (NIL) is black.\n4. If a node is red, both its children are black (no two consecutive reds).\n5. For each node, all simple paths from the node to descendant leaves contain the same number of black nodes (black height)."
        },
        {
            "id": "item-demo-2",
            "type": "flashcards",
            "title": "Operating Systems: Concurrency & Synchronization",
            "subject": "Computer Science",
            "date": "2026-11-22T14:15:00Z",
            "cards": [
                {"id": 1, "front": "What are the 4 Coffman conditions for deadlock?", "back": "1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait"},
                {"id": 2, "front": "What is a Semaphores' wait() vs signal()?", "back": "wait() (or P) decrements count and blocks if <= 0. signal() (or V) increments count and unblocks waiting threads."}
            ]
        },
        {
            "id": "item-demo-3",
            "type": "quiz",
            "title": "Calculus II: Taylor Series & Convergence Tests",
            "subject": "Mathematics",
            "date": "2026-11-24T18:45:00Z",
            "score": "4/5",
            "questions": [
                {
                    "question": "What is the interval of convergence for the geometric series sum(x^n)?",
                    "options": ["(-1, 1)", "[-1, 1]", "(-inf, inf)", "[0, 1)"],
                    "correctIndex": 0,
                    "explanation": "Geometric series converges if and only if |x| < 1."
                }
            ]
        }
    ]
    with open(LIBRARY_FILE, "w", encoding="utf-8") as f:
        json.dump(initial_library, f, indent=2)


def get_custom_key(req):
    """Extract custom Gemini API key from request headers."""
    return req.headers.get("X-Gemini-Api-Key", "").strip() or None


def read_library():
    try:
        with open(LIBRARY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def write_library(items):
    with open(LIBRARY_FILE, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2)


# ==============================================================================
# HEALTH & CONFIGURATION ENDPOINTS
# ==============================================================================

@app.route("/api/health", methods=["GET"])
def health_check():
    custom_key = get_custom_key(request)
    effective_key = ai_service.get_effective_api_key(custom_key)
    return jsonify({
        "status": "healthy",
        "service": "StudyGenie Backend",
        "has_gemini_key": bool(effective_key),
        "key_source": "custom_header" if custom_key else ("env" if os.getenv("GEMINI_API_KEY") else "none"),
        "timestamp": datetime.utcnow().isoformat()
    })


@app.route("/api/config/check-key", methods=["POST"])
def check_key():
    data = request.get_json() or {}
    key_to_test = data.get("api_key", "").strip() or get_custom_key(request)
    
    if not key_to_test:
        return jsonify({"valid": False, "message": "No key provided"}), 400

    test_res = ai_service.call_gemini_api(
        prompt="Respond with 'ok'",
        custom_key=key_to_test
    )
    if test_res.get("success"):
        return jsonify({
            "valid": True,
            "message": "Gemini API key is active and successfully validated!",
            "model": test_res.get("model")
        })
    else:
        return jsonify({
            "valid": False,
            "message": test_res.get("message", "Validation failed")
        }), 400


# ==============================================================================
# AI EDUCATIONAL ENDPOINTS
# ==============================================================================

@app.route("/api/ai/chat", methods=["POST"])
def chat_tutor():
    data = request.get_json() or {}
    messages = data.get("messages", [])
    subject = data.get("subject", "General Academic")
    mode = data.get("mode", "Detailed Explanation")
    custom_key = get_custom_key(request)

    if not messages:
        return jsonify({"error": "Messages array cannot be empty"}), 400

    response = ai_service.generate_chat_response(messages, subject, mode, custom_key=custom_key)
    return jsonify(response)


@app.route("/api/ai/notes", methods=["POST"])
def generate_notes_route():
    data = request.get_json() or {}
    subject = data.get("subject", "").strip()
    topic = data.get("topic", "").strip()
    level = data.get("level", "Undergraduate")
    style = data.get("style", "Comprehensive")
    custom_key = get_custom_key(request)

    if not topic:
        return jsonify({"error": "Topic is required"}), 400

    response = ai_service.generate_notes(subject, topic, level, style, custom_key=custom_key)
    return jsonify(response)


@app.route("/api/ai/summarize-pdf", methods=["POST"])
def summarize_pdf():
    custom_key = get_custom_key(request)
    summary_length = request.form.get("length", "Medium")

    if "file" not in request.files:
        return jsonify({"error": "No PDF file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if not file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "Unsupported file format. Please upload a standard .pdf file"}), 400

    filename = secure_filename(file.filename)
    unique_name = f"{uuid.uuid4().hex}_{filename}"
    filepath = os.path.join(UPLOAD_DIR, unique_name)
    file.save(filepath)

    try:
        reader = PdfReader(filepath)
        num_pages = len(reader.pages)
        if num_pages == 0:
            return jsonify({"error": "The uploaded PDF appears to be empty."}), 400

        extracted_text = ""
        for i, page in enumerate(reader.pages):
            page_text = page.extract_text()
            if page_text:
                extracted_text += f"\n--- Page {i+1} ---\n" + page_text

        extracted_text = extracted_text.strip()
        if not extracted_text or len(extracted_text) < 30:
            return jsonify({
                "error": "Could not extract readable text from this PDF. It may be a scanned image or protected document. Please upload a text-readable PDF."
            }), 400

        result = ai_service.summarize_pdf_text(extracted_text, summary_length, custom_key=custom_key)
        result["filename"] = filename
        result["num_pages"] = num_pages
        result["extracted_chars"] = len(extracted_text)
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": f"Failed to process PDF: {str(e)}"}), 500
    finally:
        # Cleanup uploaded file
        if os.path.exists(filepath):
            try:
                os.remove(filepath)
            except Exception:
                pass


@app.route("/api/ai/quiz", methods=["POST"])
def generate_quiz_route():
    data = request.get_json() or {}
    subject = data.get("subject", "Computer Science").strip()
    topic = data.get("topic", "Data Structures").strip()
    count = int(data.get("count", 5))
    difficulty = data.get("difficulty", "Medium")
    custom_key = get_custom_key(request)

    if not topic:
        return jsonify({"error": "Topic is required"}), 400

    result = ai_service.generate_quiz(subject, topic, count, difficulty, custom_key=custom_key)
    return jsonify(result)


@app.route("/api/ai/flashcards", methods=["POST"])
def generate_flashcards_route():
    data = request.get_json() or {}
    topic = data.get("topic", "").strip()
    context_text = data.get("context_text", "").strip()
    count = int(data.get("count", 8))
    custom_key = get_custom_key(request)

    if not topic and not context_text:
        return jsonify({"error": "Topic or context text is required"}), 400

    result = ai_service.generate_flashcards(topic or "Study Notes", context_text, count, custom_key=custom_key)
    return jsonify(result)


@app.route("/api/ai/planner", methods=["POST"])
def generate_planner_route():
    data = request.get_json() or {}
    subjects = data.get("subjects", "").strip()
    exam_dates = data.get("exam_dates", "").strip()
    daily_hours = float(data.get("daily_hours", 4.0))
    goals = data.get("goals", "").strip()
    custom_key = get_custom_key(request)

    if not subjects:
        return jsonify({"error": "Subjects are required"}), 400

    result = ai_service.generate_study_plan(subjects, exam_dates, daily_hours, goals, custom_key=custom_key)
    return jsonify(result)


@app.route("/api/ai/code", methods=["POST"])
def code_assistant():
    data = request.get_json() or {}
    language = data.get("language", "Python").strip()
    prompt_text = data.get("prompt", "").strip()
    mode = data.get("mode", "Generate Code")
    custom_key = get_custom_key(request)

    if not prompt_text:
        return jsonify({"error": "Prompt or code snippet is required"}), 400

    result = ai_service.generate_code_assistance(language, prompt_text, mode, custom_key=custom_key)
    return jsonify(result)


# ==============================================================================
# MY LIBRARY CRUD ENDPOINTS
# ==============================================================================

@app.route("/api/library", methods=["GET"])
def get_library_items():
    items = read_library()
    item_type = request.args.get("type")
    query = request.args.get("q", "").lower().strip()

    if item_type and item_type != "all":
        items = [i for i in items if i.get("type") == item_type]

    if query:
        items = [
            i for i in items
            if query in i.get("title", "").lower()
            or query in i.get("subject", "").lower()
            or query in str(i.get("content", "")).lower()
        ]

    return jsonify({"success": True, "items": items})


@app.route("/api/library", methods=["POST"])
def save_library_item():
    data = request.get_json() or {}
    if not data.get("title"):
        return jsonify({"error": "Title is required"}), 400

    items = read_library()
    new_item = {
        "id": f"item-{uuid.uuid4().hex[:8]}",
        "type": data.get("type", "note"),
        "title": data.get("title"),
        "subject": data.get("subject", "General"),
        "date": datetime.utcnow().isoformat(),
        "content": data.get("content", ""),
        "metadata": data.get("metadata", {})
    }
    items.insert(0, new_item)
    write_library(items)
    return jsonify({"success": True, "item": new_item})


@app.route("/api/library/<item_id>", methods=["DELETE"])
def delete_library_item(item_id):
    items = read_library()
    filtered = [i for i in items if i.get("id") != item_id]
    write_library(filtered)
    return jsonify({"success": True, "deleted_id": item_id})


@app.route("/api/library/<item_id>", methods=["PUT"])
def update_library_item(item_id):
    data = request.get_json() or {}
    items = read_library()
    updated = None
    for i in items:
        if i.get("id") == item_id:
            if "title" in data:
                i["title"] = data["title"]
            if "content" in data:
                i["content"] = data["content"]
            if "subject" in data:
                i["subject"] = data["subject"]
            i["updated_at"] = datetime.utcnow().isoformat()
            updated = i
            break

    if updated:
        write_library(items)
        return jsonify({"success": True, "item": updated})
    return jsonify({"error": "Item not found"}), 404


# ==============================================================================
# STATIC FRONTEND SERVING
# ==============================================================================

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    # Skip /api routes
    if path.startswith("api/"):
        return jsonify({"error": "Endpoint not found"}), 404
    if path and os.path.exists(os.path.join(FRONTEND_DIST, path)):
        return send_from_directory(FRONTEND_DIST, path)
    if os.path.exists(os.path.join(FRONTEND_DIST, "index.html")):
        return send_from_directory(FRONTEND_DIST, "index.html")
    return jsonify({"message": "StudyGenie API operational. Build frontend to view interface."})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"StudyGenie Backend running on http://127.0.0.1:{port}")
    app.run(host="127.0.0.1", port=port, debug=False)

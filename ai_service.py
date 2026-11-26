import os
import json
import re
import requests
from typing import List, Dict, Any, Optional

# Supported Gemini models in order of preference
GEMINI_MODELS = [
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro"
]

def get_effective_api_key(custom_key: Optional[str] = None) -> Optional[str]:
    """Retrieve Gemini API key from custom header or server environment variable."""
    if custom_key and custom_key.strip():
        return custom_key.strip()
    return os.getenv("GEMINI_API_KEY", "").strip() or None

def call_gemini_api(prompt: str, system_instruction: Optional[str] = None, json_mode: bool = False, custom_key: Optional[str] = None) -> Dict[str, Any]:
    """
    Calls the Google Gemini API using REST endpoint.
    Handles error codes, rate limits, and JSON parsing.
    """
    api_key = get_effective_api_key(custom_key)
    if not api_key:
        return {
            "success": False,
            "error": "GEMINI_API_KEY_MISSING",
            "message": "No Google Gemini API key configured. Please provide an API key in Settings or .env file.",
            "is_demo": True
        }

    generation_config: Dict[str, Any] = {
        "temperature": 0.4 if json_mode else 0.7,
        "maxOutputTokens": 3000
    }
    if json_mode:
        generation_config["responseMimeType"] = "application/json"

    payload: Dict[str, Any] = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": generation_config
    }

    if system_instruction:
        payload["systemInstruction"] = {
            "parts": [{"text": system_instruction}]
        }

    last_error = None
    for model_name in GEMINI_MODELS:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
        try:
            res = requests.post(
                url,
                headers={"Content-Type": "application/json"},
                json=payload,
                timeout=30
            )

            if res.status_code == 200:
                data = res.json()
                try:
                    candidate = data["candidates"][0]
                    content_text = candidate["content"]["parts"][0]["text"]
                    return {
                        "success": True,
                        "content": content_text,
                        "model": model_name,
                        "is_demo": False
                    }
                except (KeyError, IndexError) as parse_err:
                    last_error = f"Malformed Gemini response structure: {str(parse_err)}"
            elif res.status_code == 429:
                last_error = f"Gemini API rate limit reached ({model_name}). Please try again shortly."
            elif res.status_code == 400:
                err_body = res.json().get("error", {}).get("message", "Bad request")
                last_error = f"Gemini API error (400): {err_body}"
                break
            elif res.status_code == 403:
                last_error = "Gemini API key is invalid or lacks necessary permissions."
                break
            else:
                last_error = f"Gemini API responded with status {res.status_code}: {res.text}"
        except requests.exceptions.Timeout:
            last_error = f"Request to Gemini timed out using model {model_name}."
        except requests.exceptions.RequestException as e:
            last_error = f"Network error contacting Gemini API: {str(e)}"

    return {
        "success": False,
        "error": "API_CALL_FAILED",
        "message": last_error or "Failed to connect to Google Gemini API.",
        "is_demo": True
    }


# ==============================================================================
# SPECIALIZED AI WORKFLOWS
# ==============================================================================

def generate_chat_response(messages: List[Dict[str, str]], subject: str, mode: str, custom_key: Optional[str] = None) -> Dict[str, Any]:
    """
    ChatGPT-style academic tutor conversation.
    Modes: 'Beginner Explanation', 'Detailed Explanation', 'Exam Preparation', 'Real-World Examples'
    """
    mode_instructions = {
        "Beginner Explanation": "Explain using everyday analogies, simple language, and zero intimidating jargon. Build understanding from fundamentals.",
        "Detailed Explanation": "Provide deep, rigorous conceptual explanations, technical mechanisms, historical/scientific context, and exact terminology.",
        "Exam Preparation": "Focus on high-yield test topics, likely examination questions, key marking points, common pitfalls, and memorization mnemonics.",
        "Real-World Examples": "Ground every explanation in tangible industry, software engineering, biological, or physical real-world case studies."
    }

    selected_instruction = mode_instructions.get(mode, mode_instructions["Detailed Explanation"])

    system_prompt = (
        f"You are StudyGenie, an expert AI Academic Tutor specialized in {subject or 'University Level Academics'}. "
        f"Explanation Mode: {mode}. {selected_instruction} "
        f"Format your response cleanly using Markdown, with bold headings, bullet points, and code/math blocks where appropriate. "
        f"Maintain a supportive, encouraging, and pedagogically rigorous tone."
    )

    # Format conversation history
    convo_parts = []
    for msg in messages:
        role = "Student" if msg.get("role") == "user" else "Tutor"
        convo_parts.append(f"{role}: {msg.get('content', '')}")
    convo_text = "\n\n".join(convo_parts)

    prompt = (
        f"Here is the dialogue history so far:\n\n{convo_text}\n\n"
        f"Please provide your response as StudyGenie for the last question in the context of subject '{subject}' with '{mode}' style."
    )

    result = call_gemini_api(prompt, system_instruction=system_prompt, custom_key=custom_key)
    if result["success"]:
        return result

    # Realistic Demo Fallback if API key is not yet set
    user_last_q = messages[-1]["content"] if messages else "concept"
    demo_content = f"""### 📚 StudyGenie Tutor: {subject or 'Academic Study'}

*(Notice: Running in Demo Mode because no Gemini API key was provided. To enable live AI, add your Gemini API key in Settings)*

#### Mode: **{mode}**

**Question:** *"{user_last_q}"*

---

#### 1. Core Principle & Conceptual Overview
Understanding this concept requires breaking it down into its foundational components:
- **Foundational Idea**: Every complex structure is composed of modular, well-defined primitives.
- **Key Mechanism**: Information or control flows through predictable transformation steps, maintaining state or invariant guarantees.

#### 2. Step-by-Step Breakdown
1. **Initiation**: The system establishes the baseline environment and checks preconditions.
2. **Processing Cycle**: Data is evaluated sequentially or iteratively, resolving dependencies.
3. **Synthesis & Output**: The result is verified and committed to the intended output stream.

#### 3. Real-World Parallel
> Think of this like a university library checkout counter: before you take a book, your identity is verified, the book's RFID is scanned to update the central catalog, and an audit trail is recorded.

#### 4. Exam Tips & Pitfalls
- ⚠️ **Common Trap**: Confusing worst-case time complexity with average-case behavior.
- 💡 **Key Exam Tip**: Always state your assumptions and edge conditions first before writing the formal proof or solution.

*Feel free to ask a follow-up question, or request a worked code/math example!*"""
    return {
        "success": True,
        "content": demo_content,
        "is_demo": True,
        "notice": result.get("message")
    }


def generate_notes(subject: str, topic: str, level: str, style: str, custom_key: Optional[str] = None) -> Dict[str, Any]:
    """
    Generates structured, publication-grade academic revision notes.
    """
    system_prompt = (
        "You are an elite academic professor and textbook author. "
        "Your task is to write comprehensive, beautifully structured revision notes. "
        "You MUST include: "
        "1. Executive Summary & Topic Introduction\n"
        "2. Formal Definitions & Core Terminology\n"
        "3. In-Depth Mechanism & Architectural Explanations\n"
        "4. Key Points & Theoretical Invariants\n"
        "5. Concrete Examples & Case Studies\n"
        "6. Important Formulas, Math, or Algorithms (formatted with LaTeX or Markdown tables)\n"
        "7. Quick Revision Checklist (Bulleted short notes)\n"
        "8. Likely University Examination Questions (with model marking criteria)\n"
        "Use clean, professional Markdown."
    )

    prompt = (
        f"Subject: {subject}\n"
        f"Topic: {topic}\n"
        f"Academic Level: {level} (e.g., Undergraduate, Graduate, High School)\n"
        f"Explanation Style: {style}\n\n"
        f"Generate complete, ready-to-study notes for this topic covering all required sections."
    )

    result = call_gemini_api(prompt, system_instruction=system_prompt, custom_key=custom_key)
    if result["success"]:
        return result

    # High fidelity demo notes
    demo_notes = f"""# 📖 Comprehensive Study Notes: {topic}
**Subject:** {subject} | **Academic Level:** {level} | **Style:** {style}
*Generated by StudyGenie AI Assistant (Demo Mode)*

---

## 1. Executive Summary & Introduction
**{topic}** represents a fundamental pillar within **{subject}**. At its core, it addresses how complex operations are modeled, executed, and optimized in modern academic and industrial workflows. 

Understanding {topic} is indispensable for mastering subsequent advanced paradigms, as it establishes both theoretical baselines and practical execution models.

---

## 2. Key Definitions & Formal Terminology
* **Fundamental Concept**: The formal abstraction defining how state transitions and operations are bounded.
* **Invariant**: A condition that remains true across all operational states within the system.
* **Throughput / Efficiency Metric**: Quantitative measure of performance per unit of execution time.
* **Boundary Condition**: Edge scenarios that dictate system stability under extreme loads or corner inputs.

---

## 3. In-Depth Conceptual Explanations
When analyzing {topic}, we delineate three critical phases:

1. **Initialization & Ingestion**:
   - The system ingests inputs, validates structural integrity, and allocates required resources.
   - Guard conditions prevent buffer overflows, invalid pointers, or schema drift.

2. **Core Transformation Engine**:
   - Algorithmic logic processes the workload using optimized deterministic pathways.
   - Resource consumption is capped according to theoretical complexity bounds.

3. **Verification & State Settlement**:
   - Results are finalized with idempotency guarantees, ensuring repeatability and error resilience.

---

## 4. Key Formulas & Theoretical Metrics
| Metric | Mathematical Expression | Significance |
| :--- | :--- | :--- |
| **Primary Efficiency** | $O(n \\log n)$ | Standard optimal bound for distributed sorting and tree queries |
| **Utilization Ratio** | $\\eta = \\frac{{T_{{active}}}}{{T_{{total}}}} \\times 100\\%$ | Operational efficiency without idle thrashing |
| **Error Rate** | $\\epsilon = \\lim_{{N \\to \\infty}} \\frac{{\\text{{Errors}}}}{{N}}$ | Asymptotic reliability under prolonged continuous load |

---

## 5. Practical Example & Implementation
```python
# Canonical Example illustrating {topic}
def process_study_entity(entities):
    \"\"\"
    Processes elements ensuring invariant integrity.
    Time Complexity: O(n) | Space Complexity: O(1) auxiliary
    \"\"\"
    validated = []
    for item in entities:
        if item.is_valid():
            validated.append(item.transform())
    return validated
```

---

## 6. High-Yield Revision Checklist
* [ ] Can you define {topic} in your own words in under 30 seconds?
* [ ] Understand the difference between the theoretical best-case and worst-case scenarios.
* [ ] Memorize the key formula and know when it applies vs when assumptions break down.
* [ ] Be prepared to sketch the block diagram or architecture on paper during exams.

---

## 7. University Examination Questions (With Marking Guide)
**Q1. (10 Marks):** Explain the architecture of {topic} with a neat schematic diagram. Detail two major trade-offs.
* *Model Marking Scheme*: 3 marks for correct labeled diagram, 4 marks for mechanism description, 3 marks for trade-off analysis.

**Q2. (5 Marks):** Differentiate between synchronous and asynchronous handling in this context with examples.
* *Model Marking Scheme*: 2.5 marks for contrasting criteria table, 2.5 marks for practical application examples."""
    return {
        "success": True,
        "content": demo_notes,
        "is_demo": True,
        "notice": result.get("message")
    }


def summarize_pdf_text(pdf_text: str, summary_length: str, custom_key: Optional[str] = None) -> Dict[str, Any]:
    """
    Summarizes extracted text from uploaded PDF.
    Extracts summary, key definitions, revision points, and potential exam questions.
    """
    length_guide = {
        "Short": "a concise 2-3 paragraph executive summary, 5 bullet points, and 3 key terms.",
        "Medium": "a structured 4-6 paragraph summary, 8 key takeaways, 5 critical definitions, and 5 exam questions.",
        "Detailed": "an exhaustive university-level study guide covering all sections, definitions, theoretical proofs/concepts, formula tables, and 10 exam questions."
    }
    guide = length_guide.get(summary_length, length_guide["Medium"])

    system_prompt = (
        "You are an expert academic research assistant and syllabus analyst. "
        "Analyze the provided document text thoroughly. "
        "Do NOT invent contents that are not in the document. "
        "Produce: "
        "1. Executive Summary\n"
        "2. Core Concepts & Findings\n"
        "3. Key Definitions & Terminology\n"
        "4. High-Yield Quick Revision Notes\n"
        "5. Recommended Practice & Exam Questions extracted directly from the subject matter."
    )

    # Truncate text if excessively long to prevent token overflow
    truncated_text = pdf_text[:12000] if len(pdf_text) > 12000 else pdf_text

    prompt = (
        f"Requested Summary Detail: {summary_length} ({guide})\n\n"
        f"--- DOCUMENT TEXT CONTENT ---\n{truncated_text}\n--- END DOCUMENT TEXT ---\n\n"
        f"Generate the comprehensive educational summary based strictly on the above text."
    )

    result = call_gemini_api(prompt, system_instruction=system_prompt, custom_key=custom_key)
    if result["success"]:
        return result

    # Smart fallback based on actual extracted text snippets
    first_lines = "\n".join([line.strip() for line in pdf_text.splitlines() if line.strip()][:5])
    demo_summary = f"""# 📄 Document Study Summary ({summary_length} Mode)
*Analyzed by StudyGenie PDF Intelligence Engine (Demo Mode)*

---

### 1. Executive Summary
The uploaded document contains academic material focusing on foundational theory, methodologies, and practical applications.

**Extracted Context Snippet:**
> *"{first_lines[:250]}..."*

Overall, the text articulates core principles, establishing standard paradigms, workflows, and analytical techniques relevant to modern syllabus requirements.

---

### 2. Core Concepts Identified
* **Primary Subject Framework**: Systematic structuring of operational modules and their interrelationships.
* **Methodology & Execution**: Systematic approaches applied to ensure reproducibility, precision, and efficiency.
* **Empirical Observations**: Real-world behavior under variable parameters and workload distributions.

---

### 3. Critical Definitions
* **Primary Paradigm**: The governing theoretical model described in Section 1.
* **Operational Tolerance**: The permissible range of error or resource limits before degradation occurs.
* **Synthesis Phase**: The consolidation step wherein extracted components are integrated.

---

### 4. High-Yield Revision Points
* Always verify initial boundary conditions prior to running computations.
* Remember the fundamental hierarchy: raw data $\\rightarrow$ validated structures $\\rightarrow$ synthesized outcomes.
* Review the author's primary conclusion regarding performance trade-offs.

---

### 5. Exam Questions From Document
1. What is the primary thesis or problem statement tackled in this text?
2. Explain the mechanism proposed by the author to optimize system throughput.
3. Compare the traditional methodology against the improved approach outlined in the findings."""
    return {
        "success": True,
        "content": demo_summary,
        "is_demo": True,
        "notice": result.get("message")
    }


def generate_quiz(subject: str, topic: str, count: int, difficulty: str, custom_key: Optional[str] = None) -> Dict[str, Any]:
    """
    Generates interactive multiple-choice questions with 4 options, correct answer, and explanation.
    Returns structured JSON.
    """
    count = max(3, min(count, 15))
    system_prompt = (
        "You are an academic test maker and exam setter. "
        "Create challenging, high-quality multiple choice questions. "
        "You must respond ONLY with a valid JSON array of objects. "
        "Each object must have the exact keys: "
        "'id' (integer 1..N), "
        "'question' (string), "
        "'options' (array of 4 distinct string choices), "
        "'correctIndex' (integer 0, 1, 2, or 3 corresponding to options array), "
        "'explanation' (detailed explanation of why the correct answer is right and why others are incorrect)."
    )

    prompt = (
        f"Subject: {subject}\n"
        f"Topic: {topic}\n"
        f"Number of Questions: {count}\n"
        f"Difficulty: {difficulty}\n\n"
        f"Output JSON array only. No markdown fences, no explanatory text."
    )

    result = call_gemini_api(prompt, system_instruction=system_prompt, json_mode=True, custom_key=custom_key)
    if result["success"]:
        try:
            cleaned = result["content"].strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            parsed = json.loads(cleaned.strip())
            if isinstance(parsed, list) and len(parsed) > 0:
                return {
                    "success": True,
                    "questions": parsed,
                    "is_demo": False
                }
        except Exception:
            pass

    # High-quality contextual demo quiz
    demo_questions = [
        {
            "id": 1,
            "question": f"In {subject or 'Computer Science'}, what is the primary operational advantage of {topic or 'dynamic allocation'}?",
            "options": [
                "It reduces runtime memory overhead to zero",
                "It enables flexible resource allocation scaled to dynamic workload demands",
                "It guarantees absolute single-threaded synchronization",
                "It completely bypasses compile-time syntax verification"
            ],
            "correctIndex": 1,
            "explanation": "Dynamic allocation allows programs to request memory as needed during execution rather than committing fixed static buffers at compile time."
        },
        {
            "id": 2,
            "question": f"Which asymptotic time complexity represents the optimal average-case sorting bound for comparison-based algorithms?",
            "options": [
                "O(1)",
                "O(n)",
                "O(n log n)",
                "O(n^2)"
            ],
            "correctIndex": 2,
            "explanation": "Information theoretic lower bounds prove that any comparison-based sort requires at least Ω(n log n) comparisons in the average and worst cases (e.g. Merge Sort, Heap Sort)."
        },
        {
            "id": 3,
            "question": f"When implementing {topic or 'concurrency'}, what condition directly leads to a deadlock?",
            "options": [
                "Mutual exclusion, Hold and wait, No preemption, and Circular wait occurring simultaneously",
                "Excessive stack memory allocation without heap usage",
                "Using pure functional functions with immutable variables",
                "Executing non-blocking I/O operations inside a coroutine"
            ],
            "correctIndex": 0,
            "explanation": "Coffman conditions state that deadlock can occur if and only if all four conditions (Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait) hold concurrently."
        },
        {
            "id": 4,
            "question": f"In modern university exams regarding {subject or 'Software Engineering'}, what is an 'idempotent' operation?",
            "options": [
                "An operation that always executes in exactly one CPU cycle",
                "An operation that produces the exact same outcome regardless of how many times it is repeated",
                "An operation that requires multiple concurrent locks to prevent race conditions",
                "An operation that terminates the parent thread upon completion"
            ],
            "correctIndex": 1,
            "explanation": "An operation is idempotent if applying it multiple times yields the same result as applying it once (e.g., HTTP GET or PUT, or f(f(x)) = f(x))."
        },
        {
            "id": 5,
            "question": f"Which of the following is considered the best practice when debugging complex logic in {topic or 'algorithms'}?",
            "options": [
                "Deleting unit tests that fail repeatedly",
                "Isolating variables, inspecting boundary states, and testing invariant hypotheses incrementally",
                "Replacing deterministic logic with pseudo-random numbers",
                "Suppressing all compiler warnings and runtime exceptions"
            ],
            "correctIndex": 1,
            "explanation": "Rigorous systematic debugging relies on isolating state mutations, validating system invariants, and using binary search across execution boundaries."
        }
    ]
    return {
        "success": True,
        "questions": demo_questions[:count],
        "is_demo": True,
        "notice": result.get("message")
    }


def generate_flashcards(topic: str, context_text: Optional[str] = None, count: int = 8, custom_key: Optional[str] = None) -> Dict[str, Any]:
    """
    Generates smart 2-sided flashcards for active recall revision.
    Returns structured JSON.
    """
    count = max(4, min(count, 15))
    system_prompt = (
        "You are an active-recall cognitive science tutor. "
        "Create high-yield flashcards for students. "
        "Each flashcard has a front (prompt, question, or term) and back (concise, clear answer with key points). "
        "Respond ONLY with a valid JSON array of objects. "
        "Each object must have the exact keys: 'id' (integer), 'front' (string), 'back' (string), 'category' (string)."
    )

    prompt = (
        f"Topic: {topic}\n"
        f"Context/Notes: {context_text or 'Standard University Syllabus'}\n"
        f"Count: {count}\n\n"
        f"Output JSON array only."
    )

    result = call_gemini_api(prompt, system_instruction=system_prompt, json_mode=True, custom_key=custom_key)
    if result["success"]:
        try:
            cleaned = result["content"].strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            parsed = json.loads(cleaned.strip())
            if isinstance(parsed, list) and len(parsed) > 0:
                return {
                    "success": True,
                    "flashcards": parsed,
                    "is_demo": False
                }
        except Exception:
            pass

    # High quality demo flashcards
    demo_cards = [
        {
            "id": 1,
            "front": f"What is the core definition of {topic}?",
            "back": f"{topic} is a structured paradigm designed to organize, process, and optimize system operations with predictable performance and formal guarantees.",
            "category": "Fundamentals"
        },
        {
            "id": 2,
            "front": "What is the Time vs. Space trade-off?",
            "back": "The principle where increasing memory usage (e.g. caching, hash tables) reduces execution time, or vice-versa (compressing data saves space at the expense of CPU cycles).",
            "category": "Theory"
        },
        {
            "id": 3,
            "front": "What is the difference between Synchronous and Asynchronous execution?",
            "back": "Synchronous blocks execution until the current task finishes. Asynchronous allows other operations to run concurrently while waiting for I/O or background processing.",
            "category": "Architecture"
        },
        {
            "id": 4,
            "front": "What is a Race Condition?",
            "back": "An undesirable situation where the system's output depends on the non-deterministic sequence or timing of concurrent threads or events.",
            "category": "Concurrency"
        },
        {
            "id": 5,
            "front": "What does ACID stand for in databases?",
            "back": "Atomicity (all or nothing), Consistency (valid state transitions), Isolation (concurrent independence), and Durability (permanent persistence).",
            "category": "Data Systems"
        },
        {
            "id": 6,
            "front": "What is Polymorphism in Object-Oriented Programming?",
            "back": "The ability of different objects to respond to the same method invocation in ways specific to their type (compile-time overloading or runtime overriding).",
            "category": "OOP"
        },
        {
            "id": 7,
            "front": "What is the P vs NP problem in Computer Science?",
            "back": "The unsolved theoretical question of whether every problem whose solution can be quickly verified by a computer can also be quickly solved by one.",
            "category": "Theory of Computation"
        },
        {
            "id": 8,
            "front": "What is Big-O notation, and why is it asymptotic?",
            "back": "It describes the upper bound of resource consumption as the input size n approaches infinity, ignoring machine-dependent constant factors.",
            "category": "Algorithms"
        }
    ]
    return {
        "success": True,
        "flashcards": demo_cards[:count],
        "is_demo": True,
        "notice": result.get("message")
    }


def generate_study_plan(subjects: str, exam_dates: str, daily_hours: float, goals: str, custom_key: Optional[str] = None) -> Dict[str, Any]:
    """
    Generates a personalized daily and weekly study timetable with milestone tracking.
    Returns structured JSON.
    """
    system_prompt = (
        "You are an academic advisor and time-management coach. "
        "Create an actionable, balanced, and sustainable university study schedule. "
        "Respond ONLY with a valid JSON object. "
        "Schema: "
        "{\n"
        "  'title': string,\n"
        "  'overview': string,\n"
        "  'daily_hours_target': number,\n"
        "  'days': [\n"
        "     {\n"
        "       'day': string (e.g. 'Monday', 'Day 1'),\n"
        "       'focus_subject': string,\n"
        "       'tasks': [\n"
        "          {'id': string, 'time': string, 'subject': string, 'topic': string, 'type': string, 'completed': false}\n"
        "       ]\n"
        "     }\n"
        "  ],\n"
        "  'revision_tips': [string]\n"
        "}"
    )

    prompt = (
        f"Subjects: {subjects}\n"
        f"Examination Dates / Horizon: {exam_dates}\n"
        f"Daily Study Hours Available: {daily_hours} hrs/day\n"
        f"Goals & Priorities: {goals}\n\n"
        f"Generate the complete timetable JSON."
    )

    result = call_gemini_api(prompt, system_instruction=system_prompt, json_mode=True, custom_key=custom_key)
    if result["success"]:
        try:
            cleaned = result["content"].strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            parsed = json.loads(cleaned.strip())
            if isinstance(parsed, dict) and "days" in parsed:
                return {
                    "success": True,
                    "plan": parsed,
                    "is_demo": False
                }
        except Exception:
            pass

    # High fidelity demo study plan
    subject_list = [s.strip() for s in subjects.split(",") if s.strip()] or ["Computer Science", "Mathematics", "Physics"]
    demo_plan = {
        "title": f"Strategic Exam Mastery Timetable ({subjects})",
        "overview": f"A balanced study roadmap allocating {daily_hours} hours daily with Pomodoro intervals, active recall, and spaced repetition.",
        "daily_hours_target": daily_hours,
        "days": [
            {
                "day": "Monday - Deep Theory Focus",
                "focus_subject": subject_list[0],
                "tasks": [
                    {"id": "task-1", "time": "09:00 AM - 10:30 AM", "subject": subject_list[0], "topic": "Core Architecture & Conceptual Formulations", "type": "Concept Learning", "completed": False},
                    {"id": "task-2", "time": "11:00 AM - 12:30 PM", "subject": subject_list[0], "topic": "Worked Textbook Problems & Proofs", "type": "Practice", "completed": False},
                    {"id": "task-3", "time": "04:00 PM - 05:00 PM", "subject": subject_list[min(1, len(subject_list)-1)], "topic": "Quick Terminology & Flashcard Review", "type": "Revision", "completed": False}
                ]
            },
            {
                "day": "Tuesday - Problem Solving & Mechanics",
                "focus_subject": subject_list[min(1, len(subject_list)-1)],
                "tasks": [
                    {"id": "task-4", "time": "09:00 AM - 10:30 AM", "subject": subject_list[min(1, len(subject_list)-1)], "topic": "Analytical Derivations and Numerical Equations", "type": "Deep Work", "completed": False},
                    {"id": "task-5", "time": "11:00 AM - 12:30 PM", "subject": subject_list[0], "topic": "Past Year University Exam Questions", "type": "Exam Prep", "completed": False},
                    {"id": "task-6", "time": "03:30 PM - 04:30 PM", "subject": "All Subjects", "topic": "Synthesizing Summary Mindmaps", "type": "Notes", "completed": False}
                ]
            },
            {
                "day": "Wednesday - Practical & Code Execution",
                "focus_subject": subject_list[min(2, len(subject_list)-1)],
                "tasks": [
                    {"id": "task-7", "time": "09:30 AM - 11:00 AM", "subject": subject_list[min(2, len(subject_list)-1)], "topic": "Algorithmic Implementations & Edge Testing", "type": "Lab / Code", "completed": False},
                    {"id": "task-8", "time": "11:30 AM - 01:00 PM", "subject": subject_list[0], "topic": "Timed Mock Quiz Evaluation", "type": "Assessment", "completed": False},
                    {"id": "task-9", "time": "05:00 PM - 06:00 PM", "subject": "General", "topic": "Review Weak Areas from Quiz Mistakes", "type": "Correction", "completed": False}
                ]
            },
            {
                "day": "Thursday - Advanced Applications & Case Studies",
                "focus_subject": subject_list[0],
                "tasks": [
                    {"id": "task-10", "time": "09:00 AM - 11:00 AM", "subject": subject_list[0], "topic": "High-Yield Topics & Probable 10-Mark Questions", "type": "Exam Prep", "completed": False},
                    {"id": "task-11", "time": "02:00 PM - 03:30 PM", "subject": subject_list[min(1, len(subject_list)-1)], "topic": "Formula Sheet Recitation & Whiteboard Proofs", "type": "Active Recall", "completed": False}
                ]
            },
            {
                "day": "Friday - Comprehensive Consolidation",
                "focus_subject": "All Subjects",
                "tasks": [
                    {"id": "task-12", "time": "10:00 AM - 12:00 PM", "subject": "All Subjects", "topic": "Full Length Timed Past Exam Simulation", "type": "Mock Exam", "completed": False},
                    {"id": "task-13", "time": "03:00 PM - 04:30 PM", "subject": "All Subjects", "topic": "Score Analytics and Plan Adjustment for Next Week", "type": "Audit", "completed": False}
                ]
            }
        ],
        "revision_tips": [
            "Use 50-minute focused blocks followed by a mandatory 10-minute walk away from screens.",
            "Write definitions on blank paper from memory rather than passively re-reading slides.",
            "Prioritize subjects with earliest exam dates and highest credit weighting.",
            "Get at least 7.5 hours of sleep before exam days to optimize hippocampal memory consolidation."
        ]
    }
    return {
        "success": True,
        "plan": demo_plan,
        "is_demo": True,
        "notice": result.get("message")
    }


def generate_code_assistance(language: str, prompt_text: str, mode: str, custom_key: Optional[str] = None) -> Dict[str, Any]:
    """
    Assists in programming: generate code, explain code, debug errors, explain complexity.
    """
    mode_instructions = {
        "Generate Code": "Write clean, idiomatic, fully functional, well-commented code that solves the user's requirement. Include time and space complexity.",
        "Explain Code": "Walk through the code step-by-step. Explain the algorithm, state transitions, variables, and potential edge cases.",
        "Debug & Fix": "Identify bugs, logic flaws, memory leaks, or race conditions. Provide the corrected code and explain exactly why the error occurred.",
        "Time & Space Complexity": "Provide rigorous Big-O analysis for worst, average, and best cases. Detail auxiliary space and recursion stack usage."
    }
    instruction = mode_instructions.get(mode, mode_instructions["Generate Code"])

    system_prompt = (
        f"You are StudyGenie AI Code Mentor specialized in {language}. "
        f"Mode: {mode}. {instruction} "
        f"Format code blocks cleanly with syntax highlighting (e.g. ```{language.lower()}). "
        f"Always provide practical tips, idiomatic conventions, and complexity analysis."
    )

    prompt = (
        f"Programming Language: {language}\n"
        f"Operation Mode: {mode}\n\n"
        f"User Query / Code:\n{prompt_text}\n\n"
        f"Provide your structured educational response."
    )

    result = call_gemini_api(prompt, system_instruction=system_prompt, custom_key=custom_key)
    if result["success"]:
        return result

    # Smart demo code response
    lang_lower = language.lower()
    code_snippets = {
        "python": """def binary_search(arr: list[int], target: int) -> int:
    \"\"\"
    Searches for target in a sorted list using Binary Search.
    Time Complexity: O(log n)
    Space Complexity: O(1) auxiliary
    \"\"\"
    left, right = 0, len(arr) - 1
    
    while left <= right:
        # Prevent potential integer overflow
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid  # Found at index mid
        elif arr[mid] < target:
            left = mid + 1  # Target is in the right half
        else:
            right = mid - 1  # Target is in the left half
            
    return -1  # Target not found

# Example Usage:
numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
target_val = 23
result_idx = binary_search(numbers, target_val)
print(f"Target {target_val} found at index: {result_idx}")""",
        "c++": """#include <iostream>
#include <vector>

// Searches for target in sorted vector
// Time Complexity: O(log n) | Space Complexity: O(1)
int binarySearch(const std::vector<int>& arr, int target) {
    int left = 0;
    int right = static_cast<int>(arr.size()) - 1;
    
    while (left <= right) {
        // Prevents overflow compared to (left + right) / 2
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1; // Not found
}

int main() {
    std::vector<int> numbers = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int target = 23;
    int result = binarySearch(numbers, target);
    std::cout << "Target " << target << " found at index: " << result << std::endl;
    return 0;
}""",
        "java": """public class Solution {
    /**
     * Binary Search implementation in Java
     * Time Complexity: O(log n)
     * Space Complexity: O(1)
     */
    public static int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] data = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
        int target = 23;
        int idx = binarySearch(data, target);
        System.out.println("Target " + target + " found at index: " + idx);
    }
}""",
        "javascript": """/**
 * Binary Search in JavaScript / TypeScript
 * @param {number[]} arr - Sorted array of numbers
 * @param {number} target - Value to search for
 * @returns {number} Index of target or -1
 * Time Complexity: O(log n) | Space Complexity: O(1)
 */
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

// Example Execution
const sortedArray = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
const target = 23;
console.log(`Target ${target} found at index: ${binarySearch(sortedArray, target)}`);"""
    }

    selected_snippet = code_snippets.get(lang_lower, code_snippets["python"])
    demo_code_content = f"""### 💻 StudyGenie Code Mentor ({language} - {mode})
*(Demo Mode: To run live AI model generation, configure your Gemini API key in Settings)*

#### Problem Formulation:
`{prompt_text.strip()[:200]}`

---

#### Solution Code:
```{lang_lower}
{selected_snippet}
```

---

#### 🔍 Technical Breakdown:
1. **Divide and Conquer Strategy**: The problem space is partitioned into halves during each iteration.
2. **Overflow Prevention**: Computing `mid = left + (right - left) // 2` protects against standard 32-bit integer overflow in lower-level languages.
3. **Loop Invariant**: `arr[0..left-1] < target` and `arr[right+1..end] > target` remain true at all times.

---

#### ⏱️ Algorithmic Complexity:
* **Best Case**: $\\mathcal{{O}}(1)$ — Element found directly at middle index.
* **Average Case**: $\\mathcal{{O}}(\\log n)$ — Halves search space repeatedly.
* **Worst Case**: $\\mathcal{{O}}(\\log n)$ — Exhausts tree until single element remains.
* **Auxiliary Space**: $\\mathcal{{O}}(1)$ — Constant memory allocation."""
    return {
        "success": True,
        "content": demo_code_content,
        "is_demo": True,
        "notice": result.get("message")
    }

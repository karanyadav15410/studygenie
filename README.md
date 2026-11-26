# StudyGenie – AI-Powered Study Assistant
> *"Study Smarter. Learn Faster. Achieve More."*

StudyGenie is a modern, responsive, full-stack educational SaaS web application designed for college and university students. It empowers students to understand complex academic concepts, generate syllabus revision notes, extract insights from lecture PDFs, prepare for university examinations with interactive quizzes and 3D flashcards, and write/debug code across major programming languages using Generative AI.

---

## 🌟 Key Features & AI Workflows

### 1. 🤖 AI Academic Tutor
- **ChatGPT-Style Conversational Interface**: Maintains context across multiple follow-up questions.
- **4 Pedagogical Response Modes**:
  - `Beginner Explanation`: Zero jargon, intuitive analogies from fundamentals.
  - `Detailed Explanation`: Rigorous conceptual mechanisms, formal terminology, and theoretical proofs.
  - `Exam Preparation`: High-yield questions, marking schemes, mnemonics, and common exam traps.
  - `Real-World Examples`: Practical industry, engineering, and biological case studies.
- **Supported Disciplines**: Computer Science, C++, Python, Mathematics, Physics, Database Systems, Operating Systems, and more.
- **One-Click Actions**: Copy explanation, reset dialogue, or save full session directly to My Library.

### 2. 📝 AI Notes Generator
- **Structured Inputs**: Subject, Topic name, Academic level (High School, Undergraduate, Graduate, Ph.D.), Explanation style.
- **Publication-Grade Output**:
  - Executive summary & topic introduction
  - Formal definitions and core terminology
  - In-depth architectural / mathematical mechanism explanations
  - Theoretical invariants and key points
  - Concrete code / worked mathematical examples
  - Important formulas and complexity tables
  - High-yield quick revision checklist
  - University examination questions with model marking criteria
- **Interactive Controls**: Inline editable text mode, clipboard copying, permanent library persistence, and **direct PDF export** via jsPDF.

### 3. 📄 PDF Document Summarizer
- **Real Text Extraction Engine**: Uses `pypdf` on the backend to extract actual readable text layers.
- **Configurable Summary Detail**: Choose between *Short* (executive bullets), *Medium* (standard chapter breakdown), and *Detailed* (exhaustive revision guide).
- **Extracted Deliverables**: Core concepts, critical definitions, quick revision takeaways, and exam questions extracted directly from the uploaded text.
- **Validation & Error Handling**: Gracefully handles scanned/non-text PDFs, oversized documents, and corrupted files.

### 4. 🎯 Interactive AI Quiz Generator
- **Exam-Calibrated MCQs**: Generates multiple-choice questions with 4 distinct options based on subject, topic, and difficulty (Easy, Medium, Hard).
- **Interactive UI**:
  - Progress indicator & timer layout
  - Question-by-question navigation (Previous / Next)
  - Immediate selection and final quiz submission
  - Visual score banner with celebration confetti on high scores
  - Detailed answer rationales explaining why the correct choice is right and other choices are wrong
  - Save quiz scores and history to My Library

### 5. 🗂️ Active Recall 3D Flashcards
- **Spaced Repetition & Cognitive Recall**: Flip cards with authentic 3D CSS perspective animations.
- **Front / Back Cards**: Front displays prompt, term, or question; back reveals the formal definition.
- **Self-Assessment Rating**: Mark cards as *Understood* or *Needs Revision* with real-time deck mastery counters.
- **Deck Management**: Save full card sets to Library for recurring review.

### 6. 📅 AI Study Planner & Timetable
- **Algorithmic Schedule Optimization**: Enter subjects, examination dates, daily available study hours, and target grades.
- **Interactive Timetable**:
  - Day-by-day milestone tasks categorized by type (Concept Learning, Deep Work, Past Exam Practice, Active Recall).
  - Interactive task checkboxes to mark completion and build daily streaks.
  - Spaced repetition and cognitive science exam tips.

### 7. 💻 AI Code Assistant & Mentor
- **Supported Languages**: C, C++, Python, Java, JavaScript.
- **4 Programming Modes**:
  - `Generate Code`: Clean, idiomatic code with time and space complexity.
  - `Explain Code`: Step-by-step logic, loop invariants, and pointer mechanics.
  - `Debug & Fix`: Detects off-by-one errors, memory leaks, and race conditions.
  - `Time & Space Complexity`: Asymptotic Big-O proofs and auxiliary memory analysis.
- **Terminal UI**: Syntax-highlighted dark theme code block with copy action.

### 8. 📚 My Central Library
- Searchable repository storing all generated notes, PDF summaries, quiz score histories, flashcard decks, and AI tutor sessions.
- Filter by category tab (*Notes*, *Summaries*, *Flashcards*, *Quizzes*, *Plans*).
- Full-text search across titles, subjects, and content.
- Detailed modal preview, copy, export to PDF, and delete items.

### 9. ⚙️ Settings & Google Gemini Key Management
- Dark Mode / Light Mode toggle with persistence.
- Student profile customization (Name, Email, Major, Academic Level).
- **Dual AI Engine Support**:
  - **Live Google Gemini API**: Configure your free Gemini API key to run real-time Generative AI models (`gemini-2.0-flash`, `gemini-1.5-flash`).
  - **Full-Fidelity Demo Mode**: Built-in realistic academic simulation engine so the platform is 100% functional, testable, and presentable without requiring an API key.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, React Router v6, jsPDF, Canvas Confetti |
| **Backend** | Python 3, Flask, Flask-CORS, PyPDF, Requests, Werkzeug |
| **Generative AI** | Google Gemini API (REST v1beta with structured JSON schemas and markdown) |
| **Storage** | Local JSON persistence (`backend/data/library.json`) & Browser `localStorage` |
| **Design** | Notion & ChatGPT inspired, Deep Navy & Purple accents, Plus Jakarta Sans typography |

---

## 📂 Project Structure

```
studygenie/
├── backend/
│   ├── app.py                 # Flask server with API endpoints & static serving
│   ├── ai_service.py          # Google Gemini integration, prompts & smart fallback
│   ├── test_integration.py   # Full-stack automated integration test suite
│   ├── requirements.txt       # Python dependencies (flask, flask-cors, pypdf, requests)
│   ├── .env.example           # Environment template for GEMINI_API_KEY
│   ├── data/
│   │   └── library.json       # Persistent library database
│   └── uploads/               # Temporary storage for PDF extraction
├── frontend/
│   ├── package.json           # Frontend packages (react, lucide-react, jspdf, etc.)
│   ├── vite.config.js         # Vite configuration with /api backend proxy
│   ├── tailwind.config.js     # Tailwind design system, colors & 3D animations
│   ├── index.html             # HTML entry with Plus Jakarta Sans & Inter fonts
│   └── src/
│       ├── main.jsx           # React DOM root
│       ├── App.jsx            # Routing configuration
│       ├── index.css          # Tailwind base & 3D flip card animations
│       ├── components/
│       │   ├── Navbar.jsx     # Landing page top navigation
│       │   ├── Sidebar.jsx    # Responsive SaaS sidebar with streak counter
│       │   ├── Header.jsx     # Top bar with API status pill & theme toggle
│       │   ├── AppLayout.jsx  # Main application dashboard wrapper
│       │   └── ApiKeyModal.jsx # Gemini API key setup modal
│       ├── pages/
│       │   ├── LandingPage.jsx   # Hero, features, benefits, preview, FAQ, footer
│       │   ├── Dashboard.jsx     # Overview, stats, quick tools, current tasks
│       │   ├── AITutor.jsx       # ChatGPT-style tutor with 4 response modes
│       │   ├── NotesGenerator.jsx# Syllabus notes generator with PDF export
│       │   ├── PdfSummarizer.jsx # PDF text extraction and summarization
│       │   ├── QuizGenerator.jsx # Interactive 4-choice MCQ test engine
│       │   ├── Flashcards.jsx    # 3D flippable active recall cards
│       │   ├── StudyPlanner.jsx  # Day-by-day exam timetable & tracker
│       │   ├── CodeAssistant.jsx # C++, Python, Java programming mentor
│       │   ├── MyLibrary.jsx     # Searchable repository with PDF export & filters
│       │   └── Settings.jsx      # Profile, theme, and API key manager
│       ├── context/
│       │   ├── AuthContext.jsx   # Student state & API key store
│       │   ├── ThemeContext.jsx  # Dark/Light mode state
│       │   └── StudyContext.jsx  # Library CRUD & active study timetable
│       └── utils/
│           └── api.js            # Unified backend API client
└── README.md
```

---

## 🚀 Quickstart & Setup Guide

### Prerequisites
- **Python 3.10+** (Python 3.14 recommended)
- **Node.js 18+** & **npm**

---

### Step 1: Backend Setup

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. *(Optional)* Configure your Google Gemini API Key:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Add your Gemini API key obtained from [Google AI Studio](https://aistudio.google.com):
     ```env
     GEMINI_API_KEY=AIzaSyYourActualKeyHere
     PORT=5000
     ```
   *(Note: You can also enter the API key directly in the web UI Settings page at runtime!)*

4. Run the integration test suite to verify everything:
   ```bash
   python test_integration.py
   ```

5. Start the Flask backend:
   ```bash
   python app.py
   ```
   Backend will start on `http://127.0.0.1:5000`.

---

### Step 2: Frontend Setup

1. Open a second terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application will be live at **`http://localhost:3000`**.

---

### Step 3: Unified Single-Server Mode (Production)

The Flask backend is configured to automatically serve the production build of the React frontend directly from `frontend/dist`.

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Start Flask:
   ```bash
   cd ../backend
   python app.py
   ```
3. Open **`http://127.0.0.1:5000`** in your browser. The entire application (Landing Page, Dashboard, and all 8 AI tools) is served from this single port!

---

## 🎓 Academic Presentation Notes

This project is tailored for evaluation as a **B.Tech Computer Science / AI Final Year or Semester Project**:
- Demonstrates practical application of Generative AI in computer-aided learning.
- Incorporates active recall and spaced repetition learning theories.
- Demonstrates full-stack engineering standards: separated concerns, reusable component design, RESTful APIs, strict error boundaries, and defensive fallback architecture.

---

## 📜 License
MIT License. Built with ❤️ for students worldwide.

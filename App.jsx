import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { StudyProvider } from './context/StudyContext';

// Layout & Pages
import { AppLayout } from './components/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { AITutor } from './pages/AITutor';
import { NotesGenerator } from './pages/NotesGenerator';
import { PdfSummarizer } from './pages/PdfSummarizer';
import { QuizGenerator } from './pages/QuizGenerator';
import { Flashcards } from './pages/Flashcards';
import { StudyPlanner } from './pages/StudyPlanner';
import { CodeAssistant } from './pages/CodeAssistant';
import { MyLibrary } from './pages/MyLibrary';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StudyProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Student Application Dashboard & Tools */}
              <Route path="/app" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="tutor" element={<AITutor />} />
                <Route path="notes" element={<NotesGenerator />} />
                <Route path="pdf" element={<PdfSummarizer />} />
                <Route path="quiz" element={<QuizGenerator />} />
                <Route path="flashcards" element={<Flashcards />} />
                <Route path="planner" element={<StudyPlanner />} />
                <Route path="code" element={<CodeAssistant />} />
                <Route path="library" element={<MyLibrary />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </StudyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

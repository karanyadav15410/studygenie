import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  Sparkles,
  Key,
  Flame,
  Search,
  Bell
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const Header = ({ onOpenSidebar, onOpenApiKeyModal }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, geminiApiKey } = useAuth();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/app': return { title: 'Dashboard', subtitle: 'Overview of your learning progress' };
      case '/app/tutor': return { title: 'AI Academic Tutor', subtitle: 'Interactive step-by-step doubt resolution' };
      case '/app/notes': return { title: 'AI Notes Generator', subtitle: 'Comprehensive syllabus revision notes' };
      case '/app/pdf': return { title: 'PDF Summarizer', subtitle: 'Extract key points, questions, and summaries' };
      case '/app/quiz': return { title: 'AI Quiz Generator', subtitle: 'Practice multiple-choice questions & test concepts' };
      case '/app/flashcards': return { title: 'AI Flashcards', subtitle: 'Active recall cards with 3D flip animation' };
      case '/app/planner': return { title: 'AI Study Planner', subtitle: 'Personalized timetable and task tracker' };
      case '/app/code': return { title: 'AI Code Assistant', subtitle: 'Programming tutor for C++, Python, Java & JS' };
      case '/app/library': return { title: 'My Library', subtitle: 'Saved study notes, summaries, and assessments' };
      case '/app/settings': return { title: 'Settings', subtitle: 'Profile, preferences, and Gemini AI configuration' };
      default: return { title: 'StudyGenie', subtitle: 'AI-Powered Study Assistant' };
    }
  };

  const { title, subtitle } = getPageTitle(location.pathname);

  return (
    <header className="h-16 border-b border-slate-200 dark:border-navy-800 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 transition-colors">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
          className="md:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
            {title}
          </h1>
          <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* API Status Pill */}
        <button
          onClick={onOpenApiKeyModal}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition ${
            geminiApiKey
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20'
              : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 hover:bg-amber-500/20'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{geminiApiKey ? 'Gemini 2.0 Connected' : 'Demo Mode Active'}</span>
          <span className="sm:hidden">{geminiApiKey ? 'Gemini' : 'Demo'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 transition"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* User Mini Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
          {user.name.split(' ').map(n => n[0]).join('')}
        </div>
      </div>
    </header>
  );
};

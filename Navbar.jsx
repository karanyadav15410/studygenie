import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Sun, Moon, ArrowRight, BookOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { geminiApiKey } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-slate-200/80 dark:border-navy-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Study<span className="text-brand-600 dark:text-brand-400">Genie</span>
              </span>
              <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-brand-500/10 text-brand-600 dark:text-brand-400">
                AI Assistant
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Features</a>
            <a href="#how-it-works" className="hover:text-brand-600 dark:hover:text-brand-400 transition">How It Works</a>
            <a href="#benefits" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Benefits</a>
            <a href="#faq" className="hover:text-brand-600 dark:hover:text-brand-400 transition">FAQ</a>
          </div>

          {/* Right CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 transition"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/25 transition group"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

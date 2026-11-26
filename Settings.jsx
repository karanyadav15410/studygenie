import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Key,
  User,
  Moon,
  Sun,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../utils/api';

export const Settings = () => {
  const { user, updateUser, geminiApiKey, saveApiKey } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [inputKey, setInputKey] = useState(geminiApiKey || '');
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState(null);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [major, setMajor] = useState(user.major);
  const [academicLevel, setAcademicLevel] = useState(user.academicLevel);
  const [profileSaved, setProfileSaved] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUser({ name, email, major, academicLevel });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleTestAndSaveKey = async (e) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      saveApiKey('');
      setStatus({ type: 'success', message: 'Switched to Demo Mode.' });
      return;
    }

    setTesting(true);
    setStatus(null);
    try {
      const res = await api.validateKey(inputKey.trim());
      if (res.valid) {
        saveApiKey(inputKey.trim());
        setStatus({ type: 'success', message: 'Gemini API key is verified and operational!' });
      } else {
        setStatus({ type: 'error', message: res.message || 'Key validation failed.' });
      }
    } catch (err) {
      saveApiKey(inputKey.trim());
      setStatus({ type: 'success', message: 'Key saved locally.' });
    } finally {
      setTesting(false);
    }
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset demo statistics?")) {
      updateUser({
        streakDays: 7,
        totalStudyHours: 42.5,
        quizzesTaken: 14,
        flashcardsMastered: 128
      });
      alert("Study stats reset to default baseline.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl pb-12">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-navy-900 to-indigo-950 text-white shadow-xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md mb-3 border border-white/10">
            <SettingsIcon className="w-3.5 h-3.5 text-brand-300" />
            <span>Preferences & Configuration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Settings & AI Configuration
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Configure your student profile, customize appearance, and link your Google Gemini API key.
          </p>
        </div>
      </div>

      {/* Gemini AI Key Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Google Gemini API Key
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Provide your API key to enable live Generative AI (Gemini 2.0 / 1.5)
            </p>
          </div>
        </div>

        <form onSubmit={handleTestAndSaveKey} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              API Key
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {status && (
            <div className={`p-3.5 rounded-xl flex items-center gap-2.5 text-xs ${
              status.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
            }`}>
              {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
              <span>{status.message}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline font-semibold"
            >
              Get a free API key from Google AI Studio <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setInputKey('');
                  saveApiKey('');
                  setStatus({ type: 'success', message: 'Switched to Demo Mode.' });
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-navy-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 transition text-xs font-semibold"
              >
                Clear & Use Demo
              </button>

              <button
                type="submit"
                disabled={testing}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition disabled:opacity-50"
              >
                {testing ? 'Verifying...' : 'Validate & Save'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Student Profile Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Student Profile
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalize your university study context
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Major / Degree
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="e.g. Computer Science & Engineering"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Academic Level
              </label>
              <input
                type="text"
                value={academicLevel}
                onChange={(e) => setAcademicLevel(e.target.value)}
                placeholder="e.g. Undergraduate (Year 3)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {profileSaved && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Appearance & Reset Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Interface Theme
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Currently using <strong>{theme === 'dark' ? 'Dark' : 'Light'} Mode</strong>
          </p>
        </div>

        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-navy-800 transition"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Switch to Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-600" />
              <span>Switch to Dark Mode</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

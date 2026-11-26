import React, { useState } from 'react';
import { Key, CheckCircle, AlertTriangle, ExternalLink, X, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

export const ApiKeyModal = ({ isOpen, onClose }) => {
  const { geminiApiKey, saveApiKey } = useAuth();
  const [inputKey, setInputKey] = useState(geminiApiKey || '');
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', message }

  if (!isOpen) return null;

  const handleTestAndSave = async (e) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      saveApiKey('');
      setStatus({ type: 'success', message: 'Switched to Demo Mode with realistic responses.' });
      setTimeout(() => onClose(), 1000);
      return;
    }

    setTesting(true);
    setStatus(null);
    try {
      const res = await api.validateKey(inputKey.trim());
      if (res.valid) {
        saveApiKey(inputKey.trim());
        setStatus({ type: 'success', message: 'Gemini API key verified & activated successfully!' });
        setTimeout(() => onClose(), 1200);
      } else {
        setStatus({ type: 'error', message: res.message || 'Key validation failed. Please check key.' });
      }
    } catch (err) {
      // In case server has issues, still allow saving
      saveApiKey(inputKey.trim());
      setStatus({ type: 'success', message: 'API key saved locally. Will be used for requests.' });
      setTimeout(() => onClose(), 1200);
    } finally {
      setTesting(false);
    }
  };

  const handleUseDemo = () => {
    saveApiKey('');
    setInputKey('');
    setStatus({ type: 'success', message: 'Demo mode active. Curated academic responses enabled!' });
    setTimeout(() => onClose(), 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Google Gemini API Settings</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Power StudyGenie with live Generative AI</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          StudyGenie utilizes Google's Gemini models for real-time tutoring, note synthesis, and exam prep.
          You can provide your free API key or use the included full-fidelity <strong>Demo Mode</strong>.
        </p>

        <form onSubmit={handleTestAndSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Gemini API Key
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition font-mono"
            />
          </div>

          {status && (
            <div className={`p-3 rounded-xl flex items-center gap-2.5 text-xs ${
              status.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
            }`}>
              {status.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
              <span>{status.message}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline font-medium"
            >
              Get a free Gemini API key <ExternalLink className="w-3 h-3" />
            </a>
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Keys stored locally
            </span>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-navy-800">
            <button
              type="button"
              onClick={handleUseDemo}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-xl transition"
            >
              Use Demo Mode
            </button>
            <button
              type="submit"
              disabled={testing}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-brand-500/25 transition disabled:opacity-50"
            >
              {testing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Validating Key...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save & Connect API</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Code2,
  Sparkles,
  Copy,
  Check,
  Terminal,
  BookmarkPlus,
  Play,
  RotateCcw,
  Clock,
  Layers,
  Bug,
  BookOpen
} from 'lucide-react';
import { api } from '../utils/api';
import { useStudy } from '../context/StudyContext';

export const CodeAssistant = () => {
  const { addLibraryItem } = useStudy();

  const [language, setLanguage] = useState('Python');
  const [mode, setMode] = useState('Generate Code');
  const [prompt, setPrompt] = useState('Implement Binary Search on a sorted array and explain its asymptotic time and space complexity.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleRun = async (e) => {
    e?.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await api.generateCodeAssistance(language, prompt, mode);
      if (res && res.content) {
        setResult(res);
      }
    } catch (err) {
      alert("Error generating code: " + (err.message || "Failed to generate"));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.content) return;
    navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToLibrary = async () => {
    if (!result?.content) return;
    try {
      await addLibraryItem({
        type: 'note',
        title: `Code Mentor: ${language} (${mode})`,
        subject: `${language} Programming`,
        content: result.content,
        metadata: { language, mode }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert("Failed to save code to library.");
    }
  };

  const languagePresets = ['Python', 'C++', 'Java', 'C', 'JavaScript'];

  const modeOptions = [
    { name: 'Generate Code', desc: 'Write clean, idiomatic algorithms' },
    { name: 'Explain Code', desc: 'Step-by-step logic and invariants' },
    { name: 'Debug & Fix', desc: 'Detect runtime bugs & memory leaks' },
    { name: 'Time & Space Complexity', desc: 'Big-O proofs and auxiliary memory' }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-900 via-blue-900 to-navy-900 text-white shadow-xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Multi-Language Programming Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Code Assistant & Mentor
          </h2>
          <p className="mt-2 text-sm text-cyan-100/90 leading-relaxed">
            Write clean code, debug syntax errors, decipher legacy pointer logic in C++, or analyze Big-O complexity in Python, Java, and JavaScript.
          </p>
        </div>
      </div>

      {/* Language & Mode Selectors */}
      <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Language:
            </span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-navy-800 p-1 rounded-xl">
              {languagePresets.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    language === lang
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Task:
            </span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {modeOptions.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Prompt / Code Input */}
        <form onSubmit={handleRun} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Code Snippet or Prompt:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              placeholder={`Enter code to analyze or problem statement (e.g. "Implement LRU Cache in ${language}")...`}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-navy-800 focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing Code Analysis...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Execute Assistant</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Code Assistant Result */}
      {result && (
        <div className="rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 shadow-2xl overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>StudyGenie Code Engine • {language} ({mode})</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Output'}</span>
              </button>

              <button
                onClick={handleSaveToLibrary}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
              >
                {saved ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                <span>{saved ? 'Saved!' : 'Save Code'}</span>
              </button>
            </div>
          </div>

          {/* Code & Explanation Body */}
          <div className="p-6 sm:p-8 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-slate-300">
            {result.content}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  BookmarkPlus,
  BookOpen,
  Edit3,
  Eye,
  GraduationCap,
  Layers,
  ArrowRight
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { api } from '../utils/api';
import { useStudy } from '../context/StudyContext';

export const NotesGenerator = () => {
  const { addLibraryItem } = useStudy();

  const [subject, setSubject] = useState('Computer Science');
  const [topic, setTopic] = useState('B-Trees & Multi-Way Search Indexing');
  const [level, setLevel] = useState('Undergraduate');
  const [style, setStyle] = useState('Comprehensive');
  const [loading, setLoading] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState('');
  const [editableNotes, setEditableNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setGeneratedNotes('');
    setEditableNotes('');

    try {
      const res = await api.generateNotes(subject, topic, level, style);
      if (res && res.content) {
        setGeneratedNotes(res.content);
        setEditableNotes(res.content);
      }
    } catch (err) {
      alert("Error generating notes: " + (err.message || "Failed to generate"));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableNotes || generatedNotes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToLibrary = async () => {
    if (!editableNotes && !generatedNotes) return;
    try {
      await addLibraryItem({
        type: 'note',
        title: `${topic} (${subject})`,
        subject: subject,
        content: editableNotes || generatedNotes,
        metadata: { level, style }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert("Failed to save note to library.");
    }
  };

  const handleExportPdf = () => {
    const textToExport = editableNotes || generatedNotes;
    if (!textToExport) return;

    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text(`StudyGenie AI Notes: ${topic}`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Subject: ${subject} | Level: ${level} | Date: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.line(14, 32, 196, 32);

    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(textToExport, 180);
    doc.text(splitText, 14, 40);

    const filename = `${topic.toLowerCase().replace(/[^a-z0-9]/g, '_')}_notes.pdf`;
    doc.save(filename);
  };

  const topicPresets = [
    { subject: 'Computer Science', topic: 'B-Trees & Multi-Way Search Indexing' },
    { subject: 'Mathematics', topic: 'Fourier Transforms & Spectral Decomposition' },
    { subject: 'Operating Systems', topic: 'Virtual Memory & Page Replacement Algorithms' },
    { subject: 'Database Management', topic: 'ACID Properties & Two-Phase Locking' },
    { subject: 'Physics', topic: 'Thermodynamics: Carnot Engine & Entropy' }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-brand-900 to-indigo-900 text-white shadow-xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>AI Syllabus Revision Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Notes Generator
          </h2>
          <p className="mt-2 text-sm text-purple-100/90 leading-relaxed">
            Generate publication-grade, exam-ready study notes complete with formal definitions, deep explanations, formula tables, revision checklists, and sample university exam questions.
          </p>
        </div>
      </div>

      {/* Input Configuration Form */}
      <form onSubmit={handleGenerate} className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Computer Science, Physics..."
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Topic Name
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Dynamic Programming, Red-Black Trees..."
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Academic Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="High School">High School (AP / IB / 12th)</option>
              <option value="Undergraduate">Undergraduate (B.Tech / BS / College)</option>
              <option value="Graduate / Master">Graduate / Master's Level</option>
              <option value="Doctoral / Research">Advanced Research / Ph.D.</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Explanation Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="Comprehensive">Comprehensive Textbook Style</option>
              <option value="Exam-Focused">Exam-Focused High-Yield</option>
              <option value="Visual & Bulleted">Visual & Bulleted Quick Notes</option>
              <option value="Intuitive Analogies">Analogy & First-Principles</option>
            </select>
          </div>
        </div>

        {/* Preset Topic Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-navy-800">
          <span className="text-xs text-slate-400 font-medium">Quick suggestions:</span>
          {topicPresets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSubject(p.subject);
                setTopic(p.topic);
              }}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-300 transition"
            >
              {p.topic}
            </button>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-700 hover:to-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Synthesizing Academic Notes...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Notes</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generated Notes Output Panel */}
      {(generatedNotes || loading) && (
        <div className="rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm overflow-hidden transition">
          {/* Action Toolbar */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950/40 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {topic}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {subject} • {level} • {style}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  isEditing
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-navy-700 hover:bg-slate-50'
                }`}
              >
                {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                <span>{isEditing ? 'View Mode' : 'Edit Notes'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-700 hover:bg-slate-50 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveToLibrary}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-700 hover:bg-slate-50 transition"
              >
                {saved ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                <span>{saved ? 'Saved!' : 'Save to Library'}</span>
              </button>

              <button
                type="button"
                onClick={handleExportPdf}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Notes Content / Editor */}
          <div className="p-6 sm:p-8">
            {loading ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Google Gemini is analyzing syllabus concepts...
                </p>
                <p className="text-xs text-slate-400">
                  Formatting definitions, formulas, and examination marking criteria
                </p>
              </div>
            ) : isEditing ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Edit note content directly. Changes will be preserved when copying, saving, or exporting to PDF:
                </p>
                <textarea
                  value={editableNotes}
                  onChange={(e) => setEditableNotes(e.target.value)}
                  rows={22}
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-navy-800 focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed"
                />
              </div>
            ) : (
              <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {editableNotes || generatedNotes}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

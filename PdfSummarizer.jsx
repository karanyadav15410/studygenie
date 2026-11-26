import React, { useState, useRef } from 'react';
import {
  FileSearch,
  UploadCloud,
  FileText,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Download,
  Copy,
  Check,
  BookmarkPlus,
  Layers,
  ArrowRight
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { api } from '../utils/api';
import { useStudy } from '../context/StudyContext';

export const PdfSummarizer = () => {
  const { addLibraryItem } = useStudy();

  const [file, setFile] = useState(null);
  const [length, setLength] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (!selected.name.toLowerCase().endsWith('.pdf')) {
        setError("Only .pdf documents are supported. Please select a valid PDF.");
        setFile(null);
        return;
      }
      if (selected.size > 25 * 1024 * 1024) {
        setError("File size exceeds 25MB limit. Please upload a smaller chapter or slide deck.");
        setFile(null);
        return;
      }
      setFile(selected);
      setError(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      if (!dropped.name.toLowerCase().endsWith('.pdf')) {
        setError("Only .pdf documents are supported.");
        return;
      }
      setFile(dropped);
      setError(null);
    }
  };

  const handleSummarize = async (e) => {
    e?.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setSummaryData(null);

    try {
      const res = await api.summarizePdf(file, length);
      if (res && res.content) {
        setSummaryData(res);
      } else {
        throw new Error(res.error || "Unable to extract text or summarize document.");
      }
    } catch (err) {
      setError(err.message || "Failed to process PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summaryData?.content) return;
    navigator.clipboard.writeText(summaryData.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToLibrary = async () => {
    if (!summaryData?.content) return;
    try {
      await addLibraryItem({
        type: 'summary',
        title: `PDF Summary: ${summaryData.filename || file.name}`,
        subject: 'Document Summary',
        content: summaryData.content,
        metadata: {
          pages: summaryData.num_pages,
          lengthMode: length
        }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert("Failed to save summary to library.");
    }
  };

  const handleExportPdf = () => {
    if (!summaryData?.content) return;
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text(`StudyGenie PDF Summary`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Document: ${summaryData.filename || file?.name} | Pages: ${summaryData.num_pages || 'N/A'}`, 14, 28);
    doc.line(14, 32, 196, 32);

    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(summaryData.content, 180);
    doc.text(splitText, 14, 40);

    doc.save(`summary_${file?.name || 'document'}.pdf`);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-900 via-orange-900 to-navy-900 text-white shadow-xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Real PDF Text Extraction & Analysis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            PDF Document Summarizer
          </h2>
          <p className="mt-2 text-sm text-amber-100/90 leading-relaxed">
            Upload course lecture slides, textbook excerpts, or research papers. StudyGenie extracts readable text, identifies foundational principles, and creates revision questions.
          </p>
        </div>
      </div>

      {/* Upload & Config Area */}
      <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-6">
        {/* Dropzone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            file
              ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20'
              : 'border-slate-300 dark:border-navy-700 hover:border-brand-400 bg-slate-50/50 dark:bg-navy-950/40'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,application/pdf"
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-4">
            {file ? <FileText className="w-7 h-7" /> : <UploadCloud className="w-7 h-7" />}
          </div>

          {file ? (
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {file.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to analyze
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-brand-600 dark:text-brand-400 underline">
                Click to choose a different PDF
              </span>
            </div>
          ) : (
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Drag and drop your PDF here, or <span className="text-brand-600 dark:text-brand-400 underline">browse files</span>
              </p>
              <p className="text-xs text-slate-400 mt-1.5">
                Standard readable PDF files up to 25MB (Lecture slides, syllabi, chapters)
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Extraction Notice</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Options Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-navy-800">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Summary Detail:
            </span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-navy-800 p-1 rounded-xl text-xs font-medium">
              {['Short', 'Medium', 'Detailed'].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLength(l)}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    length === l
                      ? 'bg-white dark:bg-navy-900 text-brand-600 dark:text-brand-400 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSummarize}
            disabled={!file || loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Extracting & Summarizing...</span>
              </>
            ) : (
              <>
                <FileSearch className="w-4 h-4" />
                <span>Process & Summarize PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results View */}
      {summaryData && (
        <div className="rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm overflow-hidden transition">
          {/* Action Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950/40 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {summaryData.filename || file?.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {summaryData.num_pages} pages processed • {summaryData.extracted_chars} characters extracted • {length} summary
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-700 hover:bg-slate-50 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleSaveToLibrary}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-700 hover:bg-slate-50 transition"
              >
                {saved ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                <span>{saved ? 'Saved!' : 'Save to Library'}</span>
              </button>

              <button
                onClick={handleExportPdf}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Formatted Content */}
          <div className="p-6 sm:p-8">
            <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {summaryData.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

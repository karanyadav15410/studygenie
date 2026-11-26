import React, { useState } from 'react';
import {
  FolderHeart,
  Search,
  FileText,
  FileSearch,
  CheckSquare,
  Layers,
  CalendarDays,
  Trash2,
  Download,
  Copy,
  Check,
  Eye,
  Calendar,
  X
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useStudy } from '../context/StudyContext';

export const MyLibrary = () => {
  const { libraryItems, deleteLibraryItem, loadingLibrary } = useStudy();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const tabs = [
    { id: 'all', label: 'All Items' },
    { id: 'note', label: 'Notes' },
    { id: 'summary', label: 'PDF Summaries' },
    { id: 'flashcards', label: 'Flashcard Decks' },
    { id: 'quiz', label: 'Quiz Results' },
    { id: 'planner', label: 'Study Plans' }
  ];

  const filteredItems = libraryItems.filter((item) => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(item.content || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleCopyContent = (item) => {
    navigator.clipboard.writeText(item.content || '');
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportItemPdf = (item) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`StudyGenie: ${item.title}`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Subject: ${item.subject} | Date: ${new Date(item.date).toLocaleDateString()}`, 14, 28);
    doc.line(14, 32, 196, 32);

    const splitText = doc.splitTextToSize(item.content || '', 180);
    doc.text(splitText, 14, 40);
    doc.save(`${item.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-brand-900 to-purple-900 text-white shadow-xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md mb-3 border border-white/10">
            <FolderHeart className="w-3.5 h-3.5 text-indigo-300" />
            <span>Central Academic Repository</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            My Library
          </h2>
          <p className="mt-2 text-sm text-indigo-100/90 leading-relaxed">
            Search, review, edit, and organize all your AI-generated notes, summaries, active recall flashcards, and exam quizzes in one place.
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes, topics, or subjects..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Count pill */}
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Showing {filteredItems.length} of {libraryItems.length} items
          </span>
        </div>

        {/* Tab filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 border-t border-slate-100 dark:border-navy-800 pt-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Library Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
          <FolderHeart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No library items found
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {searchQuery ? 'Try adjusting your search query.' : 'Use any AI tool to generate and save study materials here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm hover:shadow-lg hover:border-brand-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-[10px] uppercase tracking-wider">
                    {item.type}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-brand-600 transition-colors leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 mb-3">
                  {item.subject}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-6 font-mono">
                  {item.content}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-navy-800">
                <button
                  onClick={() => setSelectedItem(item)}
                  className="flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopyContent(item)}
                    title="Copy Content"
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-lg transition"
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleExportItemPdf(item)}
                    title="Export PDF"
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-lg transition"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteLibraryItem(item.id)}
                    title="Delete Item"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 w-full max-w-3xl rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[85vh] flex flex-col relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4 pr-10">
              <span className="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-xs uppercase tracking-wider">
                {selectedItem.type}
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                {selectedItem.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedItem.subject} • Saved on {new Date(selectedItem.date).toLocaleDateString()}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-slate-50 dark:bg-navy-950/70 border border-slate-200 dark:border-navy-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans my-4">
              {selectedItem.content}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-navy-800">
              <button
                onClick={() => handleCopyContent(selectedItem)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
              <button
                onClick={() => handleExportItemPdf(selectedItem)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

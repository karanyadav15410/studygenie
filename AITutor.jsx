import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  BookmarkPlus,
  HelpCircle,
  Lightbulb,
  BookOpen,
  Code2,
  Atom,
  Sigma
} from 'lucide-react';
import { api } from '../utils/api';
import { useStudy } from '../context/StudyContext';

export const AITutor = () => {
  const { addLibraryItem } = useStudy();

  const [subject, setSubject] = useState('Computer Science');
  const [mode, setMode] = useState('Detailed Explanation');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I am your **StudyGenie Academic AI Tutor**.\n\nI can explain complex concepts step-by-step, illustrate real-world analogies, or drill high-yield examination questions across subjects like **Computer Science, Mathematics, Physics, and Engineering**.\n\nWhat topic would you like to explore today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [savedToLib, setSavedToLib] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input.trim() };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage(newHistory, subject, mode);
      if (res && res.content) {
        setMessages([...newHistory, { role: 'assistant', content: res.content, isDemo: res.is_demo }]);
      }
    } catch (err) {
      setMessages([
        ...newHistory,
        {
          role: 'assistant',
          content: `⚠️ **Error communicating with AI Tutor:** ${err.message || 'Please check your connection or Gemini API key.'}`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Conversation reset. Ready for a new topic in **${subject}** with **${mode}** mode!`
      }
    ]);
  };

  const handleSaveToLibrary = async () => {
    if (messages.length <= 1) return;
    try {
      const summaryTitle = `AI Tutor Session: ${subject} (${mode})`;
      const fullConvo = messages
        .map(m => `**${m.role === 'user' ? 'Student' : 'StudyGenie'}**:\n${m.content}`)
        .join('\n\n---\n\n');

      await addLibraryItem({
        type: 'note',
        title: summaryTitle,
        subject: subject,
        content: fullConvo
      });
      setSavedToLib(true);
      setTimeout(() => setSavedToLib(false), 2500);
    } catch (err) {
      alert("Failed to save session to library.");
    }
  };

  const subjectPresets = [
    { name: 'Computer Science', icon: Code2, sample: 'Explain Red-Black Tree rotation cases with a diagram' },
    { name: 'Mathematics', icon: Sigma, sample: 'How does Green\'s Theorem relate circulation to double integrals?' },
    { name: 'Physics', icon: Atom, sample: 'Derive the time-dependent Schrödinger equation simply' },
    { name: 'Python', icon: Code2, sample: 'Explain Python Generators, yield keyword, and memory efficiency' },
    { name: 'C++', icon: Code2, sample: 'Difference between std::move and std::forward with rvalue references' }
  ];

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col bg-white dark:bg-navy-900 rounded-3xl border border-slate-200/80 dark:border-navy-800 shadow-sm overflow-hidden transition-colors">
      {/* Top Header / Mode Selector */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          {/* Subject Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Subject:</span>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="Computer Science">Computer Science</option>
              <option value="C++ Programming">C++ Programming</option>
              <option value="Python Programming">Python Programming</option>
              <option value="Mathematics & Calculus">Mathematics & Calculus</option>
              <option value="Physics & Mechanics">Physics & Mechanics</option>
              <option value="Operating Systems">Operating Systems</option>
              <option value="Database Management">Database Management</option>
            </select>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-navy-800/80 p-1 rounded-xl">
            {['Beginner Explanation', 'Detailed Explanation', 'Exam Preparation', 'Real-World Examples'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  mode === m
                    ? 'bg-white dark:bg-navy-900 text-brand-600 dark:text-brand-400 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {m.replace(' Explanation', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveToLibrary}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700 transition"
          >
            {savedToLib ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
            <span>{savedToLib ? 'Saved to Library!' : 'Save Session'}</span>
          </button>

          <button
            onClick={handleResetChat}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-xl transition"
            title="Reset Chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={idx}
              className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isUser
                  ? 'bg-slate-800 text-white dark:bg-slate-700'
                  : 'bg-brand-600 text-white shadow-sm shadow-brand-500/25'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`group relative max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                isUser
                  ? 'bg-brand-600 text-white rounded-tr-none'
                  : 'bg-slate-50 dark:bg-navy-950/80 border border-slate-200/80 dark:border-navy-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
              }`}>
                {/* Content formatting */}
                <div className="whitespace-pre-wrap font-sans space-y-2">
                  {msg.content}
                </div>

                {/* Message action overlay */}
                {!isUser && (
                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-navy-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono text-[10px]">StudyGenie • {mode}</span>
                    <button
                      onClick={() => handleCopy(msg.content, idx)}
                      className="inline-flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 dark:bg-navy-950/80 border border-slate-200/80 dark:border-navy-800 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-slate-400 ml-2">StudyGenie is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Presets */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 border-t border-slate-100 dark:border-navy-800/80 bg-slate-50/50 dark:bg-navy-950/30 overflow-x-auto flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0">Try asking:</span>
          {subjectPresets.map((sp, i) => (
            <button
              key={i}
              onClick={() => {
                setSubject(sp.name);
                setInput(sp.sample);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-slate-600 dark:text-slate-300 hover:border-brand-500/50 hover:text-brand-600 dark:hover:text-brand-400 whitespace-nowrap transition"
            >
              {sp.sample}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-slate-100 dark:border-navy-800 bg-white dark:bg-navy-900 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask anything about ${subject}... (e.g. "Explain with step-by-step proof")`}
          className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs sm:text-sm border border-slate-200 dark:border-navy-800 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-3 sm:px-5 sm:py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white font-semibold flex items-center justify-center gap-2 transition shadow-md shadow-brand-500/25 shrink-0"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline text-xs">Send</span>
        </button>
      </form>
    </div>
  );
};

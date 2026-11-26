import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Bot,
  FileText,
  FileSearch,
  CheckSquare,
  Layers,
  CalendarDays,
  Code2,
  FolderHeart,
  Flame,
  Clock,
  Award,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStudy } from '../context/StudyContext';

export const Dashboard = () => {
  const { user, geminiApiKey } = useAuth();
  const { libraryItems, activePlan, togglePlanTask, recentSubjects } = useStudy();

  const quickTools = [
    { name: 'AI Tutor', desc: 'Ask doubts step-by-step', icon: Bot, path: '/app/tutor', color: 'from-blue-600 to-indigo-600' },
    { name: 'Notes Generator', desc: 'Generate revision sheets', icon: FileText, path: '/app/notes', color: 'from-purple-600 to-pink-600' },
    { name: 'PDF Summarizer', desc: 'Upload slides & chapters', icon: FileSearch, path: '/app/pdf', color: 'from-amber-600 to-orange-600' },
    { name: 'Quiz Generator', desc: 'Practice custom MCQs', icon: CheckSquare, path: '/app/quiz', color: 'from-emerald-600 to-teal-600' },
    { name: 'Flashcards', desc: '3D active recall decks', icon: Layers, path: '/app/flashcards', color: 'from-violet-600 to-indigo-600' },
    { name: 'Study Planner', desc: 'Exam timetable & tasks', icon: CalendarDays, path: '/app/planner', color: 'from-rose-600 to-red-600' },
    { name: 'Code Assistant', desc: 'Debug & explain code', icon: Code2, path: '/app/code', color: 'from-cyan-600 to-blue-600' },
    { name: 'My Library', desc: 'Search saved materials', icon: FolderHeart, path: '/app/library', color: 'from-indigo-600 to-brand-600' },
  ];

  // Default tasks if no active study plan is generated yet
  const defaultTasks = [
    { id: 'dt-1', time: '10:00 AM', subject: 'Computer Science', topic: 'Review Red-Black Tree Rotation Cases', completed: true },
    { id: 'dt-2', time: '02:00 PM', subject: 'Operating Systems', topic: 'Read Banker\'s Algorithm & Complete Quiz', completed: false },
    { id: 'dt-3', time: '04:30 PM', subject: 'Mathematics', topic: 'Practice Taylor Series Derivations', completed: false }
  ];

  const currentTasks = (activePlan && activePlan.days && activePlan.days[0]?.tasks) || defaultTasks;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-900 to-navy-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-brand-300" />
            <span>AI-Powered Academic Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h2>
          <p className="mt-2 text-sm text-indigo-100/90 leading-relaxed">
            You're on a <span className="font-bold text-amber-300">{user.streakDays}-day learning streak</span>.
            Your next exam milestone is in <span className="font-bold text-white">8 days</span>. Let's conquer your study goals!
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/app/tutor"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-brand-900 font-bold text-xs hover:bg-brand-50 shadow-md transition"
            >
              <Bot className="w-4 h-4 text-brand-600" />
              <span>Ask AI Tutor</span>
            </Link>
            <Link
              to="/app/quiz"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-md border border-white/20 transition"
            >
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <span>Practice Daily Quiz</span>
            </Link>
          </div>
        </div>

        {/* Decorative graphic */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none flex items-center justify-center">
          <Sparkles className="w-64 h-64 text-brand-400" />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/90 dark:border-navy-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Current Streak</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {user.streakDays} <span className="text-xs font-normal text-slate-400">days</span>
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> Top 5% among peers
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/90 dark:border-navy-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Study Hours</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {user.totalStudyHours} <span className="text-xs font-normal text-slate-400">hrs</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            +4.5 hrs this week
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/90 dark:border-navy-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Quizzes Completed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {user.quizzesTaken}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            86% Avg. Score
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/90 dark:border-navy-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Cards Mastered</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {user.flashcardsMastered}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Across 5 study decks
          </p>
        </div>
      </div>

      {/* Quick Launch AI Tools */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              AI Study Tools
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select an assistant to begin learning
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickTools.map((t, idx) => {
            const Icon = t.icon;
            return (
              <Link
                key={idx}
                to={t.path}
                className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 hover:border-brand-500/50 hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${t.color} flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {t.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400">
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Subject Progress & Recent Materials */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recently Accessed Subjects */}
          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Recently Accessed Subjects
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Current semester syllabus coverage
                </p>
              </div>
              <Link to="/app/notes" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                Generate Notes
              </Link>
            </div>

            <div className="space-y-4">
              {recentSubjects.map((sub, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-100 dark:border-navy-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{sub.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{sub.topic}</p>
                    </div>
                    <span className="text-xs font-extrabold text-brand-600 dark:text-brand-400">{sub.progress}%</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-navy-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 transition-all duration-500"
                      style={{ width: `${sub.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Saved Items from Library */}
          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Recent Library Materials
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Quick access to your saved notes & assessments
                </p>
              </div>
              <Link to="/app/library" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                View All ({libraryItems.length})
              </Link>
            </div>

            {libraryItems.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No items in your library yet. Generate some notes or flashcards to see them here!
              </div>
            ) : (
              <div className="space-y-3">
                {libraryItems.slice(0, 3).map((item) => (
                  <Link
                    key={item.id}
                    to="/app/library"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-navy-950/60 border border-slate-100 dark:border-navy-800/80 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                        {item.type === 'note' && <FileText className="w-4 h-4" />}
                        {item.type === 'flashcards' && <Layers className="w-4 h-4" />}
                        {item.type === 'quiz' && <CheckSquare className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 transition-colors">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {item.subject} • {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-brand-600 transition" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Upcoming Tasks & Study Timetable */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Today's Study Plan
                </h3>
              </div>
              <Link to="/app/planner" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                Edit Plan
              </Link>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Tick tasks as you complete them to maintain your streak:
            </p>

            <div className="space-y-3">
              {currentTasks.map((t, idx) => (
                <div
                  key={t.id || idx}
                  onClick={() => togglePlanTask(0, t.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                    t.completed
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-400'
                      : 'bg-slate-50 dark:bg-navy-950/60 border-slate-200/80 dark:border-navy-800 text-slate-800 dark:text-slate-200 hover:border-brand-500/40'
                  }`}
                >
                  <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                    t.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-300 dark:border-navy-700'
                  }`}>
                    {t.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold leading-tight ${t.completed ? 'line-through text-slate-400' : ''}`}>
                      {t.topic}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {t.time} • {t.subject}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/app/planner"
              className="mt-5 w-full block text-center py-2 px-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-200 transition"
            >
              Open Full Timetable
            </Link>
          </div>

          {/* Quick Study Tip Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-brand-500/10 border border-brand-500/20 text-slate-800 dark:text-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Study Tip of the Day</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              "When learning recursive algorithms or math proofs, draw the recursion tree or call stack on paper. Hand-tracing edge states boosts retention by 40%."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

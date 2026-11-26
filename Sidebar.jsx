import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  FileText,
  FileSearch,
  CheckSquare,
  Layers,
  CalendarDays,
  Code2,
  FolderHeart,
  Settings,
  Sparkles,
  Flame,
  Key,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ onOpenApiKeyModal }) => {
  const { user, geminiApiKey, isDemoMode } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
    { name: 'AI Tutor', path: '/app/tutor', icon: Bot, badge: 'Popular' },
    { name: 'Notes Generator', path: '/app/notes', icon: FileText },
    { name: 'PDF Summarizer', path: '/app/pdf', icon: FileSearch },
    { name: 'Quiz Generator', path: '/app/quiz', icon: CheckSquare },
    { name: 'Flashcards', path: '/app/flashcards', icon: Layers },
    { name: 'Study Planner', path: '/app/planner', icon: CalendarDays },
    { name: 'Code Assistant', path: '/app/code', icon: Code2 },
    { name: 'My Library', path: '/app/library', icon: FolderHeart },
    { name: 'Settings', path: '/app/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col bg-white dark:bg-navy-900 border-r border-slate-200 dark:border-navy-800 transition-colors select-none z-30 shrink-0">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 dark:border-navy-800">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
              Study<span className="text-brand-600 dark:text-brand-400">Genie</span>
            </span>
          </div>
        </Link>
      </div>

      {/* AI Key Status Indicator */}
      <div className="px-4 py-3 border-b border-slate-100 dark:border-navy-800/60">
        <button
          onClick={onOpenApiKeyModal}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs bg-slate-50 hover:bg-slate-100 dark:bg-navy-950/60 dark:hover:bg-navy-800/80 border border-slate-200/80 dark:border-navy-800 transition group"
        >
          <div className="flex items-center gap-2 text-left">
            <span className={`w-2 h-2 rounded-full ${geminiApiKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200 leading-none">
                {geminiApiKey ? 'Gemini AI Active' : 'Demo AI Engine'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {geminiApiKey ? 'Model: Gemini 2.0 / 1.5' : 'Click to add API key'}
              </p>
            </div>
          </div>
          <Key className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-500 transition-colors" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Core Tools
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/25 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-navy-800/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded bg-brand-500/20 text-brand-700 dark:text-brand-300">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Student Profile Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-navy-800">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200/80 dark:border-navy-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs shrink-0">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {user.major}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-bold shrink-0">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{user.streakDays}d</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

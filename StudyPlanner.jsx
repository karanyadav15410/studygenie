import React, { useState } from 'react';
import {
  CalendarDays,
  Sparkles,
  CheckCircle2,
  Clock,
  Calendar,
  BookmarkPlus,
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { api } from '../utils/api';
import { useStudy } from '../context/StudyContext';

export const StudyPlanner = () => {
  const { activePlan, saveActivePlan, togglePlanTask, addLibraryItem } = useStudy();

  const [subjects, setSubjects] = useState('Computer Science, Operating Systems, Mathematics');
  const [examDates, setExamDates] = useState('Midterms in 2 weeks (Dec 10 - Dec 18)');
  const [dailyHours, setDailyHours] = useState(4.0);
  const [goals, setGoals] = useState('Score 90%+ in OS and finish all past question papers');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGeneratePlan = async (e) => {
    e?.preventDefault();
    if (!subjects.trim()) return;

    setLoading(true);
    try {
      const res = await api.generateStudyPlan(subjects, examDates, dailyHours, goals);
      if (res && res.plan) {
        saveActivePlan(res.plan);
      }
    } catch (err) {
      alert("Error generating study plan: " + (err.message || "Failed to generate"));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToLibrary = async () => {
    if (!activePlan) return;
    try {
      await addLibraryItem({
        type: 'planner',
        title: activePlan.title || `Study Plan: ${subjects}`,
        subject: 'Timetable',
        content: JSON.stringify(activePlan, null, 2),
        metadata: {
          daily_hours: dailyHours,
          overview: activePlan.overview
        }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert("Failed to save plan to library.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-900 via-pink-900 to-navy-900 text-white shadow-xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-rose-300" />
            <span>Algorithmic Schedule Optimization</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Study Planner & Timetable
          </h2>
          <p className="mt-2 text-sm text-rose-100/90 leading-relaxed">
            Generate an exam-calibrated weekly study roadmap. Balances deep work, active recall, problem-solving drills, and revision buffer sessions based on your target exam dates.
          </p>
        </div>
      </div>

      {/* Plan Form */}
      <form onSubmit={handleGeneratePlan} className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Target Subjects
            </label>
            <input
              type="text"
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
              placeholder="e.g. Data Structures, Calculus, Physics"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Exam Timeline
            </label>
            <input
              type="text"
              value={examDates}
              onChange={(e) => setExamDates(e.target.value)}
              placeholder="e.g. Final exams start Dec 15"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Daily Hours Available
            </label>
            <select
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value={2.0}>2 Hours / day (Moderate)</option>
              <option value={3.5}>3.5 Hours / day (Steady Pace)</option>
              <option value={5.0}>5 Hours / day (Intensive Prep)</option>
              <option value={7.0}>7 Hours / day (Crunch Mode)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Primary Goal
            </label>
            <input
              type="text"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="e.g. Top grade, revise weak areas"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-navy-800">
          <button
            type="submit"
            disabled={loading || !subjects.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-sm shadow-lg shadow-pink-500/25 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Computing Optimal Schedule...</span>
              </>
            ) : (
              <>
                <CalendarDays className="w-4 h-4" />
                <span>Generate Timetable</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Active Timetable View */}
      {activePlan && (
        <div className="space-y-6">
          {/* Header Summary */}
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {activePlan.title || 'Personalized Exam Timetable'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {activePlan.overview}
              </p>
            </div>

            <button
              onClick={handleSaveToLibrary}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-200 transition shrink-0"
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>{saved ? 'Saved!' : 'Save Plan'}</span>
            </button>
          </div>

          {/* Daily Schedule Breakdown */}
          <div className="space-y-4">
            {activePlan.days && activePlan.days.map((dayPlan, dayIdx) => (
              <div
                key={dayIdx}
                className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-navy-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs">
                      {dayIdx + 1}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {dayPlan.day}
                    </h4>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 font-semibold">
                    Focus: {dayPlan.focus_subject}
                  </span>
                </div>

                {/* Tasks List */}
                <div className="space-y-2.5">
                  {dayPlan.tasks && dayPlan.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => togglePlanTask(dayIdx, task.id)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                        task.completed
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-400'
                          : 'bg-slate-50 dark:bg-navy-950/60 border-slate-100 dark:border-navy-800/80 hover:border-brand-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                          task.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900'
                        }`}>
                          {task.completed && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className={`text-xs font-bold leading-tight ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                            {task.topic}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {task.time} • {task.subject}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-200/60 dark:bg-navy-800 text-slate-600 dark:text-slate-400 shrink-0">
                        {task.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Academic Revision Tips */}
          {activePlan.revision_tips && (
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200 dark:border-navy-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Recommended Exam Strategy
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {activePlan.revision_tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

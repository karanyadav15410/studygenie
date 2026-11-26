import React, { useState } from 'react';
import {
  CheckSquare,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Award,
  HelpCircle,
  BookmarkPlus,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../utils/api';
import { useStudy } from '../context/StudyContext';

export const QuizGenerator = () => {
  const { addLibraryItem } = useStudy();

  const [subject, setSubject] = useState('Computer Science');
  const [topic, setTopic] = useState('Data Structures & Algorithms');
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState('Medium');
  const [loading, setLoading] = useState(false);

  // Quiz execution state
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionIdx]: selectedOptionIdx }
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setQuestions([]);
    setCurrentIndex(0);
    setUserAnswers({});
    setQuizSubmitted(false);

    try {
      const res = await api.generateQuiz(subject, topic, count, difficulty);
      if (res && res.questions && res.questions.length > 0) {
        setQuestions(res.questions);
      } else {
        throw new Error("No questions returned from quiz generator.");
      }
    } catch (err) {
      alert("Error generating quiz: " + (err.message || "Failed to generate"));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qIdx, optIdx) => {
    if (quizSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [qIdx]: optIdx
    }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    const finalScore = calculateScore();
    const ratio = finalScore / questions.length;

    if (ratio >= 0.7) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleSaveQuizResults = async () => {
    if (questions.length === 0) return;
    const finalScore = calculateScore();
    try {
      await addLibraryItem({
        type: 'quiz',
        title: `Quiz: ${topic} (${difficulty})`,
        subject: subject,
        content: `Score: ${finalScore}/${questions.length} (${Math.round((finalScore / questions.length) * 100)}%)\nTopic: ${topic}\nDifficulty: ${difficulty}`,
        metadata: {
          score: `${finalScore}/${questions.length}`,
          difficulty,
          questions
        }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert("Failed to save quiz to library.");
    }
  };

  const currentQ = questions[currentIndex];
  const score = calculateScore();
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-navy-900 text-white shadow-xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Interactive MCQ Examination Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Quiz Generator
          </h2>
          <p className="mt-2 text-sm text-emerald-100/90 leading-relaxed">
            Generate custom exam-level multiple choice questions with 4 answer options. Test your comprehension, receive instant scoring, and review step-by-step answer rationales.
          </p>
        </div>
      </div>

      {/* Quiz Config Form */}
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
              placeholder="e.g. Computer Science"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Dynamic Programming"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Questions Count
            </label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value={5}>5 Questions (Quick Test)</option>
              <option value={8}>8 Questions (Standard Drill)</option>
              <option value={10}>10 Questions (Full Assessment)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="Easy">Easy (Fundamental Definitions)</option>
              <option value="Medium">Medium (Application & Invariants)</option>
              <option value="Hard">Hard (University Exam Tough)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-navy-800">
          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-teal-500/25 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Exam Questions...</span>
              </>
            ) : (
              <>
                <CheckSquare className="w-4 h-4" />
                <span>Create Interactive Quiz</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Interactive Quiz Runner */}
      {questions.length > 0 && (
        <div className="space-y-6">
          {/* Quiz Card */}
          <div className="rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm p-6 sm:p-8">
            {/* Header / Progress Bar */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300">
                {difficulty} Level
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-navy-800 mb-8 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Prompt */}
            <div className="mb-8">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            {/* 4 Answer Options */}
            <div className="space-y-3 mb-8">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentIndex] === optIdx;
                const isCorrect = optIdx === currentQ.correctIndex;
                const showValidation = quizSubmitted;

                let optClass = 'border-slate-200 dark:border-navy-700 bg-slate-50/60 dark:bg-navy-950/60 text-slate-800 dark:text-slate-200 hover:border-brand-500/40';

                if (isSelected && !showValidation) {
                  optClass = 'border-brand-600 bg-brand-500/10 text-brand-900 dark:text-brand-300 font-semibold';
                }

                if (showValidation) {
                  if (isCorrect) {
                    optClass = 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold';
                  } else if (isSelected && !isCorrect) {
                    optClass = 'border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-300 font-bold';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(currentIndex, optIdx)}
                    disabled={quizSubmitted}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center justify-between ${optClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {showValidation && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    )}
                    {showValidation && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after submit */}
            {quizSubmitted && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950/80 border border-slate-200 dark:border-navy-800 text-xs text-slate-700 dark:text-slate-300 space-y-1 mb-8">
                <div className="flex items-center gap-1.5 font-bold text-brand-600 dark:text-brand-400">
                  <HelpCircle className="w-4 h-4" />
                  <span>Answer Explanation:</span>
                </div>
                <p className="leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}

            {/* Navigation & Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-navy-800">
              <button
                type="button"
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 disabled:opacity-30 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-2">
                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : !quizSubmitted ? (
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/25 transition"
                  >
                    <Award className="w-4 h-4" />
                    <span>Submit Quiz</span>
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {/* Performance Summary Banner */}
          {quizSubmitted && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5 text-center sm:text-left">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center text-xl font-extrabold shadow-lg shrink-0">
                  {score}/{questions.length}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    {percentage >= 70 ? 'Excellent Mastery! 🎉' : 'Keep Practicing! 💪'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    You scored {percentage}% accuracy across {questions.length} questions in {topic}.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveQuizResults}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-200 transition"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>{saved ? 'Saved!' : 'Save Result'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleGenerate}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>New Quiz</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

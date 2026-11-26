import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  BookmarkPlus,
  RotateCcw,
  BookOpen,
  ThumbsUp,
  RefreshCw
} from 'lucide-react';
import { api } from '../utils/api';
import { useStudy } from '../context/StudyContext';

export const Flashcards = () => {
  const { addLibraryItem } = useStudy();

  const [topic, setTopic] = useState('Operating Systems: Concurrency & Semaphores');
  const [contextText, setContextText] = useState('');
  const [count, setCount] = useState(8);
  const [loading, setLoading] = useState(false);

  // Deck runner state
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [statusMap, setStatusMap] = useState({}); // { [cardId]: 'understood' | 'revision' }
  const [saved, setSaved] = useState(false);

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setCards([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setStatusMap({});

    try {
      const res = await api.generateFlashcards(topic, contextText, count);
      if (res && res.flashcards && res.flashcards.length > 0) {
        setCards(res.flashcards);
      } else {
        throw new Error("No flashcards returned.");
      }
    } catch (err) {
      alert("Error generating flashcards: " + (err.message || "Failed to generate"));
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const markStatus = (type) => {
    const cardId = cards[currentIndex]?.id || currentIndex;
    setStatusMap(prev => ({ ...prev, [cardId]: type }));
    handleNext();
  };

  const handleSaveDeck = async () => {
    if (cards.length === 0) return;
    try {
      await addLibraryItem({
        type: 'flashcards',
        title: `Flashcards: ${topic}`,
        subject: 'Revision Cards',
        content: `Deck containing ${cards.length} active recall cards on ${topic}.`,
        metadata: {
          cards: cards
        }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert("Failed to save flashcards to library.");
    }
  };

  const currentCard = cards[currentIndex];
  const understoodCount = Object.values(statusMap).filter(v => v === 'understood').length;
  const revisionCount = Object.values(statusMap).filter(v => v === 'revision').length;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-900 to-navy-900 text-white shadow-xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-violet-300" />
            <span>Spaced Repetition & Active Recall</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Flashcard Generator
          </h2>
          <p className="mt-2 text-sm text-violet-100/90 leading-relaxed">
            Turn syllabus topics or study notes into interactive 3D flippable flashcard decks. Train active recall, flag items needing revision, and master key definitions.
          </p>
        </div>
      </div>

      {/* Generator Form */}
      <form onSubmit={handleGenerate} className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Topic or Subject Matter
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Operating Systems: Concurrency & Semaphores"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Card Count
            </label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value={6}>6 Cards (Quick Drill)</option>
              <option value={8}>8 Cards (Standard Deck)</option>
              <option value={12}>12 Cards (Mastery Deck)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-navy-800">
          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Crafting Flashcards...</span>
              </>
            ) : (
              <>
                <Layers className="w-4 h-4" />
                <span>Generate Flashcard Deck</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Flashcard 3D Interactive Deck */}
      {cards.length > 0 && currentCard && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Deck Stats Bar */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Card {currentIndex + 1} of {cards.length}</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> {understoodCount} Understood
              </span>
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-3.5 h-3.5" /> {revisionCount} Review
              </span>
            </div>
          </div>

          {/* 3D Flip Card Container */}
          <div
            onClick={handleFlip}
            className="perspective-1000 w-full h-80 sm:h-96 cursor-pointer select-none group"
          >
            <div
              className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT SIDE */}
              <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl bg-white dark:bg-navy-900 border-2 border-slate-200 dark:border-navy-800 p-8 flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-xs uppercase tracking-wider">
                    {currentCard.category || 'Term & Concept'}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <RotateCw className="w-3 h-3" /> Click to flip
                  </span>
                </div>

                <div className="my-auto text-center px-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Prompt / Term</p>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
                    {currentCard.front}
                  </h3>
                </div>

                <div className="text-center text-[11px] text-slate-400">
                  Tap anywhere on card to reveal explanation
                </div>
              </div>

              {/* BACK SIDE */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl bg-gradient-to-br from-indigo-950 to-slate-900 border-2 border-indigo-500/30 p-8 flex flex-col justify-between text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs uppercase tracking-wider">
                    Detailed Definition
                  </span>
                  <span className="text-xs text-indigo-300 flex items-center gap-1">
                    <RotateCw className="w-3 h-3" /> Click to flip
                  </span>
                </div>

                <div className="my-auto text-center px-4">
                  <p className="text-sm sm:text-base leading-relaxed text-indigo-100 font-medium">
                    {currentCard.back}
                  </p>
                </div>

                <div className="text-center text-[11px] text-indigo-300">
                  Rate your recall below to track progress
                </div>
              </div>
            </div>
          </div>

          {/* Assessment & Rating Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => markStatus('revision')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold transition"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Needs Revision</span>
            </button>

            <button
              onClick={() => markStatus('understood')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Understood</span>
            </button>
          </div>

          {/* Deck Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-navy-800">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 disabled:opacity-30 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Card</span>
            </button>

            <button
              onClick={handleSaveDeck}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition"
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>{saved ? 'Saved!' : 'Save Deck'}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === cards.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 disabled:opacity-30 transition"
            >
              <span>Next Card</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

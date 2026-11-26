import React, { useState } from 'react';
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
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Star,
  Zap,
  GraduationCap,
  TrendingUp,
  BrainCircuit,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { Navbar } from '../components/Navbar';

export const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const features = [
    {
      icon: Bot,
      title: 'AI Academic Tutor',
      desc: 'ChatGPT-style interactive dialogue with 4 customized learning modes: Beginner, Detailed, Exam Prep, and Real-World Examples.',
      link: '/app/tutor',
      color: 'from-blue-600 to-indigo-600'
    },
    {
      icon: FileText,
      title: 'AI Notes Generator',
      desc: 'Generate comprehensive, exam-ready notes complete with definitions, detailed mechanisms, formulas, revision checklists, and sample exam questions.',
      link: '/app/notes',
      color: 'from-purple-600 to-pink-600'
    },
    {
      icon: FileSearch,
      title: 'PDF Summarizer',
      desc: 'Upload lecture slides or textbook chapters. Extracts readable text, provides customizable summaries, and generates test questions from your material.',
      link: '/app/pdf',
      color: 'from-amber-600 to-orange-600'
    },
    {
      icon: CheckSquare,
      title: 'AI Quiz Generator',
      desc: 'Practice MCQs customized by subject, topic, and difficulty. Immediate scoring, step-by-step rationales, and mistake reviews.',
      link: '/app/quiz',
      color: 'from-emerald-600 to-teal-600'
    },
    {
      icon: Layers,
      title: 'Active Recall Flashcards',
      desc: 'Master tough concepts with 3D flip animated flashcards. Track understood terms vs items needing revision.',
      link: '/app/flashcards',
      color: 'from-violet-600 to-indigo-600'
    },
    {
      icon: CalendarDays,
      title: 'AI Study Planner',
      desc: 'Enter your subjects, exam dates, and daily study hours to receive a realistic, adaptive timetable with milestone checklists.',
      link: '/app/planner',
      color: 'from-rose-600 to-red-600'
    },
    {
      icon: Code2,
      title: 'Code Assistant',
      desc: 'Specialized programming tutor for C, C++, Python, Java, and JavaScript. Explains logic, identifies bugs, and breaks down Big-O complexity.',
      link: '/app/code',
      color: 'from-cyan-600 to-blue-600'
    },
    {
      icon: FolderHeart,
      title: 'My Central Library',
      desc: 'Save and organize all your AI-generated notes, summaries, flashcard decks, and quiz records with instant full-text search.',
      link: '/app/library',
      color: 'from-indigo-600 to-brand-600'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Select Subject & Goal',
      desc: 'Choose from subjects like Computer Science, Mathematics, Physics, or upload your syllabus PDFs directly.'
    },
    {
      step: '02',
      title: 'Generative AI Synthesizes Knowledge',
      desc: 'Google Gemini analyzes academic material to produce structured notes, worked code, or interactive quizzes.'
    },
    {
      step: '03',
      title: 'Master Concepts & Ace Exams',
      desc: 'Practice with active recall flashcards, track your daily schedule, and review mistakes with step-by-step tutor guidance.'
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: '4x Faster Syllabus Coverage',
      desc: 'Condense dense 50-page lecture slides into actionable revision sheets in seconds without missing key definitions.'
    },
    {
      icon: BrainCircuit,
      title: 'Active Recall Retention',
      desc: 'Spaced repetition flashcards and diagnostic quizzes scientifically reinforce long-term memory.'
    },
    {
      icon: Clock,
      title: '24/7 Personalized AI Tutor',
      desc: 'Never get stuck on a difficult calculus derivation or C++ pointer concept at 2 AM before an exam.'
    },
    {
      icon: ShieldCheck,
      title: 'Exam-Oriented Focus',
      desc: 'Every note and quiz is structured according to university grading criteria and standard marking schemes.'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'B.Tech Computer Science, 3rd Year',
      university: 'IIT Delhi',
      comment: 'StudyGenie turned my exam preparation around. The C++ code mentor and algorithmic complexity breakdowns made Data Structures intuitive and fun!',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
    },
    {
      name: 'Marcus Vance',
      role: 'Software Engineering Major',
      university: 'Stanford University',
      comment: 'The PDF summarizer extracts actual core topics instead of generic fluff. The generated flashcard decks saved me at least 15 hours during midterms.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
    },
    {
      name: 'Sophia Chen',
      role: 'Applied Mathematics & Physics',
      university: 'UC Berkeley',
      comment: 'The 4 tutor modes are brilliant. Having the AI switch from a beginner analogy to rigorous step-by-step proofs gave me total clarity.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80'
    }
  ];

  const faqs = [
    {
      q: 'Which Generative AI engine powers StudyGenie?',
      a: 'StudyGenie is built with the Google Gemini API (including Gemini 2.0 Flash & Gemini 1.5 Flash). It also includes a built-in curated academic simulation mode so you can test all features without requiring an API key upfront.'
    },
    {
      q: 'How does the PDF Summarizer work?',
      a: 'When you upload a PDF, our backend extracts the clean text layer using PyPDF. It then sends the context to Gemini to extract definitions, executive takeaways, and exam questions. Only text-readable PDFs are processed.'
    },
    {
      q: 'Can I export my generated study notes?',
      a: 'Yes! Generated notes can be edited inline, copied to your clipboard with one click, saved permanently to your personal StudyGenie library, and exported as clean formatted PDFs.'
    },
    {
      q: 'What subjects are supported by the AI Tutor and Code Assistant?',
      a: 'The AI Tutor supports any university or college subject including Computer Science, Mathematics, Physics, Chemistry, Biology, Economics, and Engineering. The Code Assistant specifically provides syntax-highlighted solutions for C, C++, Python, Java, and JavaScript.'
    },
    {
      q: 'Is my study data and API key kept private?',
      a: 'Yes. API keys are stored strictly in your browser local storage or server environment variables, never leaked or exposed to third parties.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-navy-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-brand-500/20 to-indigo-500/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Generative AI for Higher Education</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15] mb-6">
            Your Personal <br />
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI Study Partner.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            Learn difficult concepts, generate notes, solve doubts, and prepare for exams with the power of Generative AI.
          </p>

          {/* Tagline pill */}
          <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-8">
            "Study Smarter. Learn Faster. Achieve More."
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              to="/app"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-base font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xl shadow-brand-500/30 transition transform hover:-translate-y-0.5"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-navy-900 dark:hover:bg-navy-800 border border-slate-200 dark:border-navy-700 transition"
            >
              Explore Features
            </a>
          </div>

          {/* Trust stats */}
          <div className="mt-14 pt-8 border-t border-slate-200/60 dark:border-navy-800/60 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">98%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Exam Confidence</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">4x</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Faster Note Review</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">8 Tools</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Full Academic Suite</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Gemini 2.0</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Google AI Powered</p>
            </div>
          </div>
        </div>

        {/* Dashboard Live Preview Card */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="relative rounded-2xl p-2 bg-gradient-to-b from-brand-500/20 to-transparent border border-slate-200/80 dark:border-navy-800 shadow-2xl">
            <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 text-left">
              {/* Window controls */}
              <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 text-xs font-mono text-slate-400">StudyGenie Workspace — AI Tutor Session</span>
                </div>
                <span className="text-[11px] font-mono text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded">
                  Gemini Flash 2.0
                </span>
              </div>

              {/* Mockup screen */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900/90 text-slate-200">
                <div className="md:col-span-1 space-y-4 border-r border-slate-800/80 pr-4">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <p className="text-xs font-bold text-brand-400 uppercase tracking-wider">Active Subject</p>
                    <p className="text-sm font-semibold text-white mt-1">Operating Systems (CS 301)</p>
                    <p className="text-xs text-slate-400">Topic: Deadlock & Coffman Conditions</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-400">Response Modes</p>
                    <div className="space-y-1.5 text-xs font-medium">
                      <div className="p-2 rounded-lg bg-brand-600/30 text-brand-300 border border-brand-500/40">✓ Exam Preparation</div>
                      <div className="p-2 rounded-lg bg-slate-800/40 text-slate-400">Detailed Explanation</div>
                      <div className="p-2 rounded-lg bg-slate-800/40 text-slate-400">Real-World Examples</div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                      AT
                    </div>
                    <div className="bg-slate-800/80 p-3.5 rounded-xl rounded-tl-none border border-slate-700/60 text-xs">
                      <p className="font-semibold text-slate-300 mb-1">Alex Turner (Student):</p>
                      <p>"How does a Banker's algorithm prevent deadlocks during process allocation?"</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-brand-950/40 border border-brand-500/30 p-4 rounded-xl rounded-tl-none text-xs space-y-2 text-slate-200">
                      <p className="font-semibold text-brand-400">StudyGenie Tutor:</p>
                      <p>
                        The <strong>Banker's Algorithm</strong> tests for safety by simulating the allocation of predetermined maximum possible amounts of all resources:
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-slate-300">
                        <li><strong>Safe State</strong>: A system is in a safe state if there exists a sequence $P_1, P_2, \dots, P_n$ where each process can satisfy its request.</li>
                        <li><strong>Need Matrix</strong>: Calculated as $Need[i][j] = Max[i][j] - Allocation[i][j]$.</li>
                      </ul>
                      <div className="pt-2 flex items-center gap-3">
                        <Link to="/app/tutor" className="text-brand-400 hover:underline font-semibold flex items-center gap-1">
                          Try Live Dialogue <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="py-20 lg:py-28 bg-slate-50 dark:bg-navy-900/40 border-y border-slate-200/80 dark:border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-2">
              All-In-One Toolkit
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Eight Specialized AI Tools for Academic Excellence
            </p>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
              From doubt solving to PDF extraction, code mentoring to study timetables — everything you need in one unified interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="bg-white dark:bg-navy-900 border border-slate-200/90 dark:border-navy-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-brand-500/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${f.color} flex items-center justify-center text-white mb-5 shadow-md shadow-brand-500/10 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {f.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                      {f.desc}
                    </p>
                  </div>

                  <Link
                    to={f.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How StudyGenie Works */}
      <section id="how-it-works" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-2">
              Seamless Workflow
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How StudyGenie Powers Your Learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((st, i) => (
              <div key={i} className="relative p-8 rounded-2xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200/80 dark:border-navy-800 shadow-sm">
                <span className="text-4xl font-extrabold text-brand-500/20 dark:text-brand-400/20 font-mono mb-4 block">
                  {st.step}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {st.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 lg:py-28 bg-brand-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-2">
              Scientific Edge
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Engineered for Real Academic Outcomes
            </p>
            <p className="mt-4 text-slate-300 text-sm">
              StudyGenie blends cognitive science techniques with Generative AI to maximize retention and minimize study burnout.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{b.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-2">
              Student Experiences
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Trusted by Students Worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 italic mb-6 leading-relaxed">
                    "{t.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-navy-800">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</h4>
                    <p className="text-[11px] text-brand-600 dark:text-brand-400 font-medium">{t.university}</p>
                    <p className="text-[10px] text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 lg:py-28 bg-slate-50 dark:bg-navy-900/40 border-t border-slate-200 dark:border-navy-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-2">
              Questions & Answers
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left text-sm font-bold text-slate-900 dark:text-white hover:text-brand-600 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-navy-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 bg-gradient-to-r from-brand-700 via-indigo-700 to-purple-800 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Ready to Accelerate Your Academic Journey?
          </h2>
          <p className="text-base text-brand-100 mb-8 max-w-xl mx-auto">
            Experience the future of personalized higher education learning. Free, open, and instant.
          </p>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-white text-brand-700 hover:bg-brand-50 shadow-2xl transition transform hover:scale-105"
          >
            <span>Launch StudyGenie Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white dark:bg-navy-950 border-t border-slate-200 dark:border-navy-900 text-slate-500 dark:text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-sm">StudyGenie</p>
              <p className="text-[11px]">"Study Smarter. Learn Faster. Achieve More."</p>
            </div>
          </div>

          <p className="text-center md:text-left">
            Built for university students & engineers. Powered by Google Gemini Generative AI.
          </p>

          <div className="flex items-center gap-6">
            <Link to="/app" className="hover:text-brand-600 transition">Dashboard</Link>
            <Link to="/app/tutor" className="hover:text-brand-600 transition">AI Tutor</Link>
            <Link to="/app/settings" className="hover:text-brand-600 transition">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

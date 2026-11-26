import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('studygenie_user');
    return saved ? JSON.parse(saved) : {
      id: 'student-01',
      name: 'Alex Turner',
      email: 'alex.turner@university.edu',
      major: 'Computer Science & Engineering',
      academicLevel: 'Undergraduate (Year 3)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      streakDays: 7,
      totalStudyHours: 42.5,
      quizzesTaken: 14,
      flashcardsMastered: 128
    };
  });

  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return localStorage.getItem('studygenie_gemini_key') || '';
  });

  const [isDemoMode, setIsDemoMode] = useState(!geminiApiKey);

  useEffect(() => {
    localStorage.setItem('studygenie_user', JSON.stringify(user));
  }, [user]);

  const saveApiKey = (key) => {
    const cleaned = (key || '').trim();
    setGeminiApiKey(cleaned);
    if (cleaned) {
      localStorage.setItem('studygenie_gemini_key', cleaned);
      setIsDemoMode(false);
    } else {
      localStorage.removeItem('studygenie_gemini_key');
      setIsDemoMode(true);
    }
  };

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      updateUser,
      geminiApiKey,
      saveApiKey,
      isDemoMode,
      setIsDemoMode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

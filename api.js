// API client with automatic Gemini key injection and resilient fallback
const API_BASE = '/api';

const getHeaders = (extra = {}) => {
  const customKey = localStorage.getItem('studygenie_gemini_key') || '';
  const headers = { ...extra };
  if (customKey) {
    headers['X-Gemini-Api-Key'] = customKey;
  }
  return headers;
};

export const api = {
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      return { status: 'offline', error: e.message };
    }
  },

  async validateKey(apiKey) {
    const res = await fetch(`${API_BASE}/config/check-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey })
    });
    return await res.json();
  },

  async sendChatMessage(messages, subject, mode) {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ messages, subject, mode })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Chat request failed');
    }
    return await res.json();
  },

  async generateNotes(subject, topic, level, style) {
    const res = await fetch(`${API_BASE}/ai/notes`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ subject, topic, level, style })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to generate notes');
    }
    return await res.json();
  },

  async summarizePdf(file, length) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('length', length);

    const res = await fetch(`${API_BASE}/ai/summarize-pdf`, {
      method: 'POST',
      headers: getHeaders(),
      body: formData
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to summarize PDF');
    }
    return await res.json();
  },

  async generateQuiz(subject, topic, count, difficulty) {
    const res = await fetch(`${API_BASE}/ai/quiz`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ subject, topic, count, difficulty })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to generate quiz');
    }
    return await res.json();
  },

  async generateFlashcards(topic, contextText, count) {
    const res = await fetch(`${API_BASE}/ai/flashcards`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ topic, context_text: contextText, count })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to generate flashcards');
    }
    return await res.json();
  },

  async generateStudyPlan(subjects, examDates, dailyHours, goals) {
    const res = await fetch(`${API_BASE}/ai/planner`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ subjects, exam_dates: examDates, daily_hours: dailyHours, goals })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to generate study plan');
    }
    return await res.json();
  },

  async generateCodeAssistance(language, prompt, mode) {
    const res = await fetch(`${API_BASE}/ai/code`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ language, prompt, mode })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to assist with code');
    }
    return await res.json();
  },

  // Library
  async getLibrary(type = 'all', query = '') {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (query) params.append('q', query);

    const res = await fetch(`${API_BASE}/library?${params.toString()}`);
    return await res.json();
  },

  async saveToLibrary(item) {
    const res = await fetch(`${API_BASE}/library`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    return await res.json();
  },

  async updateLibraryItem(id, updates) {
    const res = await fetch(`${API_BASE}/library/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return await res.json();
  },

  async deleteLibraryItem(id) {
    const res = await fetch(`${API_BASE}/library/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  }
};

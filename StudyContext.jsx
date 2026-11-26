import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const StudyContext = createContext();

export const StudyProvider = ({ children }) => {
  const [libraryItems, setLibraryItems] = useState([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [activePlan, setActivePlan] = useState(() => {
    const saved = localStorage.getItem('studygenie_active_plan');
    return saved ? JSON.parse(saved) : null;
  });

  // Recent subjects state
  const [recentSubjects, setRecentSubjects] = useState(() => {
    const saved = localStorage.getItem('studygenie_recent_subjects');
    return saved ? JSON.parse(saved) : [
      { name: 'Computer Science', topic: 'Red-Black Trees & Graphs', progress: 78, icon: 'Terminal' },
      { name: 'Mathematics', topic: 'Multivariable Calculus & Taylor Series', progress: 65, icon: 'Sigma' },
      { name: 'Physics', topic: 'Electromagnetism & Maxwell Equations', progress: 52, icon: 'Atom' },
      { name: 'Operating Systems', topic: 'Process Scheduling & Semaphores', progress: 84, icon: 'Cpu' }
    ];
  });

  // Refresh library
  const refreshLibrary = async () => {
    setLoadingLibrary(true);
    try {
      const res = await api.getLibrary();
      if (res.success && res.items) {
        setLibraryItems(res.items);
      }
    } catch (e) {
      console.error("Failed to load library items:", e);
    } finally {
      setLoadingLibrary(false);
    }
  };

  useEffect(() => {
    refreshLibrary();
  }, []);

  const saveActivePlan = (plan) => {
    setActivePlan(plan);
    localStorage.setItem('studygenie_active_plan', JSON.stringify(plan));
  };

  const togglePlanTask = (dayIndex, taskId) => {
    if (!activePlan || !activePlan.days) return;
    const updatedDays = activePlan.days.map((day, dIdx) => {
      if (dIdx !== dayIndex) return day;
      const updatedTasks = day.tasks.map(t => {
        if (t.id === taskId) {
          return { ...t, completed: !t.completed };
        }
        return t;
      });
      return { ...day, tasks: updatedTasks };
    });
    const updatedPlan = { ...activePlan, days: updatedDays };
    saveActivePlan(updatedPlan);
  };

  const addLibraryItem = async (item) => {
    try {
      const res = await api.saveToLibrary(item);
      if (res.success && res.item) {
        setLibraryItems(prev => [res.item, ...prev]);
        return res.item;
      }
    } catch (e) {
      console.error("Failed to save item:", e);
      throw e;
    }
  };

  const deleteLibraryItem = async (id) => {
    try {
      await api.deleteLibraryItem(id);
      setLibraryItems(prev => prev.filter(item => item.id !== id));
    } catch (e) {
      console.error("Failed to delete item:", e);
      throw e;
    }
  };

  return (
    <StudyContext.Provider value={{
      libraryItems,
      loadingLibrary,
      refreshLibrary,
      addLibraryItem,
      deleteLibraryItem,
      activePlan,
      saveActivePlan,
      togglePlanTask,
      recentSubjects
    }}>
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => useContext(StudyContext);

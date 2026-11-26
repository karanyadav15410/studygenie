import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ApiKeyModal } from './ApiKeyModal';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar onOpenApiKeyModal={() => setApiKeyModalOpen(true)} />
      </div>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden animate-fade-in"
        />
      )}

      {/* Mobile Drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 transform md:hidden transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar
          onOpenApiKeyModal={() => {
            setSidebarOpen(false);
            setApiKeyModalOpen(true);
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Gemini API Key Configuration Modal */}
      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
      />
    </div>
  );
};

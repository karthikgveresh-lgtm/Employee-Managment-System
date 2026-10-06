/**
 * @file src/components/Header.tsx
 * @description Top Navigation Bar conforming strictly to the Top Bar Contract:
 * [Brand title, one line] — [4-6 nav links, 1-2 word labels, single-line] — [1-2 primary actions]
 */

import React from 'react';
import { Plus, Database, Sparkles, Code2, Users, Layers } from 'lucide-react';

interface HeaderProps {
  onOpenCreateModal: () => void;
  onOpenApiDocs: () => void;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
  totalEmployees: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCreateModal,
  onOpenApiDocs,
  activeNavTab,
  setActiveNavTab,
  totalEmployees,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-md shadow-indigo-500/20 ring-1 ring-white/20">
            <Users className="h-5 w-5 text-white" />
          </div>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setActiveNavTab('directory');
            }}
            className="text-lg font-bold tracking-tight text-white hover:text-indigo-300 transition-colors"
          >
            GUPIO EMS
          </a>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => setActiveNavTab('directory')}
            className={`whitespace-nowrap transition-colors relative py-1 ${
              activeNavTab === 'directory'
                ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Directory
          </button>
          <button
            onClick={() => setActiveNavTab('departments')}
            className={`whitespace-nowrap transition-colors relative py-1 ${
              activeNavTab === 'departments'
                ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Departments
          </button>
          <button
            onClick={() => setActiveNavTab('analytics')}
            className={`whitespace-nowrap transition-colors relative py-1 ${
              activeNavTab === 'analytics'
                ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Metrics
          </button>
          <button
            onClick={onOpenApiDocs}
            className="whitespace-nowrap text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5"
          >
            <Code2 className="h-3.5 w-3.5" />
            API Docs
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenApiDocs}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 border border-slate-800"
            title="API Documentation"
            aria-label="View API Documentation"
          >
            <Code2 className="h-4 w-4" />
          </button>

          <button
            onClick={onOpenCreateModal}
            className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 whitespace-nowrap"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 duration-200" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

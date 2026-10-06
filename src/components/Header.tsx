/**
 * @file src/components/Header.tsx
 * @description Neo-Bento Modular Showcase Top Bar.
 * Strictly adheres to Top Bar Contract (3 zones, single text brand wordmark, clean unboxed nav).
 */

import React from 'react';
import { motion } from 'motion/react';
import { Plus, Sparkles, Code2, Users, LayoutGrid, Layers, BarChart3 } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0b0d14]/85 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-rose-500 shadow-md shadow-violet-600/30 ring-1 ring-white/20">
            <LayoutGrid className="h-4 w-4 text-white" />
          </div>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setActiveNavTab('directory');
            }}
            className="text-lg font-bold tracking-tight text-white hover:text-violet-300 transition-colors flex items-center gap-2"
          >
            <span>GUPIO EMS</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gradient-bento hidden sm:inline px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20">
              Neo-Bento
            </span>
          </a>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveNavTab('directory')}
            className={`whitespace-nowrap transition-colors relative py-1 ${
              activeNavTab === 'directory'
                ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-violet-500 after:to-rose-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Directory
          </button>
          <button
            onClick={() => setActiveNavTab('departments')}
            className={`whitespace-nowrap transition-colors relative py-1 ${
              activeNavTab === 'departments'
                ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-violet-500 after:to-rose-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Divisions
          </button>
          <button
            onClick={() => setActiveNavTab('analytics')}
            className={`whitespace-nowrap transition-colors relative py-1 ${
              activeNavTab === 'analytics'
                ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-violet-500 after:to-rose-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Telemetry
          </button>
          <button
            onClick={onOpenApiDocs}
            className="whitespace-nowrap text-slate-400 hover:text-violet-300 transition-colors flex items-center gap-1.5"
          >
            <Code2 className="h-3.5 w-3.5 text-violet-400" />
            <span>API Docs</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenApiDocs}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 border border-white/10"
            title="API Documentation"
            aria-label="View API Documentation"
          >
            <Code2 className="h-4 w-4" />
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenCreateModal}
            className="group btn-bento-violet inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold text-white tracking-wide whitespace-nowrap shadow-lg shadow-violet-600/30"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 duration-200" />
            <span>Add Team Member</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;

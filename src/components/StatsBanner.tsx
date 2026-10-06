/**
 * @file src/components/StatsBanner.tsx
 * @description Dashboard metric cards providing high-depth tactile elevation
 * with tabular numerals and zero-pill discipline.
 */

import React from 'react';
import { Users, Building2, Briefcase, Database } from 'lucide-react';
import { Employee } from '../types/employee.ts';

interface StatsBannerProps {
  employees: Employee[];
  storageMode?: string;
  isMongoConnected?: boolean;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  employees,
  storageMode = 'mongodb',
  isMongoConnected = false,
}) => {
  const totalHeadcount = employees.length;

  // Compute active unique departments
  const uniqueDepts = Array.from(new Set(employees.map((e) => e.department))).filter(Boolean);

  // Compute newest employee
  const sorted = [...employees].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const latestHire = sorted[0]?.name || 'None';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Headcount */}
      <div className="glass-card rounded-2xl p-5 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-200">
        <div className="absolute top-0 right-0 -mt-3 -mr-3 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-indigo-500/20 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Total Headcount
          </span>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-white font-mono tabular-nums">
            {totalHeadcount}
          </span>
          <span className="text-xs text-slate-400">Active records</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
          <span>Synced with Express API</span>
          <span aria-hidden="true">·</span>
          <span>Live Mongoose Model</span>
        </div>
      </div>

      {/* Departments Represented */}
      <div className="glass-card rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-200">
        <div className="absolute top-0 right-0 -mt-3 -mr-3 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Departments
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Building2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-white font-mono tabular-nums">
            {uniqueDepts.length}
          </span>
          <span className="text-xs text-slate-400">Divisions represented</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
          <span>Filtered on backend</span>
          <span aria-hidden="true">·</span>
          <span>Indexed field</span>
        </div>
      </div>

      {/* Latest Addition */}
      <div className="glass-card rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-200">
        <div className="absolute top-0 right-0 -mt-3 -mr-3 w-20 h-20 bg-amber-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Latest Hire
          </span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 truncate">
          <span className="text-xl font-bold tracking-tight text-white truncate">
            {latestHire}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 truncate">
          <span>Role: {sorted[0]?.designation || 'None'}</span>
        </div>
      </div>

      {/* Backend / Database Engine Status */}
      <div className="glass-card rounded-2xl p-5 relative overflow-hidden group hover:border-sky-500/30 transition-all duration-200">
        <div className="absolute top-0 right-0 -mt-3 -mr-3 w-20 h-20 bg-sky-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-sky-500/20 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Database Engine
          </span>
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
            <Database className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isMongoConnected ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-sky-400 shadow-sm shadow-sky-400/50'
            }`}
          />
          <span className="text-sm font-semibold tracking-tight text-white">
            {isMongoConnected ? 'MongoDB Live' : 'Mongoose Engine'}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 truncate">
          <span>Validations Active</span>
          <span aria-hidden="true">·</span>
          <span>Regex Enforced</span>
        </div>
      </div>
    </div>
  );
};

export default StatsBanner;

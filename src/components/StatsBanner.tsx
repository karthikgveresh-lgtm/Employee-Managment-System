/**
 * @file src/components/StatsBanner.tsx
 * @description Neo-Bento Dynamic Grid (Apple-Style Modular Showcase).
 * Asymmetrical Bento-box layout featuring interactive SVG team breakdown rings,
 * team member spotlight card, live headcount gauge, and Mongoose schema telemetry.
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Building2,
  Sparkles,
  Database,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  Mail,
  Zap,
} from 'lucide-react';
import { Employee, DEPARTMENTS_LIST } from '../types/employee.ts';

interface StatsBannerProps {
  employees: Employee[];
  storageMode?: string;
  isMongoConnected?: boolean;
  dbError?: string | null;
  dbUri?: string;
  onSelectEmployee?: (emp: Employee) => void;
  onFilterDepartment?: (dept: string) => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  employees,
  storageMode = 'mongodb',
  isMongoConnected = false,
  dbError,
  dbUri,
  onSelectEmployee,
  onFilterDepartment,
}) => {
  const totalHeadcount = employees.length;

  // Department counts
  const departments = DEPARTMENTS_LIST.filter((d) => d !== 'All');
  const deptCounts = departments.map((dept) => ({
    name: dept,
    count: employees.filter((e) => e.department.toLowerCase() === dept.toLowerCase()).length,
  }));

  // Top departments with positive count
  const activeDepts = deptCounts.filter((d) => d.count > 0);

  // Latest spotlight employee
  const sorted = [...employees].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const spotlightEmployee = sorted[0];

  // SVG Apple Ring calculation
  const ringColors = [
    '#8B5CF6', // Electric Violet
    '#F43F5E', // Sunset Coral
    '#38BDF8', // Sky Blue
    '#34D399', // Emerald
    '#FBBF24', // Amber
    '#FB7185', // Rose
  ];

  const total = totalHeadcount || 1;
  let cumulativePercent = 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      {/* BENTO MODULE 1: Spotlight Team Member (Large 2-column card) */}
      <motion.div
        whileHover={{ y: -3, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
        className="md:col-span-2 bento-card rounded-[24px] p-6 relative overflow-hidden flex flex-col justify-between"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-gradient-to-br from-violet-600/20 to-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/25">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Team Spotlight</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Recent Appointment
            </span>
          </div>

          {spotlightEmployee ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-rose-500 flex items-center justify-center text-white text-xl font-extrabold shadow-lg shadow-violet-600/25 shrink-0 ring-2 ring-white/10">
                {spotlightEmployee.name.slice(0, 2).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white tracking-tight truncate">
                  {spotlightEmployee.name}
                </h3>
                <p className="text-sm font-semibold text-gradient-bento truncate mt-0.5">
                  {spotlightEmployee.designation}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>{spotlightEmployee.department}</span>
                  </span>
                  <span>·</span>
                  <a
                    href={`mailto:${spotlightEmployee.email}`}
                    className="font-mono text-slate-300 hover:text-violet-300 truncate max-w-[200px]"
                  >
                    {spotlightEmployee.email}
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400 mt-2">No employee records currently active.</p>
          )}
        </div>

        {spotlightEmployee && onSelectEmployee && (
          <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Joined {new Date(spotlightEmployee.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <button
              onClick={() => onSelectEmployee(spotlightEmployee)}
              className="inline-flex items-center gap-1 text-xs font-bold text-violet-300 hover:text-white transition-colors group"
            >
              <span>Inspect Dossier</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        )}
      </motion.div>

      {/* BENTO MODULE 2: Apple Activity Style Interactive Team Ring */}
      <motion.div
        whileHover={{ y: -3, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
        className="bento-card rounded-[24px] p-6 relative overflow-hidden flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Team Breakdown
          </span>
          <span className="p-1.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Zap className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Circular Ring SVG Representation */}
        <div className="flex items-center justify-center my-3 relative">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="10"
              fill="transparent"
            />
            {activeDepts.map((d, idx) => {
              const fraction = d.count / total;
              const strokeDasharray = `${fraction * 251.2} 251.2`;
              const strokeDashoffset = -cumulativePercent * 251.2;
              cumulativePercent += fraction;

              return (
                <circle
                  key={d.name}
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={ringColors[idx % ringColors.length]}
                  strokeWidth="10"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="font-mono text-xl font-extrabold text-white tabular-nums">
              {totalHeadcount}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Staff
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-1.5 pt-2 border-t border-white/5">
          {activeDepts.slice(0, 2).map((d, idx) => (
            <div key={d.name} className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: ringColors[idx % ringColors.length] }}
                />
                <span className="truncate max-w-[100px]">{d.name}</span>
              </span>
              <span className="font-mono tabular-nums text-slate-400">
                {d.count} ({Math.round((d.count / total) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* BENTO MODULE 3: Headcount & Platform Infrastructure Gauge */}
      <motion.div
        whileHover={{ y: -3, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
        className="bento-card bento-card-coral rounded-[24px] p-6 relative overflow-hidden flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Workforce
            </span>
            <span className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Users className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-white font-mono tabular-nums">
              {totalHeadcount}
            </span>
            <span className="text-xs text-rose-300 font-semibold">Active Profiles</span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800/80 mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(15, totalHeadcount * 15))}%` }}
            />
          </div>
        </div>

        {/* Database & Mongoose Node telemetry */}
        <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Engine:</span>
            <span className="font-semibold text-rose-300 font-mono text-[11px]">
              {isMongoConnected ? 'MongoDB Atlas' : 'Mongoose Engine'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">RFC Email Regex Validated</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StatsBanner;

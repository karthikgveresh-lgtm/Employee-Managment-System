/**
 * @file src/components/MetricsView.tsx
 * @description Neo-Bento Telemetry & Workforce Analytics.
 */

import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, Database, ShieldCheck, Clock, CheckCircle2, Sparkles, Activity } from 'lucide-react';
import { Employee, DEPARTMENTS_LIST } from '../types/employee.ts';

interface MetricsViewProps {
  employees: Employee[];
  storageMode?: string;
  isMongoConnected?: boolean;
}

export const MetricsView: React.FC<MetricsViewProps> = ({
  employees,
  storageMode = 'mongodb',
  isMongoConnected = false,
}) => {
  const departments = DEPARTMENTS_LIST.filter((d) => d !== 'All');
  const total = employees.length || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-violet-400" />
            <span>Workforce Telemetry & Schema Governance</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time headcount ratios, division allocation bars, and Mongoose database audit checks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Distribution Bars */}
        <div className="lg:col-span-2 bento-card rounded-[24px] p-6 border border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-violet-400" />
              Division Allocation Metrics
            </h3>
            <span className="text-xs text-violet-300 font-mono tabular-nums bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">
              {employees.length} Active Records
            </span>
          </div>

          <div className="space-y-4">
            {departments.map((dept) => {
              const count = employees.filter(
                (e) => e.department.toLowerCase() === dept.toLowerCase()
              ).length;
              const percentage = Math.round((count / total) * 100);

              return (
                <div key={dept} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="font-semibold text-slate-200">{dept}</span>
                    <span className="font-mono tabular-nums text-slate-400">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${Math.max(percentage, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Database & Governance Audit Card */}
        <div className="bento-card rounded-[24px] p-6 border border-white/[0.08] flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2 mb-4">
              <Database className="w-4 h-4 text-rose-400" />
              Mongoose Schema Validation Audit
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-100">Email Format Constraint</p>
                  <p className="text-slate-400 mt-0.5 font-mono text-[11px]">
                    RFC Pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-100">Mandatory Schema Fields</p>
                  <p className="text-slate-400 mt-0.5">
                    `name`, `email`, `department`, `designation` (strictly validated)
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-100">Automatic Timestamps</p>
                  <p className="text-slate-400 mt-0.5">
                    Mongoose `{'{ timestamps: true }'}` tracking creation & mutations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Database Engine:</span>
              <span className="font-semibold text-violet-300 font-mono">
                {isMongoConnected ? 'MongoDB Atlas Live' : 'Mongoose Engine (Active)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsView;

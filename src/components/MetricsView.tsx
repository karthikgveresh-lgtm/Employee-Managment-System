/**
 * @file src/components/MetricsView.tsx
 * @description Workforce analytics & schema audit telemetry view.
 */

import React from 'react';
import { BarChart3, Database, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">System & Workforce Metrics</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time headcount ratios, database schema enforcement status, and audit parameters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Distribution Progress Bars */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Department Headcount Distribution
            </h3>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              {employees.length} Total Records
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
                    <span className="font-medium">{dept}</span>
                    <span className="font-mono tabular-nums text-slate-400">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Database & Validation Health Card */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-white text-sm flex items-center gap-2 mb-4">
              <Database className="w-4 h-4 text-emerald-400" />
              Mongoose Schema Validation Audit
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-200">Email Format Constraint</p>
                  <p className="text-slate-400 mt-0.5 font-mono text-[11px]">
                    RegExp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-200">Required Field Invariants</p>
                  <p className="text-slate-400 mt-0.5">
                    `name`, `email`, `department`, `designation` (all mandatory)
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-200">Automatic Timestamps</p>
                  <p className="text-slate-400 mt-0.5">
                    Mongoose Schema `{'{ timestamps: true }'}` tracking creation & updates.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>DB Mode:</span>
              <span className="font-semibold text-indigo-400 font-mono">
                {isMongoConnected ? 'MongoDB Live' : 'Mongoose Engine (In-Memory)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsView;

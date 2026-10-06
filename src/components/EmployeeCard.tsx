/**
 * @file src/components/EmployeeCard.tsx
 * @description High-depth glassmorphic card for individual Employee entity.
 * Uses arbitrary box-shadows, layered glass backdrops, micro-interactions,
 * and zero-pill discipline for clean tactile presence.
 */

import React from 'react';
import { Mail, Edit3, Trash2, Eye, Calendar, Building, Briefcase } from 'lucide-react';
import { Employee } from '../types/employee.ts';

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onView: (employee: Employee) => void;
}

// Generates consistent initials from name
function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// Department-based subtle gradient background for avatar icon
function getDeptGradient(department: string): string {
  switch (department.toLowerCase()) {
    case 'engineering':
      return 'from-cyan-500 to-blue-600';
    case 'product':
      return 'from-violet-500 to-purple-600';
    case 'design':
      return 'from-pink-500 to-rose-600';
    case 'human resources':
      return 'from-emerald-500 to-teal-600';
    case 'marketing':
      return 'from-amber-500 to-orange-600';
    case 'sales':
      return 'from-indigo-500 to-blue-700';
    default:
      return 'from-slate-500 to-zinc-600';
  }
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onEdit,
  onDelete,
  onView,
}) => {
  const formattedDate = new Date(employee.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between relative group overflow-hidden">
      {/* Subtle top edge specular highlight reflection */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* Main Card Content */}
      <div>
        {/* Top Header with Avatar & Department Label */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`h-11 w-11 rounded-xl bg-gradient-to-tr ${getDeptGradient(
                employee.department
              )} flex items-center justify-center text-white font-bold text-sm shadow-md ring-1 ring-white/20`}
            >
              {getInitials(employee.name)}
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                {employee.name}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-slate-400" />
                <span className="truncate max-w-[180px]">{employee.designation}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Unboxed Metadata (Zero-pill discipline) */}
        <div className="space-y-2 py-3 border-y border-slate-800/60 my-2 text-xs">
          {/* Department info */}
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              Department
            </span>
            <span className="font-medium text-slate-200">{employee.department}</span>
          </div>

          {/* Email link with tactile hover */}
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Email
            </span>
            <a
              href={`mailto:${employee.email}`}
              className="font-mono text-slate-300 hover:text-indigo-300 transition-colors truncate max-w-[170px]"
              title={employee.email}
            >
              {employee.email}
            </a>
          </div>

          {/* Joined Date */}
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Added
            </span>
            <span className="font-mono tabular-nums text-slate-400">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Card Action Controls Footer */}
      <div className="pt-3 flex items-center justify-between mt-2">
        <button
          onClick={() => onView(employee)}
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-indigo-300 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Details</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(employee)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-700/60"
            title="Edit employee record"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(employee)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-all border border-transparent hover:border-rose-900/40"
            title="Delete employee record"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;

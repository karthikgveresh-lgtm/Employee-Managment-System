/**
 * @file src/components/EmployeeCard.tsx
 * @description Neo-Bento Modular Employee Card.
 * Uses rounded-3xl geometry, electric violet & sunset coral gradients,
 * spring hover physics via motion, and zero-pill discipline.
 */

import React from 'react';
import { motion } from 'motion/react';
import { Mail, Edit3, Trash2, Eye, Calendar, Building2, Briefcase, ArrowUpRight } from 'lucide-react';
import { Employee } from '../types/employee.ts';

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onView: (employee: Employee) => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getDeptGlow(department: string): string {
  switch (department.toLowerCase()) {
    case 'engineering':
      return 'from-violet-600 via-indigo-600 to-cyan-500';
    case 'product':
      return 'from-fuchsia-600 via-purple-600 to-indigo-600';
    case 'design':
      return 'from-rose-500 via-pink-600 to-violet-600';
    case 'human resources':
      return 'from-emerald-500 via-teal-600 to-cyan-600';
    case 'marketing':
      return 'from-amber-500 via-rose-500 to-orange-600';
    default:
      return 'from-slate-600 via-zinc-700 to-slate-800';
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
    <motion.div
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
      className="bento-card rounded-[22px] p-5 flex flex-col justify-between relative group border border-white/[0.08]"
    >
      <div>
        {/* Header with Avatar & Role */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`h-11 w-11 rounded-2xl bg-gradient-to-tr ${getDeptGlow(
                employee.department
              )} flex items-center justify-center font-extrabold text-sm text-white shadow-md shadow-violet-950 ring-1 ring-white/20`}
            >
              {getInitials(employee.name)}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-white tracking-tight group-hover:text-violet-300 transition-colors truncate">
                {employee.name}
              </h3>
              <p className="text-xs text-rose-300/90 font-medium flex items-center gap-1 mt-0.5 truncate">
                <Briefcase className="w-3 h-3 text-violet-400 shrink-0" />
                <span className="truncate max-w-[180px]">{employee.designation}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Unboxed Metadata (Zero-pill discipline) */}
        <div className="space-y-2 py-3 border-y border-white/[0.06] my-2 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-violet-400" />
              Division
            </span>
            <span className="font-semibold text-slate-200">{employee.department}</span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-rose-400" />
              Email
            </span>
            <a
              href={`mailto:${employee.email}`}
              className="font-mono text-slate-300 hover:text-violet-300 transition-colors truncate max-w-[170px]"
              title={employee.email}
            >
              {employee.email}
            </a>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-violet-400" />
              Joined
            </span>
            <span className="font-mono tabular-nums text-slate-400">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="pt-3 flex items-center justify-between mt-2">
        <button
          onClick={() => onView(employee)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-300 hover:text-white transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
          <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-rose-400 transition-colors" />
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(employee)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
            title="Edit Employee"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(employee)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-all border border-transparent hover:border-rose-900/40"
            title="Delete Employee"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeCard;

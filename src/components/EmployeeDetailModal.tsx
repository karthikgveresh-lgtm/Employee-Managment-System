/**
 * @file src/components/EmployeeDetailModal.tsx
 * @description Comprehensive detail view of an individual employee,
 * displaying Mongoose ObjectId, ISO timestamps, and role breakdown.
 */

import React, { useState } from 'react';
import { X, Mail, Building, Briefcase, Calendar, Copy, Check, Hash, Edit3 } from 'lucide-react';
import { Employee } from '../types/employee.ts';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onEdit: (employee: Employee) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  onClose,
  employee,
  onEdit,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !employee) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(employee._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedCreated = new Date(employee.createdAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const formattedUpdated = new Date(employee.updatedAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 sm:p-7 relative border border-slate-700/80 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-md ring-1 ring-white/20">
              {employee.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{employee.name}</h2>
              <p className="text-xs text-indigo-400 font-medium">{employee.designation}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-3.5 text-xs">
          {/* Email */}
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-400">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>Corporate Email</span>
            </div>
            <a
              href={`mailto:${employee.email}`}
              className="font-mono text-slate-200 hover:text-indigo-400 transition-colors"
            >
              {employee.email}
            </a>
          </div>

          {/* Department */}
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-400">
              <Building className="w-4 h-4 text-emerald-400" />
              <span>Assigned Department</span>
            </div>
            <span className="font-semibold text-slate-200">{employee.department}</span>
          </div>

          {/* Role / Designation */}
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-400">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Role Title</span>
            </div>
            <span className="font-medium text-slate-200">{employee.designation}</span>
          </div>

          {/* MongoDB Document ID */}
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-400">
              <Hash className="w-4 h-4 text-sky-400" />
              <span>Mongoose _id</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-300 text-[11px]">{employee._id}</span>
              <button
                onClick={handleCopyId}
                className="p-1 hover:text-white text-slate-400 transition-colors"
                title="Copy ObjectId"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <span className="text-slate-400 text-[11px] block">Created At</span>
              <span className="font-mono tabular-nums text-slate-300 text-xs mt-0.5 block">
                {formattedCreated}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <span className="text-slate-400 text-[11px] block">Last Modified</span>
              <span className="font-mono tabular-nums text-slate-300 text-xs mt-0.5 block">
                {formattedUpdated}
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onEdit(employee);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-all hover:scale-[1.02]"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Record</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;

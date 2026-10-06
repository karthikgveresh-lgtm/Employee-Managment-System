/**
 * @file src/components/EmployeeDetailModal.tsx
 * @description Executive Employee Dossier modal dialog.
 * Presents complete employee record, Mongoose ObjectId, and ISO timestamps.
 */

import React, { useState } from 'react';
import { X, Mail, Building2, Briefcase, Calendar, Copy, Check, Hash, Edit3, Crown } from 'lucide-react';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="obsidian-panel w-full max-w-lg rounded-2xl p-6 sm:p-7 relative border border-amber-500/30 shadow-2xl">
        {/* Specular hairline top rim highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 via-amber-700 to-yellow-900 border border-amber-400/50 flex items-center justify-center text-slate-950 font-bold text-lg shadow-md ring-1 ring-amber-300/30">
              {employee.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Executive Dossier
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">{employee.name}</h2>
              <p className="text-xs text-amber-400/90 font-medium">{employee.designation}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dossier Information Body */}
        <div className="mt-5 space-y-3.5 text-xs">
          {/* Corporate Email */}
          <div className="p-3.5 rounded-xl bg-[#0c0e14] border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-400">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Corporate Email</span>
            </div>
            <a
              href={`mailto:${employee.email}`}
              className="font-mono text-slate-200 hover:text-amber-300 transition-colors"
            >
              {employee.email}
            </a>
          </div>

          {/* Department */}
          <div className="p-3.5 rounded-xl bg-[#0c0e14] border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-400">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Assigned Division</span>
            </div>
            <span className="font-semibold text-slate-200">{employee.department}</span>
          </div>

          {/* Role Title */}
          <div className="p-3.5 rounded-xl bg-[#0c0e14] border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-400">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Executive Designation</span>
            </div>
            <span className="font-medium text-slate-200">{employee.designation}</span>
          </div>

          {/* MongoDB Document ID */}
          <div className="p-3.5 rounded-xl bg-[#0c0e14] border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-400">
              <Hash className="w-4 h-4 text-amber-400" />
              <span>Mongoose _id</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-300 text-[11px]">{employee._id}</span>
              <button
                onClick={handleCopyId}
                className="p-1 hover:text-amber-300 text-slate-400 transition-colors"
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
            <div className="p-3 rounded-xl bg-[#0c0e14]/70 border border-slate-800/80">
              <span className="text-slate-400 text-[11px] block">Appointed On</span>
              <span className="font-mono tabular-nums text-slate-300 text-xs mt-0.5 block">
                {formattedCreated}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#0c0e14]/70 border border-slate-800/80">
              <span className="text-slate-400 text-[11px] block">Last Record Update</span>
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
            className="btn-executive-gold inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 rounded-xl uppercase tracking-wider"
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

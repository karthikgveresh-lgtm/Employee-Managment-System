/**
 * @file src/components/DeleteConfirmModal.tsx
 * @description Tactile confirmation modal preventing accidental deletions
 * and explaining consequences clearly.
 */

import React from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';
import { Employee } from '../types/employee.ts';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  employee: Employee | null;
  isDeleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  employee,
  isDeleting,
}) => {
  if (!isOpen || !employee) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div className="obsidian-panel w-full max-w-md rounded-2xl p-6 relative border border-rose-900/50 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Retire / Delete Staff Record?
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              You are about to remove{' '}
              <span className="font-semibold text-slate-200">{employee.name}</span> (
              {employee.designation}) from the corporate database.
            </p>
            <div className="mt-3 p-3 rounded-xl bg-[#0c0e14] border border-slate-800 text-xs font-mono text-slate-400">
              <p>Email: {employee.email}</p>
              <p>Division: {employee.department}</p>
            </div>
            <p className="text-xs text-rose-400/90 mt-2">
              This action initiates a permanent `DELETE /api/employees/{employee._id}` call.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-600 rounded-xl shadow-lg shadow-rose-900/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Removing...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Confirm Removal</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;

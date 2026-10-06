/**
 * @file src/components/ToastAlert.tsx
 * @description Tactile Toast notification for CRUD operations feedback.
 */

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastAlertProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastAlert: React.FC<ToastAlertProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl glass-panel shadow-2xl border transition-all duration-300 animate-in slide-in-from-bottom-3 fade-in flex items-start gap-3 ${
            toast.type === 'success'
              ? 'border-emerald-500/40 bg-slate-900/90'
              : toast.type === 'error'
              ? 'border-rose-500/40 bg-slate-900/90'
              : 'border-indigo-500/40 bg-slate-900/90'
          }`}
        >
          {toast.type === 'success' && (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          )}
          {toast.type === 'error' && (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          {toast.type === 'info' && (
            <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 text-xs">
            <h5 className="font-semibold text-white tracking-tight">{toast.title}</h5>
            {toast.message && (
              <p className="text-slate-400 mt-0.5 leading-relaxed">{toast.message}</p>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastAlert;

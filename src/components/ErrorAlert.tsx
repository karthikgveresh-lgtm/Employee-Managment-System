/**
 * @file src/components/ErrorAlert.tsx
 * @description Dedicated Error Handling Panel with retry triggers,
 * error code diagnostics, and dismissal.
 */

import React from 'react';
import { AlertCircle, RefreshCw, X, ShieldAlert } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  statusCode?: number | null;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  statusCode,
  onRetry,
  onDismiss,
}) => {
  return (
    <div className="mb-6 rounded-2xl bg-rose-950/40 border border-rose-800/80 p-4 sm:p-5 backdrop-blur-md shadow-xl shadow-rose-950/20 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-rose-200 tracking-tight">
                Backend System Notice
              </h4>
              {statusCode && (
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-rose-900/60 text-rose-300 border border-rose-700/50">
                  HTTP {statusCode}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-rose-300/90 leading-relaxed max-w-2xl">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-100 bg-rose-800/60 hover:bg-rose-700/80 border border-rose-600/50 rounded-xl transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1.5 text-rose-400 hover:text-rose-100 rounded-lg hover:bg-rose-900/40 transition-colors"
              title="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;

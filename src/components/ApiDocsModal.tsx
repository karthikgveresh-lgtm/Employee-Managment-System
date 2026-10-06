/**
 * @file src/components/ApiDocsModal.tsx
 * @description Interactive API Documentation modal for placement evaluators.
 * Documents all CRUD endpoints, parameters, JSON payload schemas, and HTTP status codes.
 */

import React, { useState } from 'react';
import { X, Code2, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const endpoints = [
    {
      method: 'POST',
      path: '/api/employees',
      desc: 'Create employee with Mongoose schema validation & regex check',
      status: '201 Created (400 on error)',
      body: JSON.stringify(
        {
          name: 'Jane Doe',
          email: 'jane.doe@gupio.corp',
          department: 'Engineering',
          designation: 'Senior Backend Engineer',
        },
        null,
        2
      ),
    },
    {
      method: 'GET',
      path: '/api/employees?search=jane&department=Engineering',
      desc: 'Retrieve employees with case-insensitive search & department filtering',
      status: '200 OK',
      body: null,
    },
    {
      method: 'GET',
      path: '/api/employees/:id',
      desc: 'Fetch individual employee document by Mongoose ObjectId',
      status: '200 OK (404 Not Found, 400 Invalid ID)',
      body: null,
    },
    {
      method: 'PUT',
      path: '/api/employees/:id',
      desc: 'Safely update existing record with runValidators: true',
      status: '200 OK (404 Not Found, 400 Validation Error)',
      body: JSON.stringify(
        {
          designation: 'Lead Backend Engineer',
        },
        null,
        2
      ),
    },
    {
      method: 'DELETE',
      path: '/api/employees/:id',
      desc: 'Permanently remove employee record from the database',
      status: '200 OK (404 Not Found, 400 Invalid ID)',
      body: null,
    },
  ];

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass-panel w-full max-w-2xl max-h-[85vh] rounded-2xl p-6 sm:p-7 relative border border-slate-700/80 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Express API Endpoints & Mongoose Contracts
              </h2>
              <p className="text-xs text-slate-400">
                Evaluation Reference Guide for GUPIO Campus Placement
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Endpoints List */}
        <div className="mt-4 overflow-y-auto space-y-4 pr-1 text-xs">
          {endpoints.map((ep, idx) => {
            const methodColor =
              ep.method === 'GET'
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/50'
                : ep.method === 'POST'
                ? 'bg-indigo-950/80 text-indigo-400 border-indigo-700/50'
                : ep.method === 'PUT'
                ? 'bg-amber-950/80 text-amber-400 border-amber-700/50'
                : 'bg-rose-950/80 text-rose-400 border-rose-700/50';

            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] border ${methodColor}`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono text-slate-200 font-semibold">{ep.path}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">{ep.status}</span>
                </div>

                <p className="text-slate-400">{ep.desc}</p>

                {ep.body && (
                  <div className="relative mt-2">
                    <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
                      {ep.body}
                    </pre>
                    <button
                      onClick={() => copyToClipboard(ep.body, idx)}
                      className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white transition-colors"
                      title="Copy payload"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-mono">
            Controllers location: /backend/controllers/employeeController.ts
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiDocsModal;

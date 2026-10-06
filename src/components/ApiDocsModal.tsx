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

        {/* Credentials and Repository Safety Warning for Assignment Submission */}
        <div className="mt-4 p-4 rounded-xl bg-amber-950/40 border border-amber-600/50 text-amber-200">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base" role="img" aria-label="warning">⚠️</span>
            <h3 className="font-bold text-sm text-amber-100 tracking-tight">
              Warning for your Assignment Submission
            </h3>
          </div>
          <p className="text-xs text-amber-200/90 leading-relaxed mb-3">
            Since this is for the GUPIO practical assignment, the guidelines strictly mention <strong className="text-white font-semibold">Credentials and Repository Safety</strong>.
          </p>
          <ul className="space-y-2 text-xs text-amber-100/90 pl-1">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <div>
                <strong className="text-white">Do not hardcode this string anywhere inside your actual codebase:</strong>
                <p className="text-amber-200/70 text-[11px] mt-0.5">
                  Enforced. The connection string is accessed exclusively via <code className="font-mono bg-amber-900/40 px-1 py-0.5 rounded text-amber-300">process.env.MONGODB_URI</code> in <code className="font-mono bg-amber-900/40 px-1 py-0.5 rounded text-amber-300">backend/config/db.ts</code>.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <div>
                <strong className="text-white">Do not push an unhidden .env file containing this string to your public GitHub repository:</strong>
                <p className="text-amber-200/70 text-[11px] mt-0.5">
                  Enforced. Local secrets remain in your local <code className="font-mono bg-amber-900/40 px-1 py-0.5 rounded text-amber-300">.env</code> file, while <code className="font-mono bg-amber-900/40 px-1 py-0.5 rounded text-amber-300">.env.example</code> contains only anonymized dummy templates.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <div>
                <strong className="text-white">Make sure your .gitignore file includes .env so it is safely ignored during deployment:</strong>
                <p className="text-amber-200/70 text-[11px] mt-0.5">
                  Enforced. <code className="font-mono bg-amber-900/40 px-1 py-0.5 rounded text-amber-300">.gitignore</code> contains explicit exclusions for <code className="font-mono bg-amber-900/40 px-1 py-0.5 rounded text-amber-300">.env</code>, <code className="font-mono bg-amber-900/40 px-1 py-0.5 rounded text-amber-300">.env.local</code>, and <code className="font-mono bg-amber-900/40 px-1 py-0.5 rounded text-amber-300">.env*</code> patterns.
                </p>
              </div>
            </li>
          </ul>
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

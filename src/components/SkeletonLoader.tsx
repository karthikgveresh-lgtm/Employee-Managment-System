/**
 * @file src/components/SkeletonLoader.tsx
 * @description Tactile skeleton loading states for Table and Grid views
 * matching row and card geometry within 2px delta.
 */

import React from 'react';

interface SkeletonLoaderProps {
  viewMode: 'grid' | 'table';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  viewMode,
  count = 6,
}) => {
  const items = Array.from({ length: count });

  if (viewMode === 'table') {
    return (
      <div className="obsidian-panel rounded-2xl overflow-hidden border border-slate-800/80 animate-pulse">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-xs uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-6">Employee</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Designation</th>
                <th className="py-3.5 px-4">Work Email</th>
                <th className="py-3.5 px-4 text-right">Created</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {items.map((_, idx) => (
                <tr key={idx} className="h-[52px]">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-800/80" />
                      <div className="h-4 w-28 bg-slate-800/80 rounded" />
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-4 w-20 bg-slate-800/70 rounded" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-4 w-32 bg-slate-800/70 rounded" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-4 w-36 bg-slate-800/60 rounded" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="h-4 w-16 bg-slate-800/60 rounded ml-auto" />
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="h-4 w-16 bg-slate-800/50 rounded ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
      {items.map((_, idx) => (
        <div
          key={idx}
          className="obsidian-card rounded-2xl p-5 border border-slate-800/80 space-y-4"
        >
          {/* Header row */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-slate-800/80" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-3/4 bg-slate-800/80 rounded" />
              <div className="h-3 w-1/2 bg-slate-800/60 rounded" />
            </div>
          </div>

          {/* Details lines */}
          <div className="py-3 border-y border-slate-800/60 space-y-2.5">
            <div className="flex justify-between">
              <div className="h-3 w-16 bg-slate-800/60 rounded" />
              <div className="h-3 w-24 bg-slate-800/70 rounded" />
            </div>
            <div className="flex justify-between">
              <div className="h-3 w-14 bg-slate-800/60 rounded" />
              <div className="h-3 w-32 bg-slate-800/70 rounded" />
            </div>
            <div className="flex justify-between">
              <div className="h-3 w-14 bg-slate-800/60 rounded" />
              <div className="h-3 w-20 bg-slate-800/70 rounded" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-1">
            <div className="h-4 w-12 bg-slate-800/50 rounded" />
            <div className="flex gap-2">
              <div className="h-6 w-6 bg-slate-800/60 rounded-lg" />
              <div className="h-6 w-6 bg-slate-800/60 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;

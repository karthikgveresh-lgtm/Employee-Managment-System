/**
 * @file src/components/FilterBar.tsx
 * @description Neo-Bento Dynamic Search and Filter Bar.
 * Incorporates Electric Violet & Sunset Coral accents, smooth spring state switches,
 * and keyboard shortcut hints.
 */

import React from 'react';
import { motion } from 'motion/react';
import { Search, X, LayoutGrid, List, RotateCcw, Filter, Download } from 'lucide-react';
import { DepartmentType, DEPARTMENTS_LIST } from '../types/employee.ts';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedDepartment: DepartmentType;
  onDepartmentChange: (dept: DepartmentType) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onExportCsv: () => void;
  totalFiltered: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  viewMode,
  onViewModeChange,
  onRefresh,
  isRefreshing,
  onExportCsv,
  totalFiltered,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Top row: Search input + View switcher + Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input with Neo-Bento rounded aesthetics */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-violet-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search roster by name, email, or role..."
            className="bento-input w-full rounded-2xl py-2.5 pl-10 pr-10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Right side controls: View switch, Export, Refresh */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Export CSV button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-rose-500/30 rounded-2xl transition-all shadow-sm"
            title="Export filtered records to CSV"
          >
            <Download className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </motion.button>

          {/* Refresh button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 text-slate-400 hover:text-violet-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-2xl transition-all disabled:opacity-50"
            title="Refresh database records"
          >
            <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-violet-400' : ''}`} />
          </motion.button>

          {/* View Mode Segmented Switcher */}
          <div className="flex items-center p-1 bg-white/[0.04] border border-white/10 rounded-2xl">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-xl transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-violet-600 to-rose-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Bento Grid view"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-xl transition-all ${
                viewMode === 'table'
                  ? 'bg-gradient-to-r from-violet-600 to-rose-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table view"
              aria-label="Table view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Department Filter Segmented Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
        <div className="flex items-center gap-1.5 text-xs text-violet-400 mr-2 shrink-0 font-medium">
          <Filter className="w-3.5 h-3.5" />
          <span>Division:</span>
        </div>

        {DEPARTMENTS_LIST.map((dept) => {
          const isSelected = selectedDepartment === dept;
          return (
            <motion.button
              whileTap={{ scale: 0.96 }}
              key={dept}
              onClick={() => onDepartmentChange(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-150 ${
                isSelected
                  ? 'bg-gradient-to-r from-violet-600 to-rose-500 text-white shadow-md shadow-violet-600/25 border border-white/20'
                  : 'bg-white/[0.04] text-slate-400 hover:text-slate-200 hover:bg-white/[0.08] border border-white/5'
              }`}
            >
              {dept}
            </motion.button>
          );
        })}

        {/* Clear active filters if any */}
        {(searchTerm || selectedDepartment !== 'All') && (
          <button
            onClick={() => {
              onSearchChange('');
              onDepartmentChange('All');
            }}
            className="text-xs text-rose-400 hover:text-rose-300 transition-colors underline underline-offset-4 ml-2 shrink-0 whitespace-nowrap"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Result Counter & Active Query Status */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-white/5">
        <div>
          Showing{' '}
          <span className="font-semibold text-violet-300 font-mono tabular-nums">
            {totalFiltered}
          </span>{' '}
          {totalFiltered === 1 ? 'employee' : 'employees'}
          {selectedDepartment !== 'All' && <span> in {selectedDepartment}</span>}
          {searchTerm && <span> matching &ldquo;{searchTerm}&rdquo;</span>}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

/**
 * @file src/components/FilterBar.tsx
 * @description Dynamic search and department filter bar hitting the backend API.
 * Supports segmented controls, keyboard shortcuts, view toggle, and refresh trigger.
 */

import React from 'react';
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
        {/* Search Input with high tactile glass depth */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search employees by name, email, or role..."
            className="glass-input w-full rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all duration-200"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Right side controls: View switch, Export, Refresh */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Export CSV button */}
          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-all shadow-sm hover:text-white"
            title="Export filtered records to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-all disabled:opacity-50"
            title="Refresh database records"
          >
            <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          {/* View Mode Segmented Switcher */}
          <div className="flex items-center p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Tactile Card Grid view"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="High-Density Table view"
              aria-label="Table view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Department Filter Segmented Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          <span>Department:</span>
        </div>

        {DEPARTMENTS_LIST.map((dept) => {
          const isSelected = selectedDepartment === dept;
          return (
            <button
              key={dept}
              onClick={() => onDepartmentChange(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-150 ${
                isSelected
                  ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-600/25 border border-indigo-400/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800'
              }`}
            >
              {dept}
            </button>
          );
        })}

        {/* Clear active filters if any */}
        {(searchTerm || selectedDepartment !== 'All') && (
          <button
            onClick={() => {
              onSearchChange('');
              onDepartmentChange('All');
            }}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors underline underline-offset-4 ml-2 shrink-0 whitespace-nowrap"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Result Counter & Active Query Status */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/50">
        <div>
          Showing{' '}
          <span className="font-semibold text-slate-200 font-mono tabular-nums">
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

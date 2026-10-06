/**
 * @file src/components/EmployeeTable.tsx
 * @description High-density data grid table for Enterprise Employee Management.
 * Implements clean column alignment, tabular numerals, unboxed metadata,
 * and responsive overflow handling.
 */

import React from 'react';
import { Mail, Edit3, Trash2, Eye, Calendar, Building, Briefcase } from 'lucide-react';
import { Employee } from '../types/employee.ts';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onView: (employee: Employee) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800/80">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th scope="col" className="py-3.5 px-4 sm:px-6">
                Employee
              </th>
              <th scope="col" className="py-3.5 px-4">
                Department
              </th>
              <th scope="col" className="py-3.5 px-4">
                Designation
              </th>
              <th scope="col" className="py-3.5 px-4">
                Work Email
              </th>
              <th scope="col" className="py-3.5 px-4 text-right">
                Created
              </th>
              <th scope="col" className="py-3.5 px-4 sm:px-6 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {employees.map((emp) => {
              const formattedDate = new Date(emp.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <tr
                  key={emp._id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Name + Avatar */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-indigo-950 border border-indigo-700/50 flex items-center justify-center text-xs font-bold text-indigo-300">
                        {emp.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <button
                          onClick={() => onView(emp)}
                          className="font-medium text-slate-100 group-hover:text-indigo-400 transition-colors hover:underline text-left"
                        >
                          {emp.name}
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Department (Unboxed text with zero-pill rule) */}
                  <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                    {emp.department}
                  </td>

                  {/* Designation */}
                  <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                    {emp.designation}
                  </td>

                  {/* Email */}
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-400">
                    <a
                      href={`mailto:${emp.email}`}
                      className="hover:text-indigo-300 transition-colors"
                    >
                      {emp.email}
                    </a>
                  </td>

                  {/* Created At (Tabular Numerals) */}
                  <td className="py-3.5 px-4 text-right font-mono text-xs tabular-nums text-slate-400 whitespace-nowrap">
                    {formattedDate}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onView(emp)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
                        title="View employee profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(emp)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Edit employee record"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(emp)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                        title="Delete employee record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;

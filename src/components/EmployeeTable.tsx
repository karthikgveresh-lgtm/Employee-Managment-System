/**
 * @file src/components/EmployeeTable.tsx
 * @description Neo-Bento High-Density Table with tabular figures and spring highlights.
 */

import React from 'react';
import { Mail, Edit3, Trash2, Eye, Calendar, Building2, Briefcase } from 'lucide-react';
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
    <div className="bento-card rounded-[22px] overflow-hidden border border-white/[0.08]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th scope="col" className="py-3.5 px-4 sm:px-6">
                Team Member
              </th>
              <th scope="col" className="py-3.5 px-4">
                Division
              </th>
              <th scope="col" className="py-3.5 px-4">
                Role Title
              </th>
              <th scope="col" className="py-3.5 px-4">
                Corporate Email
              </th>
              <th scope="col" className="py-3.5 px-4 text-right">
                Joined
              </th>
              <th scope="col" className="py-3.5 px-4 sm:px-6 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {employees.map((emp) => {
              const formattedDate = new Date(emp.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <tr
                  key={emp._id}
                  className="hover:bg-violet-500/[0.06] transition-colors group"
                >
                  {/* Name + Avatar */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-violet-600 to-rose-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                        {emp.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <button
                          onClick={() => onView(emp)}
                          className="font-semibold text-slate-100 group-hover:text-violet-300 transition-colors hover:underline text-left"
                        >
                          {emp.name}
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap font-medium">
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
                      className="hover:text-violet-300 transition-colors"
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
                        className="p-1.5 rounded-xl text-slate-400 hover:text-violet-300 hover:bg-white/10 transition-colors"
                        title="View Dossier"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(emp)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="Edit Employee"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(emp)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                        title="Delete Employee"
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

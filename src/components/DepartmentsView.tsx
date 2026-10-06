/**
 * @file src/components/DepartmentsView.tsx
 * @description Dedicated Department Breakdown view showing department headcount,
 * key designations, and direct filtering into directory.
 */

import React from 'react';
import { Building, Users, ArrowRight } from 'lucide-react';
import { Employee, DepartmentType, DEPARTMENTS_LIST } from '../types/employee.ts';

interface DepartmentsViewProps {
  employees: Employee[];
  onSelectDepartment: (dept: DepartmentType) => void;
}

export const DepartmentsView: React.FC<DepartmentsViewProps> = ({
  employees,
  onSelectDepartment,
}) => {
  const departments = DEPARTMENTS_LIST.filter((d) => d !== 'All');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Organizational Departments</h2>
          <p className="text-xs text-slate-400 mt-1">
            Department roster breakdown and role distribution across the enterprise.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept) => {
          const deptEmployees = employees.filter(
            (e) => e.department.toLowerCase() === dept.toLowerCase()
          );
          const count = deptEmployees.length;

          return (
            <div
              key={dept}
              className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Building className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold text-white text-base">{dept}</h3>
                  </div>
                  <span className="font-mono text-sm font-bold text-indigo-300 tabular-nums">
                    {count} {count === 1 ? 'member' : 'members'}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Active Roles
                  </p>
                  {count > 0 ? (
                    <div className="space-y-1.5">
                      {deptEmployees.slice(0, 3).map((emp) => (
                        <div
                          key={emp._id}
                          className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-900/60"
                        >
                          <span className="font-medium text-slate-200 truncate max-w-[140px]">
                            {emp.name}
                          </span>
                          <span className="text-slate-400 truncate max-w-[130px]">
                            {emp.designation}
                          </span>
                        </div>
                      ))}
                      {count > 3 && (
                        <p className="text-[11px] text-slate-500 text-center pt-1">
                          +{count - 3} more in this division
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-900/30 text-xs text-slate-500 text-center">
                      No employees currently assigned to {dept}.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/70 flex justify-end">
                <button
                  onClick={() => onSelectDepartment(dept)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <span>Filter Directory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentsView;

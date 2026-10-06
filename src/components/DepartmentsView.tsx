/**
 * @file src/components/DepartmentsView.tsx
 * @description Neo-Bento Division Showcase.
 * Displays modular Bento cards for each corporate department with headcount pills
 * and active staff cards.
 */

import React from 'react';
import { motion } from 'motion/react';
import { Building2, Users, ArrowRight, Sparkles, Layers } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-violet-400" />
            <span>Corporate Divisions & Headcount</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Departmental roster breakdown and team distributions across the organization.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept, index) => {
          const deptEmployees = employees.filter(
            (e) => e.department.toLowerCase() === dept.toLowerCase()
          );
          const count = deptEmployees.length;

          return (
            <motion.div
              key={dept}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
              className="bento-card rounded-[24px] p-6 border border-white/[0.08] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-violet-600/20 to-rose-500/20 text-violet-300 border border-violet-500/30">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-white text-base tracking-tight">{dept}</h3>
                  </div>
                  <span className="font-mono text-xs font-bold text-violet-300 tabular-nums bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">
                    {count} {count === 1 ? 'member' : 'members'}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Active Roles
                  </p>
                  {count > 0 ? (
                    <div className="space-y-1.5">
                      {deptEmployees.slice(0, 3).map((emp) => (
                        <div
                          key={emp._id}
                          className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-white/[0.03] border border-white/5"
                        >
                          <span className="font-semibold text-slate-200 truncate max-w-[130px]">
                            {emp.name}
                          </span>
                          <span className="text-slate-400 truncate max-w-[140px] text-[11px]">
                            {emp.designation}
                          </span>
                        </div>
                      ))}
                      {count > 3 && (
                        <p className="text-[11px] text-violet-400 font-medium text-center pt-1">
                          +{count - 3} more in this division
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-500 text-center">
                      No staff appointed to {dept} yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/5 flex justify-end">
                <button
                  onClick={() => onSelectDepartment(dept)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-400 hover:text-rose-400 transition-colors"
                >
                  <span>Filter Directory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentsView;

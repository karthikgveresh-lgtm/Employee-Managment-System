/**
 * @file src/components/SlideOverDrawer.tsx
 * @description Apple-Style Slide-Over Glass Sheet Drawer.
 * Enables seamless viewing and editing of employee records with spring physics
 * without full-page reloads.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Mail,
  Building2,
  Briefcase,
  Calendar,
  Hash,
  Copy,
  Check,
  Edit3,
  Trash2,
  AlertCircle,
  Save,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { Employee, EmployeeFormData, DEPARTMENTS_LIST } from '../types/employee.ts';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface SlideOverDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  mode: 'view' | 'edit';
  onModeChange: (mode: 'view' | 'edit') => void;
  onUpdate: (formData: EmployeeFormData) => Promise<{ success: boolean; errors?: string[] }>;
  onDeleteRequest: (employee: Employee) => void;
}

export const SlideOverDrawer: React.FC<SlideOverDrawerProps> = ({
  isOpen,
  onClose,
  employee,
  mode,
  onModeChange,
  onUpdate,
  onDeleteRequest,
}) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    email: '',
    department: 'Engineering',
    designation: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
        department: employee.department,
        designation: employee.designation,
      });
      setErrors({});
      setServerErrors([]);
    }
  }, [employee, mode]);

  if (!isOpen || !employee) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(employee._id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const validateField = (field: keyof EmployeeFormData, val: string): string => {
    switch (field) {
      case 'name':
        if (!val.trim()) return 'Name is required';
        if (val.trim().length < 2) return 'Min 2 characters required';
        return '';
      case 'email':
        if (!val.trim()) return 'Work email is required';
        if (!EMAIL_REGEX.test(val.trim())) return 'Invalid corporate email format';
        return '';
      case 'department':
        if (!val.trim() || val === 'All') return 'Select a valid division';
        return '';
      case 'designation':
        if (!val.trim()) return 'Role title is required';
        if (val.trim().length < 2) return 'Min 2 characters required';
        return '';
      default:
        return '';
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      department: validateField('department', formData.department),
      designation: validateField('designation', formData.designation),
    };

    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setServerErrors([]);

    const result = await onUpdate(formData);
    setIsSubmitting(false);

    if (result.success) {
      onModeChange('view');
    } else if (result.errors) {
      setServerErrors(result.errors);
    }
  };

  const formattedDate = new Date(employee.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const selectableDepts = DEPARTMENTS_LIST.filter((d) => d !== 'All');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Slide-over Glass Sheet */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="w-screen max-w-md bento-drawer p-6 sm:p-8 flex flex-col justify-between overflow-y-auto"
          >
            <div>
              {/* Top Drawer Controls */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-violet-600 to-rose-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    {employee.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                      {mode === 'view' ? 'Team Member Dossier' : 'Edit Member Details'}
                    </span>
                    <h3 className="text-lg font-bold text-white tracking-tight">{employee.name}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {mode === 'view' ? (
                    <button
                      onClick={() => onModeChange('edit')}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors border border-white/5 hover:border-white/15"
                      title="Edit Employee"
                    >
                      <Edit3 className="w-4 h-4 text-violet-400" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onModeChange('view')}
                      className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white rounded-lg bg-white/5 hover:bg-white/10"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Mode 1: VIEW Mode */}
              {mode === 'view' ? (
                <div className="mt-6 space-y-4 text-xs">
                  {/* Spotlight Role Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 via-rose-500/5 to-transparent border border-violet-500/20">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-violet-300">
                      Corporate Role
                    </span>
                    <h4 className="text-base font-bold text-white mt-0.5">{employee.designation}</h4>
                    <p className="text-slate-400 mt-1 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>{employee.department} Division</span>
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-violet-400" />
                        <span>Corporate Email</span>
                      </span>
                      <a
                        href={`mailto:${employee.email}`}
                        className="font-mono text-violet-300 hover:text-rose-300 transition-colors"
                      >
                        {employee.email}
                      </a>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-rose-400" />
                        <span>Appointed Date</span>
                      </span>
                      <span className="font-mono text-slate-300 tabular-nums">{formattedDate}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5 text-violet-400" />
                        <span>Mongoose _id</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] text-slate-300">{employee._id}</span>
                        <button
                          onClick={handleCopyId}
                          className="p-1 hover:text-white text-slate-400 transition-colors"
                        >
                          {copiedId ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Schema Verification Pill */}
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Schema Invariants & RFC Email Format Enforced</span>
                  </div>
                </div>
              ) : (
                /* Mode 2: EDIT Form Mode inside Slide-over Drawer */
                <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
                  {serverErrors.length > 0 && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        {serverErrors.map((err, idx) => (
                          <p key={idx}>{err}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bento-input w-full rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                    />
                    {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Corporate Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bento-input w-full rounded-xl py-2 px-3 text-xs text-white focus:outline-none font-mono"
                    />
                    {errors.email && (
                      <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Division Assignment
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="bento-input w-full rounded-xl py-2 px-3 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      {selectableDepts.map((d) => (
                        <option key={d} value={d} className="bg-[#111522] text-white">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="bento-input w-full rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                    />
                    {errors.designation && (
                      <p className="text-[11px] text-rose-400 mt-1">{errors.designation}</p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-bento-violet w-full py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDeleteRequest(employee);
                }}
                className="text-xs font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove Employee</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default SlideOverDrawer;

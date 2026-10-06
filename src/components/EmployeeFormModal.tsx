/**
 * @file src/components/EmployeeFormModal.tsx
 * @description Neo-Bento Team Member Registration Modal.
 * Features real-time client-side RFC email validation, field bounds checking,
 * and electric violet/coral accents.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, AlertCircle, Building2, Mail, User, Briefcase, Loader2, Sparkles } from 'lucide-react';
import { Employee, EmployeeFormData, DEPARTMENTS_LIST } from '../types/employee.ts';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: EmployeeFormData) => Promise<{ success: boolean; errors?: string[] }>;
  initialData?: Employee | null;
  mode: 'create' | 'edit';
}

interface ValidationErrors {
  name?: string;
  email?: string;
  department?: string;
  designation?: string;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    email: '',
    department: 'Engineering',
    designation: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        department: initialData.department,
        designation: initialData.designation,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        department: 'Engineering',
        designation: '',
      });
    }
    setErrors({});
    setTouched({});
    setServerErrors([]);
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const validateField = (field: keyof EmployeeFormData, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Employee name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 100) return 'Name cannot exceed 100 characters';
        return undefined;
      case 'email':
        if (!value.trim()) return 'Corporate email is required';
        if (!EMAIL_REGEX.test(value.trim()))
          return 'Enter a valid corporate email format (e.g. name@company.com)';
        return undefined;
      case 'department':
        if (!value.trim() || value === 'All') return 'Please select a valid division';
        return undefined;
      case 'designation':
        if (!value.trim()) return 'Role title is required';
        if (value.trim().length < 2) return 'Designation must be at least 2 characters';
        if (value.trim().length > 100) return 'Designation cannot exceed 100 characters';
        return undefined;
      default:
        return undefined;
    }
  };

  const validateAll = (): boolean => {
    const newErrors: ValidationErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      department: validateField('department', formData.department),
      designation: validateField('designation', formData.designation),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((err) => Boolean(err));
  };

  const handleChange = (field: keyof EmployeeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const err = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
    setServerErrors([]);
  };

  const handleBlur = (field: keyof EmployeeFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      department: true,
      designation: true,
    });

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);
    setServerErrors([]);

    try {
      const result = await onSubmit(formData);
      if (!result.success) {
        if (result.errors && result.errors.length > 0) {
          setServerErrors(result.errors);
        } else {
          setServerErrors(['Failed to save record. Please check inputs.']);
        }
      } else {
        onClose();
      }
    } catch (err: unknown) {
      setServerErrors([err instanceof Error ? err.message : 'An unexpected error occurred']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectableDepts = DEPARTMENTS_LIST.filter((d) => d !== 'All');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="bento-card w-full max-w-lg rounded-[26px] p-6 sm:p-7 relative border border-white/10 shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-violet-600 to-rose-500 flex items-center justify-center text-white font-bold shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {mode === 'create' ? 'Add New Team Member' : 'Edit Member Details'}
              </h2>
              <p className="text-xs text-violet-300/80 mt-0.5">
                {mode === 'create'
                  ? 'Register verified employee record into Mongoose database'
                  : 'Safely update designation and division assignments'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server errors */}
        {serverErrors.length > 0 && (
          <div className="mt-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Validation Notice:</p>
              <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                {serverErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-violet-400">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="e.g. Maya Sundaram"
                className={`bento-input w-full rounded-2xl py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none ${
                  touched.name && errors.name ? 'border-rose-500' : ''
                }`}
              />
            </div>
            {touched.name && errors.name && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Corporate Email <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-violet-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="e.g. maya.sundaram@gupio.corp"
                className={`bento-input w-full rounded-2xl py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none font-mono ${
                  touched.email && errors.email ? 'border-rose-500' : ''
                }`}
              />
            </div>
            {touched.email && errors.email && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Division Assignment <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-violet-400">
                <Building2 className="h-4 w-4" />
              </div>
              <select
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                onBlur={() => handleBlur('department')}
                className="bento-input w-full rounded-2xl py-2.5 pl-9 pr-3 text-sm text-slate-100 focus:outline-none appearance-none cursor-pointer"
              >
                {selectableDepts.map((d) => (
                  <option key={d} value={d} className="bg-[#121625] text-white">
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Role Title <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-violet-400">
                <Briefcase className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => handleChange('designation', e.target.value)}
                onBlur={() => handleBlur('designation')}
                placeholder="e.g. Senior Frontend Architect"
                className={`bento-input w-full rounded-2xl py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none ${
                  touched.designation && errors.designation ? 'border-rose-500' : ''
                }`}
              />
            </div>
            {touched.designation && errors.designation && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.designation}
              </p>
            )}
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white rounded-2xl hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="btn-bento-violet inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white rounded-2xl shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : mode === 'create' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Add Member</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EmployeeFormModal;

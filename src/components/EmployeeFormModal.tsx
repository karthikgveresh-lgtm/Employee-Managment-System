/**
 * @file src/components/EmployeeFormModal.tsx
 * @description Intuitive Create & Edit Form Modal with comprehensive real-time
 * client-side validation feedback messages and backend error synchronization.
 */

import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Building, Mail, User, Briefcase, Loader2 } from 'lucide-react';
import { Employee, EmployeeFormData, DEPARTMENTS_LIST } from '../types/employee.ts';

// Email regex pattern matching RFC standards
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

  // Sync form data when initialData changes
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

  // Validate a single field
  const validateField = (field: keyof EmployeeFormData, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Employee name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 100) return 'Name cannot exceed 100 characters';
        return undefined;
      case 'email':
        if (!value.trim()) return 'Work email is required';
        if (!EMAIL_REGEX.test(value.trim()))
          return 'Enter a valid corporate email format (e.g. name@domain.com)';
        return undefined;
      case 'department':
        if (!value.trim() || value === 'All') return 'Please select a valid department';
        return undefined;
      case 'designation':
        if (!value.trim()) return 'Designation / job title is required';
        if (value.trim().length < 2) return 'Designation must be at least 2 characters';
        if (value.trim().length > 100) return 'Designation cannot exceed 100 characters';
        return undefined;
      default:
        return undefined;
    }
  };

  // Run full form validation
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
          setServerErrors(['Failed to save employee record. Please review inputs.']);
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

  // Filter out 'All' option for the department dropdown
  const selectableDepts = DEPARTMENTS_LIST.filter((d) => d !== 'All');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 sm:p-7 relative border border-slate-700/80 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {mode === 'create' ? 'Add New Employee' : 'Edit Employee Details'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {mode === 'create'
                ? 'Fill in the verified details to register employee in Mongoose DB'
                : 'Update information safely with schema validator enforcement'}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server error feedback panel if any */}
        {serverErrors.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Server Validation Alert:</p>
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
          {/* Field: Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="e.g. Maya Sundaram"
                className={`glass-input w-full rounded-xl py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none transition-all ${
                  touched.name && errors.name
                    ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
                    : ''
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

          {/* Field: Work Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Work Email Address <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="e.g. maya.sundaram@gupio.corp"
                className={`glass-input w-full rounded-xl py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none transition-all font-mono ${
                  touched.email && errors.email
                    ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
                    : ''
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

          {/* Field: Department */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Department <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Building className="h-4 w-4" />
              </div>
              <select
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                onBlur={() => handleBlur('department')}
                className="glass-input w-full rounded-xl py-2.5 pl-9 pr-3 text-sm text-slate-100 focus:outline-none transition-all appearance-none cursor-pointer"
              >
                {selectableDepts.map((d) => (
                  <option key={d} value={d} className="bg-slate-900 text-slate-100">
                    {d}
                  </option>
                ))}
              </select>
            </div>
            {touched.department && errors.department && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.department}
              </p>
            )}
          </div>

          {/* Field: Designation */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Designation / Role Title <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Briefcase className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => handleChange('designation', e.target.value)}
                onBlur={() => handleBlur('designation')}
                placeholder="e.g. Lead Full Stack Systems Architect"
                className={`glass-input w-full rounded-xl py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none transition-all ${
                  touched.designation && errors.designation
                    ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
                    : ''
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

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : mode === 'create' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Create Employee</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormModal;

/**
 * @file src/App.tsx
 * @description Main Employee Management System Dashboard.
 * Orchestrates API communication, dynamic search & filtering,
 * modal states, notifications, and high-depth tactile UI presentation.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Users,
  Plus,
  RefreshCw,
  FolderOpen,
  FilterX,
  Sparkles,
  AlertCircle,
  Database,
} from 'lucide-react';
import { Header } from './components/Header.tsx';
import { StatsBanner } from './components/StatsBanner.tsx';
import { FilterBar } from './components/FilterBar.tsx';
import { EmployeeTable } from './components/EmployeeTable.tsx';
import { EmployeeCard } from './components/EmployeeCard.tsx';
import { EmployeeFormModal } from './components/EmployeeFormModal.tsx';
import { EmployeeDetailModal } from './components/EmployeeDetailModal.tsx';
import { DeleteConfirmModal } from './components/DeleteConfirmModal.tsx';
import { SkeletonLoader } from './components/SkeletonLoader.tsx';
import { ErrorAlert } from './components/ErrorAlert.tsx';
import { ToastAlert, ToastMessage } from './components/ToastAlert.tsx';
import { ApiDocsModal } from './components/ApiDocsModal.tsx';
import { DepartmentsView } from './components/DepartmentsView.tsx';
import { MetricsView } from './components/MetricsView.tsx';

import {
  Employee,
  DepartmentType,
  EmployeeFormData,
  ApiResponse,
} from './types/employee.ts';

export default function App() {
  // Primary state
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [apiError, setApiError] = useState<{ message: string; status?: number | null } | null>(
    null
  );
  const [storageMode, setStorageMode] = useState<string>('mongodb');
  const [isMongoConnected, setIsMongoConnected] = useState<boolean>(false);

  // Filter & View State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentType>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [activeNavTab, setActiveNavTab] = useState<string>('directory');

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isApiDocsOpen, setIsApiDocsOpen] = useState<boolean>(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  /**
   * Fetch employees from Express API backend with query params
   */
  const fetchEmployees = useCallback(
    async (showLoadingSpinner = true) => {
      if (showLoadingSpinner) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setApiError(null);

      try {
        const queryParams = new URLSearchParams();
        if (searchTerm.trim()) {
          queryParams.append('search', searchTerm.trim());
        }
        if (selectedDepartment && selectedDepartment !== 'All') {
          queryParams.append('department', selectedDepartment);
        }

        const url = `/api/employees${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await fetch(url);
        const data: ApiResponse<Employee[]> = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || `API error occurred with status ${response.status}`);
        }

        setEmployees(data.data || []);
        if (data.storageMode) {
          setStorageMode(data.storageMode);
          setIsMongoConnected(data.storageMode === 'mongodb');
        }
      } catch (err: unknown) {
        console.error('Failed to fetch employees:', err);
        const errMsg =
          err instanceof Error
            ? err.message
            : 'Could not connect to the Express server API endpoints.';
        setApiError({
          message: `${errMsg} Ensure backend routes are active and MongoDB connection URI is configured.`,
          status: 500,
        });
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [searchTerm, selectedDepartment]
  );

  // Debounced search & filter listener
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEmployees(false);
    }, 250);
    return () => clearTimeout(timeoutId);
  }, [fetchEmployees]);

  // Initial load
  useEffect(() => {
    fetchEmployees(true);
  }, []);

  /**
   * Handle Create or Update submission
   */
  const handleFormSubmit = async (
    formData: EmployeeFormData
  ): Promise<{ success: boolean; errors?: string[] }> => {
    try {
      if (formMode === 'create') {
        const res = await fetch('/api/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data: ApiResponse<Employee> = await res.json();

        if (!res.ok || !data.success) {
          return {
            success: false,
            errors: data.errors || [data.message || 'Creation failed'],
          };
        }

        addToast(
          'success',
          'Employee Record Created',
          `${formData.name} was successfully registered in the system.`
        );
        fetchEmployees(false);
        return { success: true };
      } else if (formMode === 'edit' && selectedEmployee) {
        const res = await fetch(`/api/employees/${selectedEmployee._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data: ApiResponse<Employee> = await res.json();

        if (!res.ok || !data.success) {
          return {
            success: false,
            errors: data.errors || [data.message || 'Update failed'],
          };
        }

        addToast(
          'success',
          'Employee Record Updated',
          `Changes for ${formData.name} were successfully saved.`
        );
        fetchEmployees(false);
        return { success: true };
      }

      return { success: false, errors: ['Invalid form mode state'] };
    } catch (err: unknown) {
      console.error('Submit error:', err);
      return {
        success: false,
        errors: [err instanceof Error ? err.message : 'Network request error'],
      };
    }
  };

  /**
   * Handle Delete Confirmation
   */
  const handleDeleteConfirm = async () => {
    if (!selectedEmployee) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/employees/${selectedEmployee._id}`, {
        method: 'DELETE',
      });

      const data: ApiResponse<Employee> = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete record');
      }

      addToast(
        'info',
        'Record Deleted',
        `Employee ${selectedEmployee.name} has been removed from database.`
      );
      setIsDeleteModalOpen(false);
      setSelectedEmployee(null);
      fetchEmployees(false);
    } catch (err: unknown) {
      console.error('Delete error:', err);
      addToast(
        'error',
        'Deletion Error',
        err instanceof Error ? err.message : 'Failed to delete employee'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Trigger Export CSV of filtered list
   */
  const handleExportCsv = () => {
    if (employees.length === 0) {
      addToast('info', 'No Data to Export', 'There are no employee records to export.');
      return;
    }

    const headers = ['ID', 'Name', 'Email', 'Department', 'Designation', 'CreatedAt'];
    const rows = employees.map((e) => [
      `"${e._id}"`,
      `"${e.name.replace(/"/g, '""')}"`,
      `"${e.email.replace(/"/g, '""')}"`,
      `"${e.department.replace(/"/g, '""')}"`,
      `"${e.designation.replace(/"/g, '""')}"`,
      `"${new Date(e.createdAt).toISOString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gupio_employees_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Export Complete', `Exported ${employees.length} records to CSV.`);
  };

  // Quick Action Handlers
  const handleOpenCreate = () => {
    setSelectedEmployee(null);
    setFormMode('create');
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormMode('edit');
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  const handleOpenDetail = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col ambient-glow-indigo">
      {/* Top Bar Navigation */}
      <Header
        onOpenCreateModal={handleOpenCreate}
        onOpenApiDocs={() => setIsApiDocsOpen(true)}
        activeNavTab={activeNavTab}
        setActiveNavTab={setActiveNavTab}
        totalEmployees={employees.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metric Cards Banner */}
        <StatsBanner
          employees={employees}
          storageMode={storageMode}
          isMongoConnected={isMongoConnected}
        />

        {/* Dedicated Error Handling Panel if API fails */}
        {apiError && (
          <ErrorAlert
            message={apiError.message}
            statusCode={apiError.status}
            onRetry={() => fetchEmployees(true)}
            onDismiss={() => setApiError(null)}
          />
        )}

        {/* View Routing based on Zone 2 Top Navigation Tabs */}
        {activeNavTab === 'departments' ? (
          <DepartmentsView
            employees={employees}
            onSelectDepartment={(dept) => {
              setSelectedDepartment(dept);
              setActiveNavTab('directory');
            }}
          />
        ) : activeNavTab === 'analytics' ? (
          <MetricsView
            employees={employees}
            storageMode={storageMode}
            isMongoConnected={isMongoConnected}
          />
        ) : (
          /* Directory View */
          <>
            {/* Search & Department Filter Bar */}
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedDepartment={selectedDepartment}
              onDepartmentChange={setSelectedDepartment}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onRefresh={() => fetchEmployees(false)}
              isRefreshing={isRefreshing}
              onExportCsv={handleExportCsv}
              totalFiltered={employees.length}
            />

            {/* Content Display: Loading / Empty / Data states */}
            {isLoading ? (
              <SkeletonLoader viewMode={viewMode} count={6} />
            ) : employees.length === 0 ? (
              /* Empty State */
              <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800/80 my-4 max-w-xl mx-auto">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/20">
                  {searchTerm || selectedDepartment !== 'All' ? (
                    <FilterX className="w-7 h-7" />
                  ) : (
                    <FolderOpen className="w-7 h-7" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {searchTerm || selectedDepartment !== 'All'
                    ? 'No matching employees found'
                    : 'No employee records yet'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                  {searchTerm || selectedDepartment !== 'All'
                    ? 'Try adjusting your search criteria or resetting the department filters.'
                    : 'Start building your organizational roster by registering your first employee in the system.'}
                </p>

                <div className="mt-6 flex items-center justify-center gap-3">
                  {searchTerm || selectedDepartment !== 'All' ? (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedDepartment('All');
                      }}
                      className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors"
                    >
                      Clear All Filters
                    </button>
                  ) : (
                    <button
                      onClick={handleOpenCreate}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add First Employee</span>
                    </button>
                  )}
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              /* Tactile Glass Card Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {employees.map((emp) => (
                  <EmployeeCard
                    key={emp._id}
                    employee={emp}
                    onEdit={handleOpenEdit}
                    onDelete={handleOpenDelete}
                    onView={handleOpenDetail}
                  />
                ))}
              </div>
            ) : (
              /* High-Density Table View */
              <EmployeeTable
                employees={employees}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onView={handleOpenDetail}
              />
            )}
          </>
        )}
      </main>

      {/* Footer conforming to anti-slop guidelines (no fake telemetry, quiet real links) */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">GUPIO EMS</span>
            <span>·</span>
            <span>Full Stack Campus Placement System</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsApiDocsOpen(true)}
              className="hover:text-indigo-400 transition-colors"
            >
              API Reference
            </button>
            <span>·</span>
            <span>Node.js / Express</span>
            <span>·</span>
            <span>Mongoose & MongoDB</span>
          </div>
        </div>
      </footer>

      {/* Modals & Portals */}
      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedEmployee}
        mode={formMode}
      />

      <EmployeeDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        employee={selectedEmployee}
        onEdit={handleOpenEdit}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        employee={selectedEmployee}
        isDeleting={isDeleting}
      />

      <ApiDocsModal
        isOpen={isApiDocsOpen}
        onClose={() => setIsApiDocsOpen(false)}
      />

      {/* Toast Alert Container */}
      <ToastAlert toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

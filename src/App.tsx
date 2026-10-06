/**
 * @file src/App.tsx
 * @description Neo-Bento Dynamic Grid Dashboard (Apple-Style Modular Showcase).
 * Incorporates asymmetric Bento modules, slide-over glass sheet drawer,
 * spring micro-interactions (powered by motion), and Electric Violet & Sunset Coral accents.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Plus,
  RefreshCw,
  FolderOpen,
  FilterX,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Header } from './components/Header.tsx';
import { StatsBanner } from './components/StatsBanner.tsx';
import { FilterBar } from './components/FilterBar.tsx';
import { EmployeeTable } from './components/EmployeeTable.tsx';
import { EmployeeCard } from './components/EmployeeCard.tsx';
import { EmployeeFormModal } from './components/EmployeeFormModal.tsx';
import { SlideOverDrawer } from './components/SlideOverDrawer.tsx';
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
  const [dbError, setDbError] = useState<string | null>(null);
  const [dbUri, setDbUri] = useState<string>('');

  // Filter & View State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentType>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [activeNavTab, setActiveNavTab] = useState<string>('directory');

  // Modal & Drawer State
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Slide-over Glass Sheet Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerMode, setDrawerMode] = useState<'view' | 'edit'>('view');

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

        // Fetch detailed storage status
        try {
          const statsRes = await fetch('/api/employees/stats');
          const statsJson = await statsRes.json();
          if (statsJson.success && statsJson.data?.storageStatus) {
            setIsMongoConnected(statsJson.data.storageStatus.isMongoConnected);
            setDbError(statsJson.data.storageStatus.lastError || null);
            setDbUri(statsJson.data.storageStatus.uri || '');
          }
        } catch {
          // Ignore stats fetch failure
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
      if (formMode === 'create' && !selectedEmployee) {
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
          'Team Member Added',
          `${formData.name} was successfully registered in the system.`
        );
        fetchEmployees(false);
        return { success: true };
      } else if ((formMode === 'edit' || isDrawerOpen) && selectedEmployee) {
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

        // Update selected employee in drawer state as well
        setSelectedEmployee(data.data);

        addToast(
          'success',
          'Profile Updated',
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
      setIsDrawerOpen(false);
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

  // Open slide-over glass drawer in View mode
  const handleOpenDetail = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDrawerMode('view');
    setIsDrawerOpen(true);
  };

  // Open slide-over glass drawer in Edit mode
  const handleOpenEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDrawerMode('edit');
    setIsDrawerOpen(true);
  };

  const handleOpenDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bento-canvas text-slate-100 flex flex-col antialiased">
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
        {/* Dynamic Bento Grid Showcase Banner */}
        <StatsBanner
          employees={employees}
          storageMode={storageMode}
          isMongoConnected={isMongoConnected}
          dbError={dbError}
          dbUri={dbUri}
          onSelectEmployee={handleOpenDetail}
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
              <div className="bento-card rounded-[26px] p-12 text-center border border-white/10 my-4 max-w-xl mx-auto">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600/20 to-rose-500/20 text-violet-400 flex items-center justify-center mb-4 border border-violet-500/30">
                  {searchTerm || selectedDepartment !== 'All' ? (
                    <FilterX className="w-7 h-7" />
                  ) : (
                    <FolderOpen className="w-7 h-7" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {searchTerm || selectedDepartment !== 'All'
                    ? 'No matching team members found'
                    : 'No team members registered yet'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                  {searchTerm || selectedDepartment !== 'All'
                    ? 'Try adjusting your search query or clearing the active department filter.'
                    : 'Start building your organizational roster by adding your first employee.'}
                </p>

                <div className="mt-6 flex items-center justify-center gap-3">
                  {searchTerm || selectedDepartment !== 'All' ? (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedDepartment('All');
                      }}
                      className="px-4 py-2 text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-colors"
                    >
                      Reset All Filters
                    </button>
                  ) : (
                    <button
                      onClick={handleOpenCreate}
                      className="btn-bento-violet inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white rounded-2xl shadow-lg"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add First Team Member</span>
                    </button>
                  )}
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              /* Bento Modular Cards Grid View */
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

      {/* Footer conforming to anti-slop guidelines */}
      <footer className="border-t border-white/[0.06] bg-[#08090f]/90 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gradient-bento">GUPIO EMS</span>
            <span>·</span>
            <span>Neo-Bento Modular Showcase</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsApiDocsOpen(true)}
              className="hover:text-violet-300 transition-colors"
            >
              API Contracts
            </button>
            <span>·</span>
            <span>Node.js / Express</span>
            <span>·</span>
            <span>MongoDB & Mongoose</span>
          </div>
        </div>
      </footer>

      {/* Slide-Over Glass Sheet Drawer for Seamless Dossier & Inline Editing */}
      <SlideOverDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        employee={selectedEmployee}
        mode={drawerMode}
        onModeChange={setDrawerMode}
        onUpdate={handleFormSubmit}
        onDeleteRequest={handleOpenDelete}
      />

      {/* Create Team Member Modal */}
      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={null}
        mode="create"
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        employee={selectedEmployee}
        isDeleting={isDeleting}
      />

      {/* API Reference & Security Compliance Modal */}
      <ApiDocsModal
        isOpen={isApiDocsOpen}
        onClose={() => setIsApiDocsOpen(false)}
      />

      {/* Toast Alert Queue */}
      <ToastAlert toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

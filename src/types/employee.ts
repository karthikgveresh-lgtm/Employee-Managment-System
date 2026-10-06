/**
 * @file src/types/employee.ts
 * @description Frontend TypeScript types matching Mongoose model & API responses.
 */

export interface Employee {
  _id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  createdAt: string;
  updatedAt: string;
}

export type DepartmentType =
  | 'All'
  | 'Engineering'
  | 'Product'
  | 'Design'
  | 'Human Resources'
  | 'Marketing'
  | 'Sales'
  | 'Operations'
  | 'Finance';

export const DEPARTMENTS_LIST: DepartmentType[] = [
  'All',
  'Engineering',
  'Product',
  'Design',
  'Human Resources',
  'Marketing',
  'Sales',
  'Operations',
  'Finance',
];

export interface EmployeeFormData {
  name: string;
  email: string;
  department: string;
  designation: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
  errors?: string[];
  storageMode?: string;
  storageStatus?: {
    isMongoConnected: boolean;
    mode: string;
    uri: string;
    lastError?: string | null;
  };
}

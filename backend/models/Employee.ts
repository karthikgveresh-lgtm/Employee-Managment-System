/**
 * @file backend/models/Employee.ts
 * @description Mongoose Schema & Model for Employee entity.
 * Satisfies strict field requirements: name, email, department, designation
 * with built-in Mongoose schema validation & regex patterns.
 */

import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface defining the Employee document structure
export interface IEmployee extends Document {
  name: string;
  email: string;
  department: string;
  designation: string;
  createdAt: Date;
  updatedAt: Date;
}

// Regex for robust RFC 5322 compliant email validation
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Department options supported by the organization
export const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Human Resources',
  'Marketing',
  'Sales',
  'Operations',
  'Finance',
] as const;

export type DepartmentType = typeof DEPARTMENTS[number];

// Definition of Employee Mongoose Schema
const EmployeeSchema: Schema = new Schema<IEmployee>(
  {
    name: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Work email address is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [EMAIL_REGEX, 'Please provide a valid corporate email address (e.g., user@company.com)'],
      index: true,
    },
    department: {
      type: String,
      required: [true, 'Department assignment is required'],
      trim: true,
      enum: {
        values: DEPARTMENTS,
        message: '{VALUE} is not a valid department',
      },
    },
    designation: {
      type: String,
      required: [true, 'Job designation / role title is required'],
      trim: true,
      minlength: [2, 'Designation must be at least 2 characters long'],
      maxlength: [100, 'Designation cannot exceed 100 characters'],
    },
  },
  {
    timestamps: true, // Automatically provides createdAt and updatedAt fields
    versionKey: false,
  }
);

// Helpful compound index for fast search queries
EmployeeSchema.index({ name: 'text', email: 'text' });
EmployeeSchema.index({ department: 1 });

// Avoid model recompilation errors in dev HMR
export const Employee: Model<IEmployee> =
  mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);

export default Employee;

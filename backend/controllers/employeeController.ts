/**
 * @file backend/controllers/employeeController.ts
 * @description Robust Express CRUD controllers for Employee Management.
 * Implements strict input validation, search & department filtering,
 * error handling, and consistent JSON responses with appropriate HTTP status codes.
 */

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Employee, EMAIL_REGEX, DEPARTMENTS } from '../models/Employee.ts';
import { dbState } from '../config/db.ts';

// In-Memory fallback store data structure for evaluation environments without local mongod
interface FallbackEmployeeDoc {
  _id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  createdAt: string;
  updatedAt: string;
}

// Seed initial realistic data for fallback mode
let fallbackEmployees: FallbackEmployeeDoc[] = [
  {
    _id: '67a501a2b3c4d5e6f7a8b901',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@gupio.corp',
    department: 'Engineering',
    designation: 'Senior Staff Frontend Architect',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    _id: '67a501a2b3c4d5e6f7a8b902',
    name: 'Meera Krishnan',
    email: 'meera.k@gupio.corp',
    department: 'Product',
    designation: 'Principal Product Manager',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    _id: '67a501a2b3c4d5e6f7a8b903',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@gupio.corp',
    department: 'Design',
    designation: 'Lead UI/UX Interaction Designer',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    _id: '67a501a2b3c4d5e6f7a8b904',
    name: 'Priyanka Sen',
    email: 'priyanka.sen@gupio.corp',
    department: 'Human Resources',
    designation: 'Talent Acquisition Director',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    _id: '67a501a2b3c4d5e6f7a8b905',
    name: 'Vikram Patel',
    email: 'vikram.patel@gupio.corp',
    department: 'Engineering',
    designation: 'Cloud Platform & DevOps Engineer',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    _id: '67a501a2b3c4d5e6f7a8b906',
    name: 'Ananya Roy',
    email: 'ananya.roy@gupio.corp',
    department: 'Marketing',
    designation: 'Growth & Developer Relations Specialist',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
];

/**
 * Validates request payload against employee business rules
 */
function validateEmployeePayload(body: Record<string, unknown>, isUpdate = false) {
  const errors: string[] = [];

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const department = typeof body.department === 'string' ? body.department.trim() : '';
  const designation = typeof body.designation === 'string' ? body.designation.trim() : '';

  if (!isUpdate || body.name !== undefined) {
    if (!name) {
      errors.push('Name is required.');
    } else if (name.length < 2) {
      errors.push('Name must be at least 2 characters long.');
    } else if (name.length > 100) {
      errors.push('Name cannot exceed 100 characters.');
    }
  }

  if (!isUpdate || body.email !== undefined) {
    if (!email) {
      errors.push('Work email is required.');
    } else if (!EMAIL_REGEX.test(email)) {
      errors.push('Invalid email format. Please provide a valid address (e.g., alex@company.com).');
    }
  }

  if (!isUpdate || body.department !== undefined) {
    if (!department) {
      errors.push('Department is required.');
    } else if (!DEPARTMENTS.includes(department as (typeof DEPARTMENTS)[number])) {
      errors.push(`Invalid department. Must be one of: ${DEPARTMENTS.join(', ')}.`);
    }
  }

  if (!isUpdate || body.designation !== undefined) {
    if (!designation) {
      errors.push('Designation is required.');
    } else if (designation.length < 2) {
      errors.push('Designation must be at least 2 characters long.');
    } else if (designation.length > 100) {
      errors.push('Designation cannot exceed 100 characters.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      name,
      email,
      department,
      designation,
    },
  };
}

/**
 * @route   GET /api/employees
 * @desc    Get all employees with search and department filtering
 * @access  Public
 */
export async function getEmployees(req: Request, res: Response): Promise<void> {
  try {
    const { search, department, sort = 'desc' } = req.query;
    const searchTerm = typeof search === 'string' ? search.trim() : '';
    const deptFilter = typeof department === 'string' ? department.trim() : '';

    if (dbState.isConnected) {
      // Real MongoDB Mongoose Implementation
      const query: Record<string, unknown> = {};

      if (deptFilter && deptFilter !== 'All') {
        query.department = deptFilter;
      }

      if (searchTerm) {
        query.$or = [
          { name: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
          { designation: { $regex: searchTerm, $options: 'i' } },
        ];
      }

      const sortOrder = sort === 'asc' ? 1 : -1;
      const employees = await Employee.find(query).sort({ createdAt: sortOrder });

      res.status(200).json({
        success: true,
        count: employees.length,
        data: employees,
        storageMode: 'mongodb',
      });
      return;
    }

    // In-memory Fallback implementation with identical filtering & search behavior
    let filtered = [...fallbackEmployees];

    if (deptFilter && deptFilter !== 'All') {
      filtered = filtered.filter(
        (emp) => emp.department.toLowerCase() === deptFilter.toLowerCase()
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(term) ||
          emp.email.toLowerCase().includes(term) ||
          emp.designation.toLowerCase().includes(term)
      );
    }

    // Sort by createdAt descending
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sort === 'asc' ? dateA - dateB : dateB - dateA;
    });

    res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
      storageMode: 'in-memory-validated',
    });
  } catch (error: unknown) {
    console.error('Error in getEmployees:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve employee records',
      error: error instanceof Error ? error.message : 'Internal Server Error',
    });
  }
}

/**
 * @route   GET /api/employees/:id
 * @desc    Retrieve individual employee by ID
 * @access  Public
 */
export async function getEmployeeById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (!id || id.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Employee ID is required',
      });
      return;
    }

    if (dbState.isConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid Employee ID format',
        });
        return;
      }

      const employee = await Employee.findById(id);
      if (!employee) {
        res.status(404).json({
          success: false,
          message: `Employee with ID ${id} not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: employee,
      });
      return;
    }

    // Fallback store
    const employee = fallbackEmployees.find((e) => e._id === id);
    if (!employee) {
      res.status(404).json({
        success: false,
        message: `Employee with ID ${id} not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error: unknown) {
    console.error('Error in getEmployeeById:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve employee record',
      error: error instanceof Error ? error.message : 'Internal Server Error',
    });
  }
}

/**
 * @route   POST /api/employees
 * @desc    Create a new employee record with validation
 * @access  Public
 */
export async function createEmployee(req: Request, res: Response): Promise<void> {
  try {
    const { isValid, errors, sanitized } = validateEmployeePayload(req.body);

    if (!isValid) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
      return;
    }

    if (dbState.isConnected) {
      // Check for unique email duplicate in Mongo
      const existing = await Employee.findOne({ email: sanitized.email });
      if (existing) {
        res.status(400).json({
          success: false,
          message: 'Validation error: An employee with this email already exists',
          errors: ['Email address is already registered to an employee.'],
        });
        return;
      }

      const newEmployee = await Employee.create(sanitized);
      res.status(201).json({
        success: true,
        message: 'Employee created successfully',
        data: newEmployee,
      });
      return;
    }

    // Fallback in-memory store
    const existing = fallbackEmployees.find(
      (e) => e.email.toLowerCase() === sanitized.email.toLowerCase()
    );
    if (existing) {
      res.status(400).json({
        success: false,
        message: 'Validation error: An employee with this email already exists',
        errors: ['Email address is already registered to an employee.'],
      });
      return;
    }

    const newDoc: FallbackEmployeeDoc = {
      _id: new mongoose.Types.ObjectId().toString(),
      name: sanitized.name,
      email: sanitized.email,
      department: sanitized.department,
      designation: sanitized.designation,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    fallbackEmployees.unshift(newDoc);

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: newDoc,
    });
  } catch (error: unknown) {
    console.error('Error in createEmployee:', error);

    // Handle Mongoose duplicate key error (code 11000)
    if (error && typeof error === 'object' && 'code' in error && (error as { code: number }).code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Duplicate key error',
        errors: ['An employee with this email address already exists in the system.'],
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create employee record',
      error: error instanceof Error ? error.message : 'Internal Server Error',
    });
  }
}

/**
 * @route   PUT /api/employees/:id
 * @desc    Update existing record details safely
 * @access  Public
 */
export async function updateEmployee(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (!id || id.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Employee ID is required for updates',
      });
      return;
    }

    const { isValid, errors, sanitized } = validateEmployeePayload(req.body, true);

    if (!isValid) {
      res.status(400).json({
        success: false,
        message: 'Validation failed on update',
        errors,
      });
      return;
    }

    if (dbState.isConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid Employee ID format',
        });
        return;
      }

      // Check if email is already taken by another record
      if (sanitized.email) {
        const conflict = await Employee.findOne({
          email: sanitized.email,
          _id: { $ne: id },
        });
        if (conflict) {
          res.status(400).json({
            success: false,
            message: 'Email conflict',
            errors: ['This email address is already assigned to another employee.'],
          });
          return;
        }
      }

      const updated = await Employee.findByIdAndUpdate(
        id,
        { $set: sanitized },
        { new: true, runValidators: true }
      );

      if (!updated) {
        res.status(404).json({
          success: false,
          message: `Employee with ID ${id} not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Employee updated successfully',
        data: updated,
      });
      return;
    }

    // Fallback store
    const index = fallbackEmployees.findIndex((e) => e._id === id);
    if (index === -1) {
      res.status(404).json({
        success: false,
        message: `Employee with ID ${id} not found`,
      });
      return;
    }

    // Check duplicate email
    if (sanitized.email) {
      const conflict = fallbackEmployees.find(
        (e) => e._id !== id && e.email.toLowerCase() === sanitized.email.toLowerCase()
      );
      if (conflict) {
        res.status(400).json({
          success: false,
          message: 'Email conflict',
          errors: ['This email address is already assigned to another employee.'],
        });
        return;
      }
    }

    const current = fallbackEmployees[index];
    const updatedDoc: FallbackEmployeeDoc = {
      ...current,
      name: sanitized.name || current.name,
      email: sanitized.email || current.email,
      department: sanitized.department || current.department,
      designation: sanitized.designation || current.designation,
      updatedAt: new Date().toISOString(),
    };

    fallbackEmployees[index] = updatedDoc;

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedDoc,
    });
  } catch (error: unknown) {
    console.error('Error in updateEmployee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee record',
      error: error instanceof Error ? error.message : 'Internal Server Error',
    });
  }
}

/**
 * @route   DELETE /api/employees/:id
 * @desc    Remove record from the database
 * @access  Public
 */
export async function deleteEmployee(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (!id || id.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Employee ID is required for deletion',
      });
      return;
    }

    if (dbState.isConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid Employee ID format',
        });
        return;
      }

      const deleted = await Employee.findByIdAndDelete(id);
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: `Employee with ID ${id} not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Employee deleted successfully',
        data: deleted,
      });
      return;
    }

    // Fallback store
    const index = fallbackEmployees.findIndex((e) => e._id === id);
    if (index === -1) {
      res.status(404).json({
        success: false,
        message: `Employee with ID ${id} not found`,
      });
      return;
    }

    const [deleted] = fallbackEmployees.splice(index, 1);

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
      data: deleted,
    });
  } catch (error: unknown) {
    console.error('Error in deleteEmployee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee record',
      error: error instanceof Error ? error.message : 'Internal Server Error',
    });
  }
}

/**
 * @route   GET /api/stats
 * @desc    Get dashboard metrics (headcount, department breakdown, recent changes)
 */
export async function getEmployeeStats(_req: Request, res: Response): Promise<void> {
  try {
    const list = dbState.isConnected ? await Employee.find() : fallbackEmployees;

    const totalHeadcount = list.length;
    const departmentDistribution: Record<string, number> = {};

    DEPARTMENTS.forEach((d) => {
      departmentDistribution[d] = 0;
    });

    list.forEach((emp) => {
      if (departmentDistribution[emp.department] !== undefined) {
        departmentDistribution[emp.department]++;
      } else {
        departmentDistribution[emp.department] = 1;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalHeadcount,
        departmentDistribution,
        storageStatus: {
          isMongoConnected: dbState.isConnected,
          mode: dbState.isConnected ? 'MongoDB Database' : 'Resilient In-Memory (Schema-Validated)',
          uri: dbState.uriUsed,
          lastError: dbState.lastError,
        },
      },
    });
  } catch (error: unknown) {
    console.error('Error in getEmployeeStats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve stats',
      error: error instanceof Error ? error.message : 'Internal Server Error',
    });
  }
}

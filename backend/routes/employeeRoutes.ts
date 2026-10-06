/**
 * @file backend/routes/employeeRoutes.ts
 * @description Express routing definitions for Employee Management CRUD API.
 */

import { Router } from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
} from '../controllers/employeeController.ts';

const router = Router();

// Routes for base collection & statistics
router.route('/').get(getEmployees).post(createEmployee);
router.route('/stats').get(getEmployeeStats);

// Routes for individual employee records by ID
router
  .route('/:id')
  .get(getEmployeeById)
  .put(updateEmployee)
  .delete(deleteEmployee);

export default router;

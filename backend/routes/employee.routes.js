import express from 'express';

import { getEmployees, createEmployee, deleteEmployee } from '../controllers/employee.controller.js';
import { authenticateToken, verifyAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET all employees
router.get('/', authenticateToken, getEmployees);

// CREATE a new employee 
router.post('/', authenticateToken, createEmployee); 

// DELETE an employee
router.delete('/:id', authenticateToken, verifyAdmin, deleteEmployee);

export default router;
import express from 'express';

import { addExpense, getExpenses } from '../controllers/expenseController.js';

const router = express.Router();

// Route to get all expenses
router.post('/add', addExpense);
router.get('/list', getExpenses);   

export default router;
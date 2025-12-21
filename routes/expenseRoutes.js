import express from "express";

import {
  addExpense,
  getMyExpenses,
  getAllExpenses,
  getMonthlyExpenses,
  deleteExpense,
  updateExpense,
} from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to get all expenses
// add expense (requires auth)
router.post("/add", protect, addExpense);

// get expenses for the logged-in user (requires auth)
router.get("/my", protect, getMyExpenses);

// get all expenses (public)
router.get("/all", getAllExpenses);

// monthly report route (requires auth)
router.get("/monthly-report/:userId/:year/:month", protect, getMonthlyExpenses);
router.delete("/delete/:id", protect, deleteExpense);
router.put("/update/:id", protect, updateExpense);

export default router;

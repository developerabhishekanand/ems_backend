import db from "../config/db.js";

// Controller to add a new expense
export const addExpense = (req, res) => {
  const { title,amount, category, date } = req.body;

  const query = 'INSERT INTO expenses (title,amount,category,expense_date) VALUES (?,?, ?, ?)';
  
  db.query(query, [title,amount, category, date], (err, result) => {
    if (err) {
      console.error('Error adding expense:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Expense added', expenseId: result.insertId });
  });
}

//get all expenses
export const getExpenses = (req, res) => {
  const query = 'SELECT * FROM expenses ORDER BY expense_date DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching expenses:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json(results);
  });
}

//delete an expense
export const deleteExpense = (req, res) => {
  const expenseId = req.params.id;

  const query = 'DELETE FROM expenses WHERE id = ?';
  
  db.query(query, [expenseId], (err, result) => {
    if (err) {
      console.error('Error deleting expense:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json({ message: 'Expense deleted' });
  });
}

//update an expense
export const updateExpense = (req, res) => {
  const expenseId = req.params.id;
  const { title, amount, category, date } = req.body;

  const query = 'UPDATE expenses SET title = ?, amount = ?, category = ?, expense_date = ? WHERE id = ?';
  
  db.query(query, [title, amount, category, date, expenseId], (err, result) => {
    if (err) {
      console.error('Error updating expense:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json({ message: 'Expense updated' });
  });
}
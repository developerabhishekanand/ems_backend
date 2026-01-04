import { getPool } from "../config/db.js";

// Controller to add a new expense
export const addExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    const userId = req.user?.id;
    console.log("REQ.USER:", req.user);

    if (!title || !amount || !category || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found" });
    }

    // 3️⃣ Validate date format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Always provide values for all placeholders
    // 4️⃣ Prepare SQL
    const sql =
      "INSERT INTO expenses (user_id, title, amount, category, date, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
    const params = [userId, title, amount, category, date];

    const pool = getPool();
    const [result] = await pool.query(sql, params); // ✅ no .promise()
    return res.status(201).json({
      message: "Expense added successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error adding expense:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch all expenses for logged-in user
export const getMyExpenses = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const query = "SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC";
    const pool = getPool();
    const [rows] = await pool.query(query, [userId]); // ✅ no .promise()

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching user expenses:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all expenses
export const getAllExpenses = async (req, res) => {
  try {
    const query = `
  SELECT e.*, u.name, u.email from expenses e
  JOIN users u ON u.id = e.user_id
  ORDER BY e.date DESC
  `;

    const pool = getPool();
    const [rows] = await pool.query(query);
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching all expenses:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Return expense details by id
export const getMonthlyExpenses = (req, res) => {
  const { userId, year, month } = req.params;

  const query = `
    SELECT SUM(amount) AS total_amount,
    count(*) AS totlal_expenses
    FROM expenses
    WHERE user_id = ? AND YEAR(date) = ? AND MONTH(date) = ?
  `;

  const pool = getPool();

  pool.query(query, [userId, year, month], (err, results) => {
    if (err) {
      console.error("Error fetching monthly expenses:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results[0]);
  });
};

//delete an expense
export const deleteExpense = (req, res) => {
  const expenseId = req.params.id;

  const query = "DELETE FROM expenses WHERE id = ?";
  const pool = getPool();

  // Ensure the requester owns the expense
  pool.query(
    "SELECT user_id FROM expenses WHERE id = ?",
    [expenseId],
    (err, rows) => {
      if (err) {
        console.error("Error checking expense owner:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (!rows.length)
        return res.status(404).json({ message: "Expense not found" });
      const ownerId = rows[0].user_id;
      const requesterId = req.user?.id;
      if (ownerId !== requesterId)
        return res.status(403).json({ message: "Forbidden" });

      db.query(query, [expenseId], (err2, result) => {
        if (err2) {
          console.error("Error deleting expense:", err2);
          return res.status(500).json({ error: "Database error" });
        }
        res.status(200).json({ message: "Expense deleted" });
      });
    }
  );
};

//update an expense
export const updateExpense = (req, res) => {
  const expenseId = req.params.id;
  const { title, amount, category, date } = req.body;
  const query =
    "UPDATE expenses SET title = ?, amount = ?, category = ?, date = ? WHERE id = ?";

  const pool = getPool();
  // Ensure the requester owns the expense
  pool.query(
    "SELECT user_id FROM expenses WHERE id = ?",
    [expenseId],
    (err, rows) => {
      if (err) {
        console.error("Error checking expense owner:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (!rows.length)
        return res.status(404).json({ message: "Expense not found" });
      const ownerId = rows[0].user_id;
      const requesterId = req.user?.id;
      if (ownerId !== requesterId)
        return res.status(403).json({ message: "Forbidden" });

      pool.query(
        query,
        [title, amount, category, date, expenseId],
        (err2, result) => {
          if (err2) {
            console.error("Error updating expense:", err2);
            return res.status(500).json({ error: "Database error" });
          }
          res.status(200).json({ message: "Expense updated" });
        }
      );
    }
  );
};

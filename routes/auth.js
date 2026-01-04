// routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getPool } from "../config/db.js";

const router = express.Router();

// User registration

router.post("/register", async (req, res) => {
  try {
    const pool = getPool();
    const { name, email, password } = req.body;
    // Check existing user
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hash]
    );
    const userId = result.insertId;
    const token = jwt.sign(
      { id: result.insertId },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );
    res.status(201).json({ message: "User registered", token });
  } catch (err) {
    console.log("Register error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const pool = getPool();
    const { email, password } = req.body;
    const [users] = await pool.query("SELECT * FROM users WHERE email=?", [
      email,
    ]);
    if (!users.length) return res.status(401).json({ message: "Invalid user" });

    const valid = await bcrypt.compare(password, users[0].password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      {
        id: users[0].id, // or user.user_id
        email: users[0].email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: users[0].id,
        name: users[0].name,
        email: users[0].email,
      },
    });
  } catch (err) {
    console.log("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Public: list all registered users (omit passwords)
router.get("/users", async (req, res) => {
  try {
    const pool = getPool();
    const [users] = await pool.query("SELECT name, email FROM users");
    res.json(users);
  } catch (err) {
    console.log("Error fetching users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

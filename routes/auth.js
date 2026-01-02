// routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import cors from "cors";

const router = express.Router();

//github.com/developerabhishekanand/ems
// Use the cors middleware
https: router.use(
  cors({
    origin: "https://github.com/developerabhishekanand/ems", // Allow only your frontend URL
  })
);

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const [existing] = await db
      .promise()
      .query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length)
      return res.status(400).json({ message: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db
      .promise()
      .query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
        name,
        email,
        hash,
      ]);
    const userId = result.insertId;
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1d",
    });
    res.status(201).json({ message: "User registered", token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const [users] = await db
    .promise()
    .query("SELECT * FROM users WHERE email=?", [email]);

  if (!users.length) return res.status(401).json({ message: "Invalid user" });

  const valid = await bcrypt.compare(password, users[0].password);
  if (!valid) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign(
    { id: users[0].id },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1d" }
  );
  res.json({ token, user: users[0] });
});

// Public: list all registered users (omit passwords)
router.get("/users", async (req, res) => {
  try {
    const [users] = await db.promise().query("SELECT name, email FROM users");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

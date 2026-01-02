// index.js
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import expenseRoutes from "./routes/expenseRoutes.js";

const app = express();
app.use(
  cors({
    origin: "*", // TEMPORARY for debugging
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

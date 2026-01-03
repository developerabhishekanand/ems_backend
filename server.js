// index.js
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import expenseRoutes from "./routes/expenseRoutes.js";

const app = express();
app.use(cors({ origin: "*", credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/expenses", expenseRoutes);

app.get("/", (req, res) => {
  res.send("EMS Backend is running");
});

export default app;

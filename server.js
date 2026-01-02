// index.js
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import expenseRoutes from "./routes/expenseRoutes.js";

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ems-nyrqbkkun-developerabhishekanands-projects.vercel.app/",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

export default app;

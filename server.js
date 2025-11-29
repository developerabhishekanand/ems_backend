import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import expenseRouter from './routes/expenseRoutes.js';

const app = express();

app.use(cors()); // Allow frontend requests

//middleware to parse JSON bodies
app.use(express.json());

app.use('/api/expense', expenseRouter);

const port = process.env.PORT || 5000;

//Default route
app.get('/', (req, res) => {
  res.send('Welcome to the EMS Backend!');
});

app.post("/api/data", (req, res) => {
    res.json({ message: "Data received", data: req.body });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

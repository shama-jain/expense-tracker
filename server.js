const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let expenses = []; // Sample data

// Define route to get all expenses
app.get('/api/expenses', (req, res) => {
    res.json(expenses);
});

// Define route to add a new expense
app.post('/api/expenses', (req, res) => {
    const expense = req.body;
    expense.id = Date.now().toString(); // Simple ID generator
    expenses.push(expense);
    res.status(201).json(expense);
});

// Define route to update an expense
app.put('/api/expenses/:id', (req, res) => {
    console.log('Received POST request:', req.body); // Debugging line
    const { id } = req.params;
    const updatedExpense = req.body;
    let expenseIndex = expenses.findIndex(exp => exp.id === id);
    if (expenseIndex !== -1) {
        expenses[expenseIndex] = { ...expenses[expenseIndex], ...updatedExpense };
        res.json(expenses[expenseIndex]);
    } else {
        res.status(404).send('Expense not found');
    }
});

// Define route to delete an expense
app.delete('/api/expenses/:id', (req, res) => {
    console.log('Received DELETE request for ID:', req.params.id); // Debugging line
    const { id } = req.params;
    expenses = expenses.filter(exp => exp.id !== id);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list').getElementsByTagName('tbody')[0];
    const summaryDiv = document.getElementById('summary');
    const apiUrl = 'http://localhost:3000/api/expenses'; // Adjust if necessary

    // Function to fetch and display expenses
    async function fetchExpenses() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            const expenses = await response.json();
            expenseList.innerHTML = expenses.map(expense => `
                <tr>
                    <td>${expense.description}</td>
                    <td>$${expense.amount.toFixed(2)}</td>
                    <td>${expense.category}</td>
                    <td>
                        <button class="delete-button" data-id="${expense.id}">Delete</button>
                        <button class="edit-button" data-id="${expense.id}" data-description="${expense.description}" data-amount="${expense.amount}" data-category="${expense.category}">Edit</button>
                    </td>
                </tr>
            `).join('');
            updateSummary(expenses);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    }

    // Function to handle form submit
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;

        if (!description || isNaN(amount) || !category) {
            alert('Please fill out all fields.');
            return;
        }

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description, amount, category })
            });
            if (!response.ok) throw new Error('Network response was not ok');
            form.reset();
            fetchExpenses(); // Refresh the list
        } catch (error) {
            console.error('Error saving expense:', error);
        }
    });

    // Function to delete an expense
    async function deleteExpense(id) {
        try {
            const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Network response was not ok');
            fetchExpenses(); // Refresh the list
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    }

    // Function to populate form for editing
    function editExpense(id, description, amount, category) {
        document.getElementById('description').value = description;
        document.getElementById('amount').value = amount;
        document.getElementById('category').value = category;
        form.dataset.editId = id;
    }

    // Function to update the summary
    function updateSummary(expenses) {
        const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        summaryDiv.innerHTML = `<p>Total Expenses: $${totalAmount.toFixed(2)}</p>`;
    }

    // Event delegation for dynamically added buttons
    expenseList.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('delete-button')) {
            const id = target.dataset.id;
            deleteExpense(id);
        } else if (target.classList.contains('edit-button')) {
            const id = target.dataset.id;
            const description = target.dataset.description;
            const amount = parseFloat(target.dataset.amount);
            const category = target.dataset.category;
            editExpense(id, description, amount, category);
        }
    });

    // Initial fetch of expenses
    fetchExpenses();
});

// script.js

document.addEventListener('DOMContentLoaded', function () {
    fetchExpenses();
    // Add event listener for form submission
    document.getElementById('expenseForm').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        const formData = new FormData(this);
        try {
            const response = await axios.post('/expense/add', {
                category: formData.get('category'),
                description: formData.get('description'),
                amount: formData.get('amount')
            });
            if (response.status === 201) {
                fetchExpenses(); // Refresh the table after adding an expense
                this.reset(); // Reset the form fields
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

// Function to fetch expenses and populate the table
async function fetchExpenses() {
    const isLoggedIn = localStorage.getItem('email');
    if (!isLoggedIn) {
        console.log('Login to access this page');
        alert("Login to access this page");
        window.location.href = '/user/login'; // Redirect to login page
        return; // Stop further execution
    }
    
    try {
        const response = await axios.get('/expense/get');
        const expenses = response.data;
        const expenseTableBody = document.getElementById('expenseTableBody');
        expenseTableBody.innerHTML = ''; // Clear previous data

        let totalExpense = 0; // Initialize total expense

        // Add expenses data to the table
        expenses.forEach(expense => {
            totalExpense += parseFloat(expense.amount); // Add current expense amount to total
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${expense.category}</td>
                <td>${expense.description}</td>
                <td>${expense.amount}</td>
                <td>
                    <button onclick="deleteExpense('${expense.id}')">Delete</button>
                </td>
            `;
            expenseTableBody.appendChild(row);
        });

        // Display total expense
        const totalExpenseElement = document.getElementById('totalExpense');
        totalExpenseElement.textContent = ` ${totalExpense} `;

    //     var totalRow = '<tr><td colspan="2"><strong>Total:</strong></td><td><strong>' + totalAmount.toFixed(2) + '</strong></td><td></td></tr>';
    // tableBody.insertAdjacentHTML('beforeend', totalRow);


    } catch (error) {
        console.error('Error:', error);
    }
}

// // Function to handle editing an expense
// async function editExpense(id) {
//     const category = prompt('Enter new category:');
//     const description = prompt('Enter new description:');
//     const amount = prompt('Enter new amount:');
//     try {
//         const response = await axios.put(`/expenses/${id}`, { category, description, amount });
//         if (response.status === 200) {
//             fetchExpenses(); // Refresh the table after editing an expense
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// Function to handle deleting an expense
async function deleteExpense(id) {
    if (!id) {
        console.error('Error: ID is undefined');
        return;
    }
    // Remove the quotes from around the ID
    id = id.replace(/['"]+/g, ''); // Remove quotes if present
    if (confirm('Are you sure you want to delete this expense?')) {
        try {
            const response = await axios.delete(`/expense/delete/${id}`);
            if (response.status === 200) {
                fetchExpenses(); // Refresh the table after deleting an expense
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

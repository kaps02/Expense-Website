// script.js


document.addEventListener('DOMContentLoaded', function () {
    fetchExpenses();
    // Add event listener for form submission
    document.getElementById('expenseForm').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        const token = localStorage.getItem('token');
        const formData = new FormData(this);

        try {
            const response = await axios.post('/expense/add', {        //axios call
                category: formData.get('category'),
                description: formData.get('description'),
                amount: formData.get('amount')
            }
                , { headers: { 'Authorization': token } });

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
    const token = localStorage.getItem('token');
    console.log("response from token .........", token);
    if (!token) {
        console.log('Login to access this page');
        alert("Login to access this page");
        window.location.href = '/user/login'; // Redirect to login page
        return; // Stop further execution
    }

    try {
        const response = await axios.get(`/expense/get` ,
             { headers: { 'Authorization': token } });      //axios call.......
            

        //const response = await axios.get('/expense/get' ,  { Headers : {'Authorization': token}});
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



    } catch (error) {
        console.error('Error:', error);
    }
}


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
                const token = localStorage.getItem('token');

            const response = await axios.delete(`/expense/delete/${id}` ,
             { headers: { 'Authorization': token } });      //axio call.......
            
             if (response.status === 200) {
                fetchExpenses(); // Refresh the table after deleting an expense
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

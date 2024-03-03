// script.js

////////////////// payment frontend.................
document.getElementById("buy-button").onclick = async function (e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
        const result = await axios.get("/payment/createOrder", {
            headers: { 'Authorization': token }
        });

        const options = {
            key: result.data.key_id,
            order_id: result.data.order.id,
            handler: async function (response) {
                try {
                    await axios.post("/payment/updateOrder", {
                        order_id: result.data.order.id,
                        payment_id: response.razorpay_payment_id,
                        status: "SUCCESS",
                    }, {
                        headers: { "Authorization": token }
                    });
                    alert("You are a premium User Now");
                } catch (error) {
                    console.error(error);
                    alert("Failed to update order status");
                }
            }
        };

        const razorpayObject = new Razorpay(options);
        razorpayObject.open();
    } catch (error) {
        console.error(error);
        alert("Failed to create payment order");
    }
};

async function fetchPremium() {
    try {console.log("we are in fetch...");
        const token = localStorage.getItem('token');
        const response = await axios.get(`/payment/userData`, {
            headers: { 'Authorization': token }
        });

        const isPremiumUser = response.data.isPremiumUser;
        const btn = document.getElementById('buy-button');

        if (isPremiumUser) {
            btn.style.display = 'none';
            
        } else {
            btn.style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}





  /////////////////////// expense.js.........................


document.addEventListener('DOMContentLoaded', function () {
    fetchExpenses();
    fetchPremium();

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




document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
    
            const email = document.querySelector('#email').value;
            const password = document.querySelector('#password').value;
    
            try {
                const response = await axios.post('/user/login', {
                    email,
                    password
                });
    
                if (response.status === 200) {
                    console.log('Login successful');
                    // Optionally, redirect the user to another page or perform other actions
                } else {
                    console.error('Login failed');
                    // Optionally, display an error message to the user
                }
            } catch (error) {
                console.error('Error:', error);
                // Optionally, display an error message to the user
            }
        });
    }

    const signupForm = document.querySelector('#form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission behavior
            const formData = new FormData(signupForm);
            try {
                const response = await axios.post('/user/signup', {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    password: formData.get('password')
                });
                if (response.status === 200) {
                    console.log("user register successfully....")
                    //signupForm.reset(); // Reset the form fields
                }
            } catch (error) {
                console.error('Error in signup form :', error);
            }
        });
    }
});

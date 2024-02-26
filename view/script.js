
document.getElementById('form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const formData = new FormData(this);
    try {
        const response = await axios.post('/user/signup', {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password')
        });
        if (response.status === 201) {
            this.reset(); // Reset the form fields
        }
    } catch (error) {
        console.error('Error in signup form :', error);
    }
})

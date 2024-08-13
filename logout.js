document.addEventListener('DOMContentLoaded', () => {
    const element = document.getElementById('logoutBtn');

    element.addEventListener('click', async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://expense-tracker-backend-api-endpoints.netlify.app/logout', {
                method: 'GET',
                credentials: 'same-origin' // You can use 'same-origin' or 'include' depending on your needs
            });
        
            if (response.ok) {
                alert('Logging you out.');
                window.location.replace('./login.html');
            }
            else{
                alert('an error occured.Please give it a short');
                console.log(secret);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    });
});

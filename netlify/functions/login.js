document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const authMsg = document.getElementById('auth-msg');

    // Form submission event listener
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('https://expense-tracker-backend-api-endpoints.netlify.app/netlify/functions/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                alert('Bravo, Login request was successful!');
                window.location.replace('./dashboard.html'); // Redirect to dashboard on success
            } else {
                const errorData = await response.json();
                authMsg.textContent = errorData.message || "Login failed. Please check your credentials.";
            }
        } catch (err) {
            authMsg.textContent = 'An error occurred. Please try again later.';
            console.error('Login error:', err); // Log error for debugging
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const authMsg = document.getElementById('auth-msg');
    const apiUrl = window.API_URL || 'http://localhost:3000'; // Make sure to set a default value or handle undefined

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                alert('Bravo, Login request was successful!');
                window.location.replace('./dashboard.html'); // Ensure this path is correct
            } else {
                const errorData = await response.json();
                authMsg.textContent = errorData.message || "Login failed. Please check your credentials.";
            }
        } catch (err) {
            authMsg.textContent = 'An error occurred. Please try again later.';
            console.error('Login error:', err); // Log error for debugging
        }
    });

    const a = document.getElementById('dashboard');

    if (a) {
        a.addEventListener('click', () => {
            a.href = './login.html'; // Ensure this path is correct
        });
    }
});

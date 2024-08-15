document.getElementById('cancelButton').addEventListener('click', function () {
     // document.getElementById('update-form').reset();

     window.location.replace('./dashboard.html');
});

const a = document.getElementById('arrow-back');

function handleBack() {
     window.location.replace('./dashboard.html');
}

a.onclick = handleBack;

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-form');
    const authMsg = document.getElementById('auth-msg');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const expense = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('https://expense-tracker-backend-api-endpoints.netlify.app/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                // If login is successful, redirect to the dashboard
                alert('Bravo, Login request was successful!')
                window.location.replace('./dashboard.html'); // Change to your dashboard URL
            } else {
                // If login fails, display an error message
                const errorData = await response.json();
                authMsg.textContent = errorData.message || "Login failed. Please check your credentials.";
            }
        } catch (err) {
            authMsg.textContent = 'An error occurred. Please try again later.';
        }
    });
});
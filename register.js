document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const apiUrl = window.API_URL || 'https://expense-tracker-backend-api-endpoints.netlify.app:3000';
    

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const authMsg = document.getElementById('auth-msg');


        try{
            const response = await fetch(`${apiUrl}/register`, {
                method: 'POST',
                headers:  {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, username, password })
            });

            const data = response.data;

            if(!response.ok) {
                authMsg.textContent = "User already exists!";
            } else {
                alert('Bravo, Registration request successful!');
                window.location.replace('./login.html');
            }

        } catch (err) {
            authMsg.textContent = 'An error occured';
        }
    })

})

const a = document.getElementById('dashboard');

function handleDashboard() {
    a.href = './login.html';
}

a.onclick = handleDashboard;

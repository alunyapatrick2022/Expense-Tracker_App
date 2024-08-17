document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    // const apiUrl = window.API_URL || 'https://expense-tracker-backend-api-endpoints.netlify.app';
    

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const authMsg = document.getElementById('auth-msg');


        try{
            // const response = await fetch(`${apiUrl}/public/register`,
            const response = await fetch(`https://expense-tracker-backend-api-endpoints.netlify.app/register`, {
                method: 'POST',
                headers:  {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, username, password })
            });

            const data = response.data;

            if(response.ok) {
                alert('Bravo, Registration request successful!');
                window.location.replace('./login.html');
            } else {
                authMsg.textContent = "Error Creating an account. Please try again";
                textContent.style.color = 'green';
            }

        } catch (err) {
            authMsg.textContent = 'An error occured';
            textContent.style.color = 'red';
        }
    })

})

const a = document.getElementById('dashboard');

function handleDashboard() {
    a.href = './login.html';
}

a.onclick = handleDashboard;

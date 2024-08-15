document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form')
    

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
         const password = document.getElementById('password').value;
        //  const confirmPassword = document.getElementById('confirm-password').value;
         const authMsg = document.getElementById('auth-msg');
         
     //     if (confirmPassword != newPassword) {
     //          authMsg.textContent = 'Password does not much!';
     //     }

     //     else {
     //          alert("Password Confimed!")
     //     }

        try{
            const response = await fetch('https://expense-tracker-backend-api-endpoints.netlify.app/reset', {
                method: 'POST',
                headers:  {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = response.data;

             if (!response.ok) {
                window.location.replace = "./register.html"
             } else {
                  window.location.replace = "./login.html"
             }

        } catch (err) {
            authMsg.textContent = 'An error occured';
        }
    })

})
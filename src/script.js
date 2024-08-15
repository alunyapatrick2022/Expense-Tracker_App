
const button = document.getElementById('register');
const a = document.getElementById('dashboard');

function handleOnClick() {
    button.style.display = 'block'; // Correctly set the display property
    window.location.replace('./register.html'); // Correctly use replace method
}

// Attach the event listener to the button
button.onclick = handleOnClick;

function handleDashboard() {
    a.href = './login.html';
}

a.onclick = handleDashboard;
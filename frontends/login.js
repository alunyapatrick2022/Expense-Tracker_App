const dashboardLink = document.getElementById('dashboard');
if (dashboardLink) {
    dashboardLink.addEventListener('click', () => {
        dashboardLink.href = './login.html'; // Ensure this path is correct
    });
}
const a = document.getElementById('arrow-back');

function handleBack() {
     window.location.replace('./dashboard.html') ;
}

a.onclick = handleBack;
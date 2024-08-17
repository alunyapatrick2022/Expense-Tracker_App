document.getElementById('cancelButton').addEventListener('click', function () {
     // document.getElementById('update-form').reset();

     window.location.replace('./dashboard.html');
});

const a = document.getElementById('arrow-back');

function handleBack() {
     window.location.replace('./dashboard.html') ;
}

a.onclick = handleBack;

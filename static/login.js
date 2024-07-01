document.getElementById("login").addEventListener("click", () => {
    const user = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    fetch('/users/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(data => {
        if (data.authToken) {
            // Stocker le token dans le session storage
            sessionStorage.setItem('authToken', data.authToken);
            // Rediriger vers la page principale
            fetch('/users/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.authToken}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.team === 'admin') {
                    window.location.replace('./admin.html', '_blank');
                } else {
                    window.location.replace('./index.html', '_blank');
                }
            })
        } else {
            console.error('Authentication failed');
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
    });
});


document.getElementById("not_registered").addEventListener("click", () => {
    window.location.replace('./signin.html')
})

document.getElementById('return_button').addEventListener("click", () => {
    window.location.replace('./index.html')
})
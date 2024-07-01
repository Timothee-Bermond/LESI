document.getElementById("signin").addEventListener("click", () => {
    const user = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }
    fetch('/users',{
        method:'POST',
        credentials: 'include',
        headers:{
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(user)
      })
      .then(response => response.json())
      .then(data => {
        if (data.authToken) {
            // Stocker le token dans le session storage
            sessionStorage.setItem('authToken', data.authToken);
            // Rediriger vers la page principale
            window.location.replace('./index.html');
        } else {
            console.error('Authentication failed');
        }
      })
      .catch(error => {
        console.error('Error during signin:', error);
      });
})

document.getElementById('return_button').addEventListener("click", () => {
  window.location.replace('./index.html')
})
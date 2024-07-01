document.addEventListener('DOMContentLoaded', () => {

    // Récupérer le token depuis le session storage
    const authToken = sessionStorage.getItem('authToken');

    // Afficher le bouton login ou logout

    if (!authToken) {
        document.getElementById('logout').classList.add('hide');
        document.getElementById('login').classList.remove('hide');
    } else {
        document.getElementById('login').classList.add('hide');
        document.getElementById('logout').classList.remove('hide');
    }

    // Fonction pour trier les matchs à afficher
    function sortMatches(matchList, authToken) {
        fetch('/users/me', {
            method: 'GET',
            credentials: 'include', // Inclure les cookies dans la requête
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            return response.json();
        })
        .then(user => {
            console.log('User récupéré: ', user);
            if (user.team !== 'admin') {
                const matchListSorted = []
                matchList.forEach(match => {
                    if (((match.Team1 == user.team) || (match.Team2 == user.team)) && (match.Phase !== 'Incoming')) {
                        matchListSorted.push(match)
                    }
                })
                console.log(matchListSorted)
                displayMesMatches(matchListSorted, user);
                displayTousLesMatches(matchList, user)
            }
            
        })
        .catch(error => {
            console.error('Erreur lors de la récupération du user:', error);
        });
    }
    
    // Fonction pour afficher les matchs
    function displayMesMatches(matchList, user) {
        const matchListElement = document.getElementById('mesMatchList');
        matchListElement.innerHTML = ''; // Réinitialiser la liste

        matchList.forEach(match => {
            const matchItem = document.createElement('li');
            matchItem.className = 'match';
            matchItem.textContent = `${match.Team1} vs ${match.Team2}`;
            matchItem.addEventListener('click', () => {
                openMatchDetails(match);
            });      
            matchListElement.appendChild(matchItem);
        });
    }

    function displayTousLesMatches(matchList, user) {
        const matchListElement = document.getElementById('tousLesMatchList');
        matchListElement.innerHTML = ''; // Réinitialiser la liste

        matchList.forEach(match => {
            const matchItem = document.createElement('li');
            matchItem.className = 'match';
            matchItem.textContent = `${match.Team1} vs ${match.Team2}`;
            if (((match.Team1 == user.team || match.Team2 == user.team) && match.Phase != 'Incoming') || match.Phase == 'Terminated') {
                matchItem.addEventListener('click', () => {
                    openMatchDetails(match);
                });
            }
            
            matchListElement.appendChild(matchItem);
        });
    }

    // Fonction pour ouvrir les détails du match
    function openMatchDetails(match) {
        sessionStorage.setItem('matchDetails', JSON.stringify(match));
        window.location.replace('./draft.html');
    }

    // Utiliser le token dans la requête fetch
    fetch('/match', {
        method: 'GET',
        credentials: 'include', // Inclure les cookies dans la requête
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch matches');
        }
        return response.json();
    })
    .then(data => {
        sortMatches(data, authToken);
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des matchs:', error);
    });

    document.getElementById("logout").addEventListener("click", () => {
        fetch('/users/logout', {
            method: 'POST',
            credentials: 'include', // Inclure les cookies dans la requête
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(
            sessionStorage.clear()
            
        ).then(
            location.reload()
        )
    });
    
    document.getElementById("login").addEventListener("click", () => {
        window.location.replace('./login.html');
    });
});
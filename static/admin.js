document.addEventListener('DOMContentLoaded', () => {
    const authToken = sessionStorage.getItem('authToken');

    if (!authToken) {
        window.location.replace('./index.html')
    }

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
            window.location.replace('./index.html')
        }
        
    })
    .catch(error => {
        console.error('Erreur lors de la récupération du user:', error);
    });

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
        displayAdminMatches(data);
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des matchs:', error);
    });

    function displayAdminMatches(matchList) {
        const matchListElement = document.getElementById('tousLesMatchList');
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

    function openMatchDetails(match) {
        sessionStorage.setItem('matchDetails', JSON.stringify(match));
        window.location.replace('./admin_draft.html');
    }

    // Exemple de liste d'équipes disponibles
const teams = ['Team 412', 'Guiche OPEX', 'Al Zultan', 'NOSEtradamus', 'SIT', 'Turbo Wizards', 'Big Titteams']

// Fonction pour remplir les menus déroulants avec les équipes disponibles
function populateTeamDropdowns() {
    const team1Dropdown = document.getElementById('team1');
    const team2Dropdown = document.getElementById('team2');

    teams.forEach(team => {
        const option1 = document.createElement('option');
        option1.value = team;
        option1.textContent = team;
        team1Dropdown.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = team;
        option2.textContent = team;
        team2Dropdown.appendChild(option2);
    });
}

// Afficher la pop-up
    document.getElementById('createMatch').addEventListener('click', () => {
        document.getElementById('popup').style.display = 'flex';
        populateTeamDropdowns();
    });

    // Masquer la pop-up
    document.querySelector('.close-button').addEventListener('click', () => {
        document.getElementById('popup').style.display = 'none';
    });

    // Gérer la soumission du formulaire
    document.getElementById('createMatchForm').addEventListener('submit', (event) => {
        event.preventDefault();

        const team1 = document.getElementById('team1').value;
        const team2 = document.getElementById('team2').value;
        const week = document.getElementById('week').value;

        const body = {
            Team1: team1,
            Team2: team2,
            Semaine: week,
            Phase: 'Incoming'
        }
        
        // Vérification des champs
        if (!team1 || !team2 || !week) {
            alert('Tous les champs doivent être remplis.');
            return;
        }
    
        // Vérification que les équipes sont différentes
        if (team1 === team2) {
            alert('Les équipes doivent être différentes.');
            return;
        }

        // Envoyer une requête fetch pour créer le match
        fetch('/match', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Match créé:', data);
            // Fermer la pop-up après la création du match
            document.getElementById('popup').style.display = 'none';
            // Réinitialiser le formulaire
            document.getElementById('createMatchForm').reset();
            location.reload()
        })
        .catch(error => {
            console.error('Erreur lors de la création du match:', error);
        });
    });

})

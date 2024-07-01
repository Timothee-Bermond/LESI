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
    })

    // Récupération des détails du match à partir du localStorage
    const matchDetails = JSON.parse(sessionStorage.getItem('matchDetails'));
    console.log('Détails du match: ', matchDetails) 

    document.getElementById('team1').textContent = matchDetails.Team1
    document.getElementById('team2').textContent = matchDetails.Team2
    document.getElementById('Phase').textContent = matchDetails.Phase

    document.getElementById('team1_ban').textContent = matchDetails.Team1
    document.getElementById('Ban1Team1').textContent = matchDetails.Ban1Team1
    document.getElementById('Ban2Team1').textContent = matchDetails.Ban2Team1
    document.getElementById('team2_ban').textContent = matchDetails.Team2
    document.getElementById('Ban1Team2').textContent = matchDetails.Ban1Team2
    document.getElementById('Ban2Team2').textContent = matchDetails.Ban2Team2
    document.getElementById('team1_pick').textContent = matchDetails.Team1
    document.getElementById('Pick1Team1').textContent = matchDetails.Pick1Team1
    document.getElementById('Pick2Team1').textContent = matchDetails.Pick2Team1
    document.getElementById('Pick3Team1').textContent = matchDetails.Pick3Team1
    document.getElementById('team2_pick').textContent = matchDetails.Team2
    document.getElementById('Pick1Team2').textContent = matchDetails.Pick1Team2
    document.getElementById('Pick2Team2').textContent = matchDetails.Pick2Team2
    document.getElementById('Pick3Team2').textContent = matchDetails.Pick3Team2

    document.getElementById('nextPhase').addEventListener("click", () => {
        let body = {}
        if (matchDetails.Phase == 'Incoming') {
            body = {
                Phase: 'Ban'
            }
        } else if (matchDetails.Phase == 'Ban') {
            body = {
                Phase: 'Pick'
            }
        } else if (matchDetails.Phase == 'Pick') {
            body = {
                Phase: 'Match'
            }
        }

        let url = `/match/${matchDetails._id}`.toString()
        console.log('url: ', url)
        fetch(url, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body:JSON.stringify(body)
        })
        .then(
            window.location.replace('./admin.html')
        )
    })

    document.getElementById('previousPhase').addEventListener("click", () => {
        let body = {}
        if (matchDetails.Phase == 'Ban') {
            body = {
                Phase: 'Incoming'
            }
        } else if (matchDetails.Phase == 'Pick') {
            body = {
                Phase: 'Ban'
            }
        } else if (matchDetails.Phase == 'Match') {
            body = {
                Phase: 'Pick'
            }
        }

        let url = `/match/${matchDetails._id}`.toString()
        console.log('url: ', url)
        fetch(url, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body:JSON.stringify(body)
        })
        .then(
            window.location.replace('./admin.html')
        )
    })
    
    document.getElementById('delete').addEventListener("click", () => {
        let url = `/match/${matchDetails._id}`.toString()
        console.log('url: ', url)
        fetch(url, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(
            window.location.replace('./admin.html')
        )
    })

    document.getElementById('return_button').addEventListener("click", () => {
        window.location.replace('./admin.html')
    })

})
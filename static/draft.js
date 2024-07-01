document.addEventListener('DOMContentLoaded', () => {
    // Récupération des détails du match à partir du localStorage
    const matchDetails = JSON.parse(sessionStorage.getItem('matchDetails'));
    console.log('Détails du match: ', matchDetails)
    

    // Affichage des détails du match dans la page
    document.getElementById('team1').textContent = matchDetails.Team1;
    document.getElementById('team2').textContent = matchDetails.Team2;

    if (matchDetails.Phase == 'Ban') {
        document.getElementById('pick').classList.add('hide');
        document.getElementById('match').classList.add('hide');
    } else if (matchDetails.Phase == 'Pick') {
        document.getElementById('ban').classList.add('hide');
        document.getElementById('match').classList.add('hide');
    } else if (matchDetails.Phase == 'Match') {
        document.getElementById('ban').classList.add('hide');
        document.getElementById('pick').classList.add('hide');
    } else {
        document.getElementById('ban').classList.add('hide');
        document.getElementById('pick').classList.add('hide');
        document.getElementById('match').classList.add('hide');
    }

    // Lock des perso bans

    if (matchDetails.Ban1Team1 !== undefined){
        document.getElementById('pick-'+matchDetails.Ban1Team1).disabled = true
    }
    if (matchDetails.Ban2Team1 !== undefined){
        document.getElementById('pick-'+matchDetails.Ban2Team1).disabled = true
    }
    if (matchDetails.Ban1Team2 !== undefined){
        document.getElementById('pick-'+matchDetails.Ban1Team2).disabled = true
    }
    if (matchDetails.Ban2Team2 !== undefined){
        document.getElementById('pick-'+matchDetails.Ban2Team2).disabled = true
    }

    const authToken = sessionStorage.getItem('authToken');

    function getUserInfo() {
        return fetch('/users/me', {
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
        .then(data => {
            console.log('User récupéré: ', data);
            return data
        })
        .catch(error => {
            console.error('Erreur lors de la récupération du user:', error);
        });
    }


    getUserInfo().then(user => {
        console.log('Utilisateur connecté:', user);
        // Bans déjà effectués
        if ((user.team == matchDetails.Team1) && (matchDetails.Ban1Team1 !== undefined)) {
            document.getElementById('ban-'+matchDetails.Ban1Team1).checked = true
        }
        if ((user.team == matchDetails.Team1) && (matchDetails.Ban2Team1 !== undefined)) {
            document.getElementById('ban-'+matchDetails.Ban2Team1).checked = true
        }
        if ((user.team == matchDetails.Team2) && (matchDetails.Ban1Team2 !== undefined)) {
            document.getElementById('ban-'+matchDetails.Ban1Team2).checked = true
        }
        if ((user.team == matchDetails.Team2) && (matchDetails.Ban2Team2 !== undefined)) {
            document.getElementById('ban-'+matchDetails.Ban2Team2).checked = true
        }

        // Picks déjà effectués

        if ((user.team == matchDetails.Team1) && (matchDetails.Pick1Team1 !== undefined)) {
            document.getElementById('pick-'+matchDetails.Pick1Team1).checked = true
        }
        if ((user.team == matchDetails.Team1) && (matchDetails.Pick2Team1 !== undefined)) {
            document.getElementById('pick-'+matchDetails.Pick2Team1).checked = true
        }
        if ((user.team == matchDetails.Team1) && (matchDetails.Pick3Team1 !== undefined)) {
            document.getElementById('pick-'+matchDetails.Pick2Team1).checked = true
        }
        if ((user.team == matchDetails.Team2) && (matchDetails.Pick1Team2 !== undefined)) {
            document.getElementById('pick-'+matchDetails.Pick1Team2).checked = true
        }
        if ((user.team == matchDetails.Team2) && (matchDetails.Pick2Team2 !== undefined)) {
            document.getElementById('pick-'+matchDetails.Pick2Team2).checked = true
        }
        if ((user.team == matchDetails.Team2) && (matchDetails.Pick3Team2 !== undefined)) {
            document.getElementById('pick-'+matchDetails.Pick3Team2).checked = true
        }
        

    }).catch(error => {
        console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error);
        // Gérer l'erreur ici
    });

    // Paramétrage des checkboxes

    const maxSelections = 2;
    let totalSelected = 0;

    const Ban_forms = document.querySelectorAll('.ban-list');

    Ban_forms.forEach(form => {
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const formChecked = form.querySelectorAll('input[type="checkbox"]:checked').length;
                const allChecked = document.querySelectorAll('.ban-list input[type="checkbox"]:checked').length;

                if (checkbox.checked) {
                    if (allChecked > maxSelections) {
                        checkbox.checked = false;
                    } else if (formChecked > 1) {
                        checkbox.checked = false;
                    } else {
                        totalSelected++;
                    }
                } else {
                    totalSelected--;
                }
            });
        });
    });

    // Envoi des bans

    document.getElementById("ban_button").addEventListener("click", () => {
        const banForms = document.querySelectorAll('.ban-list'); // Sélectionner tous les formulaires avec la classe ban-list
        const selectedBans = [];

        banForms.forEach(form => {
            const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked'); // Sélectionner les checkboxes cochées dans ce formulaire
            checkboxes.forEach(checkbox => {
                selectedBans.push(checkbox.value);
            });
        });

        console.log('Bans sélectionnés :', selectedBans);

        getUserInfo().then(user => {
            let bans = {}
            if (user.team == matchDetails.Team1) {
                bans = {
                    Ban1Team1 : selectedBans[0],
                    Ban2Team1 : selectedBans[1]
                }
                console.log(bans)
            } else if (user.team == matchDetails.Team2) {
                bans = {
                    Ban1Team2 : selectedBans[0],
                    Ban2Team2 : selectedBans[1]
                }
                console.log(bans)
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
                body:JSON.stringify(bans)
            })
            .then(
                window.location.replace('./index.html')
            )
        })
    })

    // PICK

    const Pick_forms = document.querySelectorAll('.pick-list');

    Pick_forms.forEach(form => {
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const formChecked = form.querySelectorAll('input[type="checkbox"]:checked').length;
                const allChecked = document.querySelectorAll('.ban-list input[type="checkbox"]:checked').length;

                if (checkbox.checked) {
                    if (formChecked > 1) {
                        checkbox.checked = false;
                    }
                } 
            });
        });
    });

    document.getElementById("pick_button").addEventListener("click", () => {
        const pickForms = document.querySelectorAll('.pick-list'); // Sélectionner tous les formulaires avec la classe pick-list
        const selectedPicks = [];

        pickForms.forEach(form => {
            const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked'); // Sélectionner les checkboxes cochées dans ce formulaire
            checkboxes.forEach(checkbox => {
                selectedPicks.push(checkbox.value);
            });
        });

        console.log('Picks sélectionnés :', selectedPicks);

        getUserInfo().then(user => {
            let picks = {}
            if (user.team == matchDetails.Team1) {
                picks = {
                    Pick1Team1 : selectedPicks[0],
                    Pick2Team1 : selectedPicks[1],
                    Pick3Team1 : selectedPicks[2],
                }
                console.log(picks)
            } else if (user.team == matchDetails.Team2) {
                picks = {
                    Pick1Team2 : selectedPicks[0],
                    Pick2Team2 : selectedPicks[1],
                    Pick3Team2 : selectedPicks[2],
                }
                console.log(picks)
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
                body:JSON.stringify(picks)
            })
            .then(
                window.location.replace('./index.html')
            )
        })
    })

    // MATCH

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


    // BOUTON RETOUR

    document.getElementById('return_button').addEventListener("click", () => {
        window.location.replace('./index.html')
    })
})

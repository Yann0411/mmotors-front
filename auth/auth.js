function afficherInscription() {
    document.getElementById('box-connexion').style.display = 'none';
    document.getElementById('box-inscription').style.display = 'flex';
    
}

function afficherConnexion() {
    document.getElementById('box-inscription').style.display = 'none';
    document.getElementById('box-connexion').style.display = 'flex';
}

async function sInscrire() {

    const nom = document.getElementById('inscription-nom').value;
    const prenom = document.getElementById('inscription-prenom').value;
    const email = document.getElementById('inscription-email').value;
    const motDePasse = document.getElementById('inscription-mdp').value;
    const msg = document.getElementById('msg-inscription');

    try {

        await axios.post('http://localhost:8080/auth/inscription', {
            nom, prenom, email, motDePasse
        });
        msg.style.color ='green';
        msg.textContent = 'Compte créé ! Vous pouvez vous connecter.';
        setTimeout(() => afficherConnexion(), 2000);
    } catch (error) {
        msg.style.color= 'red';
        msg.textContent =error.response?.data || 'Erreur lors de l\'inscription';
    }
}

async function seConnecter() {
    const email = document.getElementById('connexion-email').value;
    const motDePasse = document.getElementById('connexion-mdp').value;
    const msg = document.getElementById('msg-connexion');

    try {
        const response = await axios.post('http://localhost:8080/auth/connexion', {
            email, motDePasse

        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('nom', response.data.nom);
        msg.style.color= 'green';
        msg.textContent = 'Connexion réussie ! Bonjour ' + response.data.nom;
        setTimeout(() => window.location.href = '../index.html', 2000);

    } catch (error) {
        msg.style.color ='red';
        msg.textContent = error.response?.data || 'Erreur lors de la connexion';

    }
}

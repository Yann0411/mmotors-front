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
    const btn = document.querySelector('button[onclick="sInscrire()"]');

    if (!nom || !prenom || !email || !motDePasse) {
        msg.style.color = 'red';
        msg.textContent = 'Tous les champs sont obligatoires';
        return;
    }

    btn.disabled = true;
    try {
        await axios.post('https://mmotors-back-production.up.railway.app/auth/inscription', {
            nom, prenom, email, motDePasse
        });
        msg.style.color = 'green';
        msg.textContent = 'Compte créé ! Vous pouvez vous connecter.';
        setTimeout(() => afficherConnexion(), 2000);
        
    } catch (error) {
        msg.style.color = 'red';
        const data = error.response?.data;
        if (Array.isArray(data)) {
            const erreurMdp = data.find(e => e.includes('majuscule'));
            msg.textContent = erreurMdp || 'Erreur lors de l\'inscription';
        } else {
            msg.textContent = data || 'Erreur lors de l\'inscription';
        }
    } finally {
        btn.disabled = false;
    }

}


async function seConnecter() {

    const email = document.getElementById('connexion-email').value;
    const motDePasse = document.getElementById('connexion-mdp').value;
    const msg = document.getElementById('msg-connexion');
    const btn = document.querySelector('button[onclick="seConnecter()"]');

    if (!email || !motDePasse) {

        msg.style.color = 'red';
        msg.textContent = 'Tous les champs sont obligatoires';
        return;
    }

    btn.disabled = true;
    try {
        const response = await axios.post('https://mmotors-back-production.up.railway.app/auth/connexion', {
            email, motDePasse

        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('nom', response.data.nom);
        localStorage.setItem('role', response.data.role);

        msg.style.color = 'green';
        msg.textContent = 'Connexion réussie ! Bonjour ' + response.data.nom;

        if (response.data.role === 'ADMIN') {
            setTimeout(() => window.location.href = '../admin/admin.html', 2000);
        } else {
            setTimeout(() => window.location.href = '../index.html', 2000);
        }
    } catch (error) {
        msg.style.color = 'red';
        msg.textContent = error.response?.data || 'Erreur lors de la connexion';
    } finally {
        btn.disabled = false;
    }
}


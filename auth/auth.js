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

    console.log("=== INSCRITION FAITE ===");
    console.log("nom créé : " + nom);
    console.log("prenom créé : " + prenom);
    console.log("Email créé : " + email);
    console.log("mdp créé : " + motDePasse);

    try {

        await axios.post('https://mmotors-back-production.up.railway.app/auth/inscription', {
            nom, prenom, email, motDePasse
        });
        msg.style.color ='green';
        msg.textContent = 'Compte créé ! Vous pouvez vous connecter.';
        
        setTimeout(() => afficherConnexion(), 2000);


   } catch (error) {
    msg.style.color = 'red';
    const data = error.response?.data;
    if (Array.isArray(data)) {
        const erreurMdp = data.find(e => e.includes('mot de passe'));
        if (erreurMdp) {
            msg.textContent = erreurMdp;
        } else {
            msg.textContent ='Tous les champs sont obligatoires' ;
        }
    } else {
        msg.textContent = data || 'Erreur lors de l\'inscription';
    }
}


}

async function seConnecter() {
    const email = document.getElementById('connexion-email').value;
    const motDePasse = document.getElementById('connexion-mdp').value;
    const msg = document.getElementById('msg-connexion');

    // Ajouter ces lignes avant le try
    if (!email || !motDePasse) {
        msg.style.color = 'red';
        msg.textContent = 'Tous les champs sont obligatoires';
        return;
    }

    try {
        const response = await axios.post('https://mmotors-back-production.up.railway.app/auth/connexion', {
            email, motDePasse


        });
         console.log("response.data")
        console.log(response.data)

        localStorage.setItem('token', response.data.token);
         

        localStorage.setItem('nom', response.data.nom);
         console.log("response.data.nom")
         console.log(response.data.nom)
         
        msg.style.color= 'green';
        msg.textContent = 'Connexion réussie ! Bonjour ' + response.data.nom;


            localStorage.setItem('role', response.data.role);
            if (response.data.role === 'ADMIN') {
             setTimeout(() => window.location.href = '../admin/admin.html', 2000);
            } else {
             setTimeout(() => window.location.href = '../index.html', 2000);
            }
    } catch (error) {
        msg.style.color ='red';
        msg.textContent = error.response?.data || 'Erreur lors de la connexion';

    }
}

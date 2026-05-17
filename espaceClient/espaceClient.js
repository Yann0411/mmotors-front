  const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '../auth/auth.html';
}
  
  function seDeconnecter() {
      localStorage.clear();
      window.location.href = '../auth/auth.html';
  }

  const nomStocke = localStorage.getItem('nom');
if (nomStocke) {
    document.getElementById('nom-utilisateur').textContent = 'Bonjour ' + nomStocke;
}



async function chargerDossiers() {

        const token = localStorage.getItem('token');

console.log("=======================================================");
console.log("=== CHARGEMENT ESPACE CLIENT ===");
console.log("token présent : " + (token ? "OUI" : "NON"));
console.log("=======================================================");

    
     const msg = document.getElementById('msg-espace');

    if (!token) {

        msg.style.color = 'red';
        msg.textContent = 'Vous devez être connecté.';
        return;
    }

    try {

        const response = await axios.get('https://mmotors-back-production.up.railway.app/dossiers/moi',
            { headers: { Authorization: 'Bearer ' + token } }
        );

             const dossiers = response.data;

             console.log("=== DOSSIERS =>  REPONSE DU DU BACK ===");
            console.log("nombre de dossiers : " + dossiers.length);
            console.log(dossiers);


        const div =document.getElementById('liste-dossiers');

        if (dossiers.length === 0) {
            div.innerHTML ='<p>Vous n\'avez pas encore de dossier.</p>';
            return;
        }

        div.innerHTML = '';


        dossiers.forEach(function(dossier) {
            const statutClasse = 'statut-' + dossier.statut.toLowerCase().replace('_', '-');
            div.innerHTML += `
                <div class="carte-dossier">
                    <p><strong>Type :</strong> ${dossier.typeOffre}</p>
                    <p><strong>Message :</strong> ${dossier.message}</p>
                    <p><strong>Date :</strong> ${dossier.dateDepot}</p>
                    <span class="statut ${statutClasse}">${dossier.statut}</span>
                </div>
            `;
        });

    } catch (error) {
        
        msg.style.color = 'red';
        
        msg.textContent = 'Erreur lors du chargement des dossiers.';
    }
}

chargerDossiers();

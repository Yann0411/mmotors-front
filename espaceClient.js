  function seDeconnecter() {
      localStorage.clear();
      window.location.href = 'auth.html';
  }


async function chargerDossiers() {

        const token = localStorage.getItem('token');


    
     const msg = document.getElementById('msg-espace');

    if (!token) {

        msg.style.color = 'red';
        msg.textContent = 'Vous devez être connecté.';
        return;
    }

    try {

        const response = await axios.get('http://localhost:8080/dossiers/moi',
            { headers: { Authorization: 'Bearer ' + token } }
        );

             const dossiers = response.data;

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

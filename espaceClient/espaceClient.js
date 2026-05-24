const statutLabels = { 
      'EN_ATTENTE': 'En attente',
      'VALIDE': 'Validé',
      'REFUSE': 'Refusé'
  };



  const typeOffreLabels = {
      'ACHAT': 'Achat',
      'LOCATION': 'Location'
  };



  
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

     function formaterDate(dateStr) {

    
    if (!dateStr) return '';
    
    const [annee, mois, jour] = dateStr.split('-');
      return new Date(annee, mois - 1, jour).toLocaleDateString('fr-FR', {
          day: 'numeric', month: 'long', year: 'numeric'
      });

  }

  async function chargerDossiers() {

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

          const div = document.getElementById('liste-dossiers');

          if (dossiers.length === 0) {
          
            div.innerHTML = '<p>Vous n\'avez pas encore de dossier.</p>';
              return;
          }

        //   div.innerHTML = '';
        //   dossiers.forEach(function(dossier) {
        //       const statutClasse = 'statut-' + dossier.statut.toLowerCase().replace('_', '-');

        //       div.innerHTML += `
        //           <div class="carte-dossier">
        //               <p><strong>Type :</strong> ${typeOffreLabels[dossier.typeOffre] || dossier.typeOffre}</p>
                      
        //               <p><strong>Message :</strong> ${dossier.message}</p>
        //               <p><strong>Date :</strong> ${formaterDate(dossier.dateDepot)}</p>
        //               <span class="statut ${statutClasse}">${statutLabels[dossier.statut] || dossier.statut}</span>

        //           </div>
        //       `;
        //   });

        div.innerHTML = '';
            dossiers.forEach(function(dossier) {
                const statutClasse = 'statut-' + dossier.statut.toLowerCase().replace('_', '-');

                const carte = document.createElement('div');
                  carte.className = 'carte-dossier';

                const type = document.createElement('p');
                  type.innerHTML = '<strong>Type :</strong> ';
                type.appendChild(document.createTextNode(typeOffreLabels[dossier.typeOffre] || dossier.typeOffre));

                  const message = document.createElement('p');
                message.innerHTML = '<strong>Message :</strong> ';
                message.appendChild(document.createTextNode(dossier.message));

                const date = document.createElement('p');
                  date.innerHTML = '<strong>Date :</strong> ';
                date.appendChild(document.createTextNode(formaterDate(dossier.dateDepot)));

                  const statut = document.createElement('span');
                statut.className = 'statut ' + statutClasse;
                statut.textContent = statutLabels[dossier.statut] || dossier.statut;

                carte.appendChild(type);
                  carte.appendChild(message);
                carte.appendChild(date);
                carte.appendChild(statut);
                  div.appendChild(carte);
            });



      } catch (error) {

           msg.style.color = 'red';
            msg.textContent = 'Erreur lors du chargement des dossiers.';
      }
  }



  chargerDossiers();


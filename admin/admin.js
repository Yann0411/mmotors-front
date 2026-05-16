
const token = localStorage.getItem('token');
  const headers = { Authorization: 'Bearer ' + token };


  function seDeconnecter() {
    localStorage.clear();
    window.location.href = '../auth/auth.html';
}

const nomStocke = localStorage.getItem('nom');
if (nomStocke) {
    document.getElementById('nom-utilisateur').textContent = 'Bonjour ' + nomStocke;
}




async function chargerVehicules() {

      const response = await axios.get('http://localhost:8080/vehicules');
      const vehicules = response.data;
      const div = document.getElementById('liste-vehicules-admin');
      div.innerHTML = '';
      vehicules.forEach(function(v) {
          div.innerHTML += `
              <div class="carte-vehicule">
                  <h3>${v.marque} ${v.modele} (${v.annee})</h3>
                  <p>Prix : ${v.prix} € | Km : ${v.kilometrage} | ${v.typeOffre}</p>
                  <button onclick="remplirFormulaire(${v.id}, '${v.marque}', '${v.modele}',
  ${v.annee}, ${v.prix}, ${v.kilometrage}, '${v.typeOffre}')">Modifier</button>
                  <button onclick="supprimerVehicule(${v.id})">Supprimer</button>
              </div>
          `;
      });
  }

  function remplirFormulaire(id, marque, modele, annee, prix, km, typeOffre) {
      document.getElementById('vehicule-id').value = id;
      document.getElementById('vehicule-marque').value = marque;
      document.getElementById('vehicule-modele').value = modele;

      document.getElementById('vehicule-annee').value = annee;


      document.getElementById('vehicule-prix').value = prix;
      document.getElementById('vehicule-km').value = km;

      document.getElementById('vehicule-typeOffre').value = typeOffre;
      document.getElementById('titre-form-vehicule').textContent = 'Modifier un véhicule';


  }

  function annulerModification() {
      document.getElementById('vehicule-id').value = '';
      document.getElementById('vehicule-marque').value = '';

      document.getElementById('vehicule-modele').value = '';
      document.getElementById('vehicule-annee').value = '';


      document.getElementById('vehicule-prix').value = '';
      document.getElementById('vehicule-km').value = '';
      document.getElementById('vehicule-typeOffre').value = 'ACHAT';
      document.getElementById('titre-form-vehicule').textContent = 'Ajouter un véhicule';

  }

  async function sauvegarderVehicule() {
      const id = document.getElementById('vehicule-id').value;
      const vehicule = {
          marque: document.getElementById('vehicule-marque').value,
          modele: document.getElementById('vehicule-modele').value,
          annee: parseInt(document.getElementById('vehicule-annee').value),
          prix: parseFloat(document.getElementById('vehicule-prix').value),
          kilometrage: parseInt(document.getElementById('vehicule-km').value),
          typeOffre: document.getElementById('vehicule-typeOffre').value
      };
         const msg = document.getElementById('msg-vehicule');
      try {
          if (id) {
              await axios.put('http://localhost:8080/admin/vehicules/' + id, vehicule, {
  headers });
          } else {
              await axios.post('http://localhost:8080/admin/vehicules', vehicule, { headers
  });
          }
          msg.style.color = 'green';
          msg.textContent = 'Véhicule sauvegardé !';
          annulerModification();
          chargerVehicules();
      } catch (error) {
          msg.style.color = 'red';
          msg.textContent = 'Erreur : ' + (error.response?.data || 'inconnue');
      }
  }

    async function supprimerVehicule(id) {
      if (!confirm('Supprimer ce véhicule ?')) return;
      try {
          await axios.delete('http://localhost:8080/admin/vehicules/' + id, { headers });
          chargerVehicules();
      } catch (error) {
          alert('Erreur lors de la suppression');
      }
  }

  // ========================
  //         DOSSIERS
  // ===============================

  async function chargerDossiers() {
        const response = await axios.get('http://localhost:8080/admin/dossiers', { headers });
      const dossiers = response.data;
       const div = document.getElementById('liste-dossiers-admin');
       div.innerHTML = '';
      dossiers.forEach(function(d) {
          div.innerHTML += `
              <div class="carte-dossier">
                  <p><strong>Client :</strong> ${d.clientEmail}</p>
                  <p><strong>Type :</strong> ${d.typeOffre}</p>
                  <p><strong>Message :</strong> ${d.message}</p>
                  <p><strong>Date :</strong> ${d.dateDepot}</p>
                  <p><strong>Statut :</strong> ${d.statut}</p>
                  <button onclick="changerStatut(${d.id}, 'VALIDE')">Valider</button>
                  <button onclick="changerStatut(${d.id}, 'REFUSE')">Refuser</button>
              </div>
          `;
      });
  }

     async function changerStatut(id, statut) {
        try {
          await axios.put('http://localhost:8080/admin/dossiers/' + id, { statut }, { headers
  });
          chargerDossiers();
      } catch (error) {
          alert('Erreur lors de la mise à jour du statut');
      }
  }

  // Chargement initial
  chargerVehicules();

  chargerDossiers();

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

  const role  = localStorage.getItem('role');

  if (!token || role !== 'ADMIN') {
        window.location.href = '../auth/auth.html';
  }

  const headers = { Authorization: 'Bearer ' + token };

  function seDeconnecter() {
      localStorage.clear();
      window.location.href = '../auth/auth.html';
  }


  const nomStocke = localStorage.getItem('nom');
  if (nomStocke) {
        document.getElementById('nom-utilisateur').textContent = 'Bonjour ' + nomStocke;
  }


  // gEstion des onglets
  function afficherOnglet(nom, btn) {
      document.querySelectorAll('.onglet').forEach(function(o) {
          o.style.display = 'none';

      });
      document.querySelectorAll('.tab-btn').forEach(function(b) {


            b.classList.remove('tab-actif');
      });
      document.getElementById('onglet-' + nom).style.display = 'block';

      btn.classList.add('tab-actif');
  }


  // ===== toast ===========================

  function afficherToast(message, type = 'succes') {

      const toast = document.getElementById('toast');
        toast.textContent = message;
      toast.className = 'toast toast-' + type + ' visible';
      setTimeout(() => { toast.className = 'toast'; }, 3000);

  }

  // ===== format date =====

  function formaterDate(dateStr) {

      if (!dateStr) return '';
      const [annee, mois, jour] = dateStr.split('-');
        return new Date(annee, mois - 1, jour).toLocaleDateString('fr-FR', {
          day: 'numeric', month: 'long', year: 'numeric'
      });
  }

  // =================== Véhicules ===================

  async function chargerVehicules() {
      try {
          const response = await axios.get('https://mmotors-back-production.up.railway.app/vehicules');
          const vehicules = response.data;
            const div = document.getElementById('liste-vehicules-admin');
          div.innerHTML = '';
          vehicules.forEach(function(v) {

              div.innerHTML += `
                  <div class="carte-vehicule">
                      <h3>${v.marque} ${v.modele} (${v.annee})</h3>
                      <p>Prix : ${v.prix.toLocaleString('fr-FR')} € &nbsp;|&nbsp; Km : ${v.kilometrage.toLocaleString('fr-FR')} &nbsp;|&nbsp; ${typeOffreLabels[v.typeOffre] || v.typeOffre}</p>
                      <div class="btn-groupe-carte">

                          <button class="btn-modifier" onclick="remplirFormulaire(${v.id}, '${v.marque}', '${v.modele}', ${v.annee}, ${v.prix}, ${v.kilometrage},'${v.typeOffre}')">Modifier</button>
                          <button class="btn-supprimer" onclick="supprimerVehicule(${v.id}, '${v.marque}', '${v.modele}', ${v.annee})">Supprimer</button>
                      </div>
                  </div>
              `;
          });
      } catch (error) {
            document.getElementById('liste-vehicules-admin').innerHTML = '<p style="color:red;">Impossible de charger les véhicules.</p>';
      }
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
      // efface les erreurs visuelles
      document.querySelectorAll('.admin-formulaire .input-erreur').forEach(el => el.classList.remove('input-erreur'));
      document.getElementById('msg-vehicule').textContent = '';
      document.querySelector('.admin-formulaire').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function annulerModification() {

      ['vehicule-id','vehicule-marque','vehicule-modele','vehicule-annee','vehicule-prix','vehicule-km'].forEach(id => {
            document.getElementById(id).value = '';
          document.getElementById(id).classList.remove('input-erreur');
      });
      document.getElementById('vehicule-typeOffre').value = 'ACHAT';
        document.getElementById('titre-form-vehicule').textContent = 'Ajouter un véhicule';
      document.getElementById('msg-vehicule').textContent = '';
  }

  async function sauvegarderVehicule() {


      const id  = document.getElementById('vehicule-id').value;
      const msg = document.getElementById('msg-vehicule');
        const btn = document.querySelector('button[onclick="sauvegarderVehicule()"]');

      const champsRequis = ['vehicule-marque','vehicule-modele','vehicule-annee','vehicule-prix','vehicule-km'];
      let valide = true;
      champsRequis.forEach(champId => {
          const input = document.getElementById(champId);
          if (!input.value) {
              input.classList.add('input-erreur');
                valide = false;
          } else {
              input.classList.remove('input-erreur');
          }
      });

      if (!valide) {


          msg.style.color = 'red';
            msg.textContent = 'Veuillez remplir tous les champs obligatoires.';
          return;
      }

      const vehicule = {

          marque:      document.getElementById('vehicule-marque').value,
            modele:      document.getElementById('vehicule-modele').value,
          annee:       parseInt(document.getElementById('vehicule-annee').value),
          prix:        parseFloat(document.getElementById('vehicule-prix').value),
            kilometrage: parseInt(document.getElementById('vehicule-km').value),
          typeOffre:   document.getElementById('vehicule-typeOffre').value
      };

      btn.disabled = true;
      btn.textContent = 'Sauvegarde...';

      try {

          if (id) {

              await axios.put('https://mmotors-back-production.up.railway.app/admin/vehicules/' + id, vehicule, { headers });

          } else {
                await axios.post('https://mmotors-back-production.up.railway.app/admin/vehicules', vehicule, { headers });


          }
          afficherToast(id ? '✓ Véhicule modifié' : '✓ Véhicule ajouté');
          msg.style.color = 'green';
          msg.textContent = id ? 'Véhicule modifié avec succès.' : 'Véhicule ajouté avec succès.';
          annulerModification();
            chargerVehicules();
      } catch (error) {
          msg.style.color = 'red';
          const data = error.response?.data;
            msg.textContent = Array.isArray(data) ? data.join(' | ') : (data || 'Erreur inconnue.');
      } finally {
          btn.disabled = false;
          btn.textContent = 'Sauvegarder';
      }
  }

  async function supprimerVehicule(id, marque, modele, annee) {
      if (!confirm(`Voulez-vous supprimer le véhicule ${marque} ${modele} (${annee}) ?\n\nCette action est irréversible.`)) return;
      try {

          await axios.delete('https://mmotors-back-production.up.railway.app/admin/vehicules/' + id, { headers });

            afficherToast('✓ Véhicule supprimé');
          chargerVehicules();
      } catch (error) {
          afficherToast('Erreur lors de la suppression', 'erreur');
      }
  }

  // =================== Dossiers ===================

  async function chargerDossiers() {
      try {
          const response = await axios.get('https://mmotors-back-production.up.railway.app/admin/dossiers', { headers });
          const dossiers = response.data;
            const div = document.getElementById('liste-dossiers-admin');
          div.innerHTML = '';

          if (dossiers.length === 0) {
              div.innerHTML = '<p>Aucun dossier en attente.</p>';
              return;
          }

          dossiers.forEach(function(d) {
              const statutClasse = 'statut-' + d.statut.toLowerCase().replace('_', '-');
              div.innerHTML += `
                  <div class="carte-dossier">
                      <p><strong>Client :</strong> ${d.clientEmail}</p>
                      <p><strong>Type :</strong> ${typeOffreLabels[d.typeOffre] || d.typeOffre}</p>
                      <p><strong>Message :</strong> ${d.message}</p>
                      <p><strong>Date :</strong> ${formaterDate(d.dateDepot)}</p>
                      <span class="statut ${statutClasse}">${statutLabels[d.statut] || d.statut}</span>
                      <div class="btn-groupe-carte" style="margin-top:12px;">
                          <button class="btn-valider" onclick="changerStatut(${d.id}, 'VALIDE', this)">Valider</button>
                          <button class="btn-refuser" onclick="changerStatut(${d.id}, 'REFUSE', this)">Refuser</button>
                          ${d.statut !== 'EN_ATTENTE' ? `<button class="btn-supprimer" onclick="supprimerDossier(${d.id}, '${d.clientEmail}')">Supprimer</button>` : ''}
                      </div>
                  </div>
              `;
          });
      } catch (error) {
            document.getElementById('liste-dossiers-admin').innerHTML = '<p style="color:red;">Impossible de charger les dossiers.</p>';
      }
  }

  async function changerStatut(id, statut, btn) {

      const ancienTexte = btn.textContent;

      btn.disabled = true;
        btn.textContent = statut === 'VALIDE' ? 'Validation...' : 'Refus...';
      try {
          await axios.put('https://mmotors-back-production.up.railway.app/admin/dossiers/' + id, { statut }, { headers });
          afficherToast(statut === 'VALIDE' ? '✓ Dossier validé' : '✓ Dossier refusé', statut === 'VALIDE' ? 'succes' : 'erreur');
          chargerDossiers();
      } catch (error) {

          afficherToast('Erreur lors de la mise à jour', 'erreur');
          btn.disabled = false;
          btn.textContent = ancienTexte;
      }
  }

  async function supprimerDossier(id, clientEmail) {

      if (!confirm(`Voulez-vous supprimer le dossier de ${clientEmail} ?\n\nCette action est irréversible.`)) return;
      try {
            await axios.delete('https://mmotors-back-production.up.railway.app/admin/dossiers/' + id, { headers });
          afficherToast('✓ Dossier supprimé');
          chargerDossiers();
      } catch (error) {

          afficherToast('Erreur lors de la suppression', 'erreur');
      }
  }

  chargerVehicules();
  chargerDossiers();

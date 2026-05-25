


const statutLabels = {

      'EN_ATTENTE': 'En attente',
        'VALIDE': 'Validé',
      'REFUSE': 'Refusé'

  };


  const typeOffreLabels = {
      'ACHAT': 'Achat',
      'LOCATION': 'Location',
        'LOCATION_ACHAT': 'Location avec option d\'achat (LOA)'
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
        document.getElementById('nom-utilisateur').textContent = 'Bonjour ' + nomStocke.charAt(0).toUpperCase() + nomStocke.slice(1)
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
let tousLesVehicules = []

  async function chargerVehicules() {
      try {
          const response = await axios.get('https://mmotors-back-production.up.railway.app/vehicules');
          const vehicules = response.data;

           vehicules.sort((a, b) => b.annee - a.annee)

          tousLesVehicules = vehicules
            const marques = [...new Set(vehicules.map(v => v.marque))].sort()
             document.getElementById('list-marques-admin').innerHTML = marques.map(m => `<option value="${m}">`).join('')
          // console.log('vehicules chargés :', vehicules.length)
            const div = document.getElementById('liste-vehicules-admin');
        //   div.innerHTML = '';
        //   vehicules.forEach(function(v) {

        //       div.innerHTML += `
        //           <div class="carte-vehicule">
        //               <h3>${v.marque} ${v.modele} (${v.annee})</h3>
        //               <p>Prix : ${v.prix.toLocaleString('fr-FR')} € &nbsp;|&nbsp; Km : ${v.kilometrage.toLocaleString('fr-FR')} &nbsp;|&nbsp; ${typeOffreLabels[v.typeOffre] || v.typeOffre}</p>
        //               <div class="btn-groupe-carte">

        //                   <button class="btn-modifier" onclick="remplirFormulaire(${v.id}, '${v.marque}', '${v.modele}', ${v.annee}, ${v.prix}, ${v.kilometrage},'${v.typeOffre}')">Modifier</button>
        //                   <button class="btn-supprimer" onclick="supprimerVehicule(${v.id}, '${v.marque}', '${v.modele}', ${v.annee})">Supprimer</button>
        //               </div>
        //           </div>
        //       `;
        //   });

                    div.innerHTML = '';
            vehicules.forEach(function(v) {

                const carte = document.createElement('div');
                  carte.className = 'carte-vehicule';

                const titre = document.createElement('h3');
                titre.textContent = v.marque + ' ' + v.modele + ' (' + v.annee + ')';

                  const infos = document.createElement('p');
                infos.textContent = 'Prix : ' + v.prix.toLocaleString('fr-FR') + ' € | Km : ' + v.kilometrage.toLocaleString('fr-FR') + ' | ' + (typeOffreLabels[v.typeOffre] || v.typeOffre);

                const btnGroupe = document.createElement('div');
                  btnGroupe.className = 'btn-groupe-carte';

                const btnModifier = document.createElement('button');
                  btnModifier.className = 'btn-modifier';
                btnModifier.textContent = 'Modifier';
                     btnModifier.addEventListener('click', function() {
                    remplirFormulaire(v.id, v.marque, v.modele, v.annee, v.prix, v.kilometrage, v.typeOffre);
                });

                  const btnSupprimer = document.createElement('button');
                btnSupprimer.className = 'btn-supprimer';
                btnSupprimer.textContent = 'Supprimer';
                btnSupprimer.addEventListener('click', function() {
                      supprimerVehicule(v.id, v.marque, v.modele, v.annee);
                });

                btnGroupe.appendChild(btnModifier);
                  btnGroupe.appendChild(btnSupprimer);
                carte.appendChild(titre);
                carte.appendChild(infos);
                  carte.appendChild(btnGroupe);
                div.appendChild(carte);
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

        // validations numérique

          const prixVal = parseFloat(document.getElementById('vehicule-prix').value);
        const kmVal   = parseInt(document.getElementById('vehicule-km').value);

        if (prixVal <= 0) {

            document.getElementById('vehicule-prix').classList.add('input-erreur');
            msg.style.color = 'red';
              msg.textContent = 'Le prix doit être supérieur à 0.';
            return;
        }
        if (kmVal < 0) {
              document.getElementById('vehicule-km').classList.add('input-erreur');
            msg.style.color = 'red';
            msg.textContent = 'Le kilométrage ne peut pas être négatif.';
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

        //   dossiers.forEach(function(d) {
        //       const statutClasse = 'statut-' + d.statut.toLowerCase().replace('_', '-');
        //       div.innerHTML += `
        //           <div class="carte-dossier">
        //               <p><strong>Client :</strong> ${d.clientEmail}</p>
        //               <p><strong>Type :</strong> ${typeOffreLabels[d.typeOffre] || d.typeOffre}</p>
        //               <p><strong>Message :</strong> ${d.message}</p>
        //               <p><strong>Date :</strong> ${formaterDate(d.dateDepot)}</p>
        //               <span class="statut ${statutClasse}">${statutLabels[d.statut] || d.statut}</span>
        //               <div class="btn-groupe-carte" style="margin-top:12px;">
        //                   <button class="btn-valider" onclick="changerStatut(${d.id}, 'VALIDE', this)">Valider</button>
        //                   <button class="btn-refuser" onclick="changerStatut(${d.id}, 'REFUSE', this)">Refuser</button>
        //                   ${d.statut !== 'EN_ATTENTE' ? `<button class="btn-supprimer" onclick="supprimerDossier(${d.id}, '${d.clientEmail}')">Supprimer</button>` : ''}
        //               </div>
        //           </div>
        //       `;
        //   });
        dossiers.forEach(function(d) {


                const statutClasse = 'statut-' + d.statut.toLowerCase().replace('_', '-');

             const carte = document.createElement('div');
                  carte.className = 'carte-dossier';

                const client = document.createElement('p');
                  client.innerHTML = '<strong>Client :</strong> ';
                client.appendChild(document.createTextNode(d.clientEmail));

                const type = document.createElement('p');
                  type.innerHTML = '<strong>Type :</strong> ';
                type.appendChild(document.createTextNode(typeOffreLabels[d.typeOffre] || d.typeOffre));

                let vehiculeInfoEl = null
                if (d.vehiculeInfo) {
                    vehiculeInfoEl = document.createElement('p')
                    vehiculeInfoEl.innerHTML = '<strong>Véhicule :</strong> '
                    vehiculeInfoEl.appendChild(document.createTextNode(d.vehiculeInfo))
                }


                  const message = document.createElement('p');
                   message.innerHTML = '<strong>Ma demande :</strong> ';
                    message.appendChild(document.createTextNode(d.message));

                const date = document.createElement('p');
                  date.innerHTML = '<strong>Date :</strong> ';
                date.appendChild(document.createTextNode(formaterDate(d.dateDepot)));

            //     if (d.telephone) {
            //     const tel = document.createElement('p')
            //     tel.innerHTML = '<strong>Téléphone :</strong>'
            //     tel.appendChild(document.createTextNode(d.telephone))
            //     carte.appendChild(tel)
            // }

                let tel = null
                if (d.telephone) {
                tel = document.createElement('p')
                tel.innerHTML = '<strong>Téléphone :</strong> '
                tel.appendChild(document.createTextNode(d.telephone))
            }




                  const statut = document.createElement('span');
                statut.className = 'statut ' + statutClasse;
                statut.textContent = statutLabels[d.statut] || d.statut;



                const btnGroupe = document.createElement('div');
                  btnGroupe.className = 'btn-groupe-carte';
                btnGroupe.style.marginTop = '12px';



                  const btnValider = document.createElement('button');
                btnValider.className = 'btn-valider';
                btnValider.textContent = 'Valider';
                  btnValider.addEventListener('click', function() { changerStatut(d.id, 'VALIDE', btnValider); });

                const btnRefuser = document.createElement('button');
                  btnRefuser.className = 'btn-refuser';
                btnRefuser.textContent = 'Refuser';
                btnRefuser.addEventListener('click', function() { changerStatut(d.id, 'REFUSE', btnRefuser); });

                  btnGroupe.appendChild(btnValider);

                btnGroupe.appendChild(btnRefuser);



                if (d.statut !== 'EN_ATTENTE') {
                    const btnSupprimer = document.createElement('button');
                      btnSupprimer.className = 'btn-supprimer';
                    btnSupprimer.textContent = 'Supprimer';
                    btnSupprimer.addEventListener('click', function() { supprimerDossier(d.id, d.clientEmail); });
                      btnGroupe.appendChild(btnSupprimer);
                   

                }

                carte.appendChild(client);
                  carte.appendChild(type);
                // carte.appendChild(message);
                if (d.vehiculeInfo) carte.appendChild(vehiculeInfoEl)
                if (d.message) carte.appendChild(message)
                  carte.appendChild(date);
                if (d.telephone) carte.appendChild(tel)
                carte.appendChild(statut);
                  carte.appendChild(btnGroupe);
                div.appendChild(carte);


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

  document.getElementById('vehicule-marque').addEventListener('input', function() {
      const marqueChoisie = this.value.trim()
      const modeles = tousLesVehicules
          .filter(v => !marqueChoisie || v.marque.toLowerCase() === marqueChoisie.toLowerCase())
          .map(v => v.modele)
      const modelesUniques = [...new Set(modeles)].sort()
      document.getElementById('list-modeles-admin').innerHTML = modelesUniques.map(m => `<option value="${m}">`).join('')
  })


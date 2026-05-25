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

       document.getElementById('nom-utilisateur').textContent = 'Bonjour ' + nomStocke.charAt(0).toUpperCase() + nomStocke.slice(1);
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
                message.innerHTML = '<strong>Ma demande :</strong> ';
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
                if (dossier.statut === 'EN_ATTENTE') {
                    const btnGroupe = document.createElement('div');
                     btnGroupe.style.marginTop = '12px';
                 
                     btnGroupe.style.display = 'flex';
                    btnGroupe.style.gap = '8px';

                    const btnAnnuler = document.createElement('button');
                     btnAnnuler.className = 'btn-supprimer';
                   
                     btnAnnuler.textContent = 'Annuler';
                    btnAnnuler.addEventListener('click', function() { annulerDossier(dossier.id, carte); });

                    const btnModifier = document.createElement('button');
                    btnModifier.className = 'btn-modifier';
                    btnModifier.textContent = 'Modifier';
                   
                   
                    btnModifier.addEventListener('click', function() { afficherFormulaireModif(dossier, carte); });

                    btnGroupe.appendChild(btnModifier);
                    btnGroupe.appendChild(btnAnnuler);
                    carte.appendChild(btnGroupe);
                }

                  div.appendChild(carte);
            });



      } catch (error) {

           msg.style.color = 'red';
            msg.textContent = 'Erreur lors du chargement des dossiers.';
      }
  }

  async function annulerDossier(id, carte) {
      if (!confirm('Voulez-vous annuler ce dossier ?\n\nCette action est irréversible.')) return;
      try {
          await axios.delete('https://mmotors-back-production.up.railway.app/dossiers/' + id,
              { headers: { Authorization: 'Bearer ' + token } }
          );
          carte.remove();
          const liste = document.getElementById('liste-dossiers');
          if (!liste.querySelector('.carte-dossier')) {
              liste.innerHTML = '<p>Vous n\'avez pas encore de dossier.</p>';
          }
      } catch (error) {
          alert('Erreur lors de l\'annulation.');
      }
  }

  function afficherFormulaireModif(dossier, carte) {
      if (carte.querySelector('.form-modif')) return;

      const form = document.createElement('div');
      form.className = 'form-modif';
      form.style.marginTop = '12px';

      const labelType = document.createElement('label');
      labelType.textContent = 'Type d\'offre :';

      const selectType = document.createElement('select');
      selectType.style.width = '100%';
      selectType.style.marginBottom = '8px';
      [['ACHAT','Achat'],['LOCATION','Location'],['LOCATION_ACHAT','Location avec option d\'achat (LOA)']].forEach(function(opt) {
          const option = document.createElement('option');
          option.value = opt[0];
          option.textContent = opt[1];
          if (opt[0] === dossier.typeOffre) option.selected = true;
          selectType.appendChild(option);
      });

      const labelMsg = document.createElement('label');
      labelMsg.textContent = 'Message :';

      const textarea = document.createElement('textarea');
      textarea.style.width = '100%';
      textarea.style.marginBottom = '8px';
      textarea.rows = 3;
      textarea.value = dossier.message;

      const msgErreur = document.createElement('p');
      msgErreur.style.color = 'red';
      msgErreur.style.fontSize = '0.85rem';

      const btnValider = document.createElement('button');
      btnValider.className = 'btn-modifier';
      btnValider.textContent = 'Valider';
      btnValider.addEventListener('click', async function() {
          const nouveauMessage   = textarea.value.trim();
          const nouveauTypeOffre = selectType.value;
          if (!nouveauMessage) { msgErreur.textContent = 'Le message ne peut pas être vide.'; return; }
          btnValider.disabled = true;
          btnValider.textContent = 'Sauvegarde...';
          try {
              await axios.put('https://mmotors-back-production.up.railway.app/dossiers/' + dossier.id,
                  { message: nouveauMessage, typeOffre: nouveauTypeOffre },
                  { headers: { Authorization: 'Bearer ' + token } }
              );
              chargerDossiers();
          } catch (error) {
              msgErreur.textContent = 'Erreur lors de la modification.';
              btnValider.disabled = false;
              btnValider.textContent = 'Valider';
          }
      });
console.log(dossier)

      const btnAnnulerModif = document.createElement('button');

      btnAnnulerModif.className = 'btn-supprimer';
      btnAnnulerModif.textContent = 'Annuler';
      btnAnnulerModif.addEventListener('click', function() { form.remove(); });

      form.appendChild(labelType);
      form.appendChild(selectType);
      form.appendChild(labelMsg);
      form.appendChild(textarea);
      form.appendChild(msgErreur);
      form.appendChild(btnValider);
      form.appendChild(btnAnnulerModif);
      carte.appendChild(form);
  }




  chargerDossiers();


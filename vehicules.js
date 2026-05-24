function seDeconnecter() {
        localStorage.clear();
        window.location.href = 'auth/auth.html';


    }

     const nomStocke = localStorage.getItem('nom');


    if (nomStocke) {
        document.getElementById('nom-utilisateur').textContent = 'Bonjour ' + nomStocke.charAt(0).toUpperCase() + nomStocke.slice(1);
    } else {
        document.querySelector('.btn-deconnecter').style.display = 'none';
    }

    let typeOffreActuel = '';
    let tousLesVehicules = [];

    function afficherCatalogue(typeOffre) {

        typeOffreActuel = typeOffre;
         document.getElementById('accueil').style.display = 'none';
            document.getElementById('catalogue').style.display = 'block';

        // titre selon le type
        if (typeOffre === 'ACHAT') {
            document.getElementById('titre-catalogue').textContent = 'Véhicules à vendre';
        } else if (typeOffre === 'LOCATION') {
            document.getElementById('titre-catalogue').textContent = 'Véhicules en location';

        } else {
              document.getElementById('titre-catalogue').textContent = 'Location avec option d\'achat';
        }

        // on réinitialise les filtres
        ['filtre-marque','filtre-modele','filtre-prix-min','filtre-prix-max','filtre-km'].forEach(id => {
            document.getElementById(id).value = '';
        });
        chargerFiltres();
        rechercherVehicules();
    }

    function retourAccueil() {

      document.getElementById('catalogue').style.display = 'none';
        document.getElementById('accueil').style.display = 'block';

        document.getElementById('liste-vehicules').innerHTML = '';
    }

    async function chargerFiltres() {

        try {
            const response = await
  axios.get('https://mmotors-back-production.up.railway.app/vehicules', { params: {
  typeOffre: typeOffreActuel } });
            tousLesVehicules = response.data;

            // const marques = [...new Set(tousLesVehicules.map(v => v.marque))].sort();
            // const listMarques = document.getElementById('list-marques');
            //   listMarques.innerHTML = marques.map(m => `<option value="${m}">`).join('');

            // const modeles = [...new Set(tousLesVehicules.map(v => v.modele))].sort();

            // document.getElementById('list-modeles').innerHTML = modeles.map(m => `<option 
            //     value="${m}">`).join('');

            const marques = [...new Set(tousLesVehicules.map(v => v.marque))].sort()
            const selectMarque = document.getElementById('filtre-marque')

            selectMarque.innerHTML = '<option value="">Toutes les marques</option>' + marques.map(m => `<option value="${m}">${m}</option>`).join('')
            
            const modeles = [...new Set(tousLesVehicules.map(v => v.modele))].sort()
             const selectModele = document.getElementById('filtre-modele')
            selectModele.innerHTML = '<option value="">Tous les modèles</option>' + modeles.map(m => `<option value="${m}">${m}</option>`).join('')



        } catch(e) {
              // silencieux, la recherche fonctionne quand même
        }
    }


    function validerFiltresNumeriques() {

          const prixMin = parseFloat(document.getElementById('filtre-prix-min').value);

        const prixMax = parseFloat(document.getElementById('filtre-prix-max').value);

        if (prixMin && prixMax && prixMin > prixMax) {

          document.getElementById('filtre-prix-min').classList.add('input-erreur');
            document.getElementById('filtre-prix-max').classList.add('input-erreur');
            return false;

        }

        document.getElementById('filtre-prix-min').classList.remove('input-erreur');

        document.getElementById('filtre-prix-max').classList.remove('input-erreur');
        return true;

    }

    async function rechercherVehicules() {

        if (!validerFiltresNumeriques()) return;

        const msgRecherche = document.getElementById('msg-recherche');
            const aucunFiltre = !document.getElementById('filtre-marque').value &&

                !document.getElementById('filtre-modele').value &&
                //  !document.getElementById('filtre-prix-min').value &&
                // !document.getElementById('filtre-prix-max').value &&
                   !document.getElementById('filtre-prix-min').value &&
                !document.getElementById('filtre-prix-max').value &&

                !document.getElementById('filtre-km').value;

            if (aucunFiltre) {
                msgRecherche.textContent = 'Aucun filtre sélectionné: tous les véhicules sont affichés. Cliquez sur un véhicule pour déposer un dossier.';
            } else {
                msgRecherche.textContent = '';
            }


        try {

          const marque = document.getElementById('filtre-marque').value;

          const modele = document.getElementById('filtre-modele').value;
             const prixMin = document.getElementById('filtre-prix-min').value;
            const prixMax = document.getElementById('filtre-prix-max').value;
            const km      = document.getElementById('filtre-km').value;

            const params = { typeOffre: typeOffreActuel };

             if (marque)  params.marque        = marque;
            if (modele)  params.modele        = modele;
             if (prixMin) params.prixMin       = prixMin;
            if (prixMax) params.prixMax       = prixMax;
            if (km)      params.kilometrageMax = km;

            const response = await axios.get('https://mmotors-back-production.up.railway.app/vehicules', { params });
            const vehicules = response.data;
             // console.log(vehicules)
            const div = document.getElementById('liste-vehicules');

            if (vehicules.length === 0) {
                div.innerHTML = '<p>Aucun véhicule ne correspond à votre recherche.</p>';
                return;
            }

            // div.innerHTML = '';
            // vehicules.forEach(function(vehicule) {

            //     // label du bouton selon le type
            //     const labelBtn = vehicule.typeOffre === 'ACHAT' ? 'Déposer un dossier d\'achat'
            //         : vehicule.typeOffre === 'LOCATION_ACHAT' ? 'Déposer un dossier LOA'
            //         : 'Déposer un dossier de location';

            //     div.innerHTML += `
            //         <div class="carte-vehicule">
            //             <h3>${vehicule.marque} ${vehicule.modele}</h3>
            //             <p>Année : ${vehicule.annee}</p>
            //             <p>Prix : ${vehicule.prix.toLocaleString('fr-FR')} €</p>
            //             <p>Kilométrage : ${vehicule.kilometrage.toLocaleString('fr-FR')} km</p>
            //             <button onclick="window.location.href='dossier/dossier.html?marque=${vehicule.marque}&modele=${vehicule.modele}&annee=${vehicule.annee}&prix=${vehicule.prix}&km=${vehicule.kilometrage}&typeOffre=${vehicule.typeOffre}'">
            //                 ${labelBtn}
            //             </button>
            //         </div> 
            //     `;
            // });


             div.innerHTML = '';

              vehicules.forEach(function(vehicule) {

                  // label du bouton selon le type
                  const labelBtn = vehicule.typeOffre === 'ACHAT' ? 'Déposer un dossier d\'achat'
                      : vehicule.typeOffre === 'LOCATION_ACHAT' ? 'Déposer un dossier LOA'
                      : 'Déposer un dossier de location';

                  const carte = document.createElement('div');
                    carte.className = 'carte-vehicule';

                  const titre = document.createElement('h3');
                  titre.textContent = vehicule.marque + ' ' + vehicule.modele;

                    const annee = document.createElement('p');
                  annee.textContent = 'Année : ' + vehicule.annee;

                  const prix = document.createElement('p');
                    // prix.textContent = 'Prix : ' + vehicule.prix.toLocaleString('fr-FR') + ' €';
                    const labelPrix = vehicule.typeOffre === 'ACHAT' ? 'Prix' : 'Prix mensuel'
                    prix.textContent = labelPrix + ' : ' + vehicule.prix.toLocaleString('fr-FR') + ' €';


                  const km = document.createElement('p');
                  km.textContent = 'Kilométrage : ' + vehicule.kilometrage.toLocaleString('fr-FR') + ' km';

                  const btn = document.createElement('button');
                    btn.textContent = labelBtn;
                  btn.addEventListener('click', function() {
                        const params = new URLSearchParams({
                          marque: vehicule.marque,
                          modele: vehicule.modele,
                          annee: vehicule.annee,
                          prix: vehicule.prix,
                          km: vehicule.kilometrage,
                          typeOffre: vehicule.typeOffre
                      });
                      window.location.href = 'dossier/dossier.html?' + params.toString();
                  });

                  carte.appendChild(titre);
                    carte.appendChild(annee);
                  carte.appendChild(prix);
                  carte.appendChild(km);
                    carte.appendChild(btn);
                  div.appendChild(carte);
              });



        } catch (error) {
            document.getElementById('liste-vehicules').innerHTML =
                '<p style="color:red;">Impossible de charger les véhicules. Veuillez réessayer.</p>';
        }
    }

    // document.getElementById('filtre-marque').addEventListener('input', function() {
        document.getElementById('filtre-marque').addEventListener('change', function() {
        const marqueChoisie = this.value.trim();

          // filtre les modèles selon la marque saisie
        const modelesFiltres = tousLesVehicules
            .filter(v => !marqueChoisie || v.marque.toLowerCase() ===
  marqueChoisie.toLowerCase())
            .map(v => v.modele);

        const modelesUniques = [...new Set(modelesFiltres)].sort();
//         const listModeles = document.getElementById('list-modeles');
//  listModeles.innerHTML = modelesUniques.map(m => `<option value="${m}">`).join('');

    const selectModele = document.getElementById('filtre-modele')
    selectModele.innerHTML = '<option value="">Tous les modèles</option>' + modelesUniques.map(m => `<option value="${m}">${m}</option>`).join('')

        rechercherVehicules();
    });
    document.getElementById('filtre-modele').addEventListener('change', rechercherVehicules);
    // document.getElementById('filtre-modele').addEventListener('input', rechercherVehicules);
    document.getElementById('filtre-prix-min').addEventListener('input', rechercherVehicules);
    document.getElementById('filtre-prix-max').addEventListener('input', rechercherVehicules);
    document.getElementById('filtre-km').addEventListener('input', rechercherVehicules);
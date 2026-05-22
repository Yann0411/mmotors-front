function seDeconnecter() {
        localStorage.clear();
        window.location.href = 'auth/auth.html';


    }

     const nomStocke = localStorage.getItem('nom');


    if (nomStocke) {
        document.getElementById('nom-utilisateur').textContent = 'Bonjour ' + nomStocke;
    } else {
        document.querySelector('.btn-deconnecter').style.display = 'none';
    }

    let typeOffreActuel = '';

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
        rechercherVehicules();
    }

    function retourAccueil() {

      document.getElementById('catalogue').style.display = 'none';
        document.getElementById('accueil').style.display = 'block';

        document.getElementById('liste-vehicules').innerHTML = '';
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
            const div = document.getElementById('liste-vehicules');

            if (vehicules.length === 0) {
                div.innerHTML = '<p>Aucun véhicule ne correspond à votre recherche.</p>';
                return;
            }

            div.innerHTML = '';
            vehicules.forEach(function(vehicule) {

                // label du bouton selon le type
                const labelBtn = vehicule.typeOffre === 'ACHAT' ? 'Déposer un dossier d\'achat'
                    : vehicule.typeOffre === 'LOCATION_ACHAT' ? 'Déposer un dossier LOA'
                    : 'Déposer un dossier de location';

                div.innerHTML += `
                    <div class="carte-vehicule">
                        <h3>${vehicule.marque} ${vehicule.modele}</h3>
                        <p>Année : ${vehicule.annee}</p>
                        <p>Prix : ${vehicule.prix.toLocaleString('fr-FR')} €</p>
                        <p>Kilométrage : ${vehicule.kilometrage.toLocaleString('fr-FR')} km</p>
                        <button onclick="window.location.href='dossier/dossier.html?marque=${vehicule.marque}&modele=${vehicule.modele}&annee=${vehicule.annee}&prix=${vehicule.prix}&km=${vehicule.kilometrage}&typeOffre=${vehicule.typeOffre}'">
                            ${labelBtn}
                        </button>
                    </div> 
                `;
            });

        } catch (error) {
            document.getElementById('liste-vehicules').innerHTML =
                '<p style="color:red;">Impossible de charger les véhicules. Veuillez réessayer.</p>';
        }
    }

    document.getElementById('filtre-marque').addEventListener('input', rechercherVehicules);
    document.getElementById('filtre-modele').addEventListener('input', rechercherVehicules);
    document.getElementById('filtre-prix-min').addEventListener('input', rechercherVehicules);
    document.getElementById('filtre-prix-max').addEventListener('input', rechercherVehicules);
    document.getElementById('filtre-km').addEventListener('input', rechercherVehicules);
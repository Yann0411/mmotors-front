let typeOffreActuel = '';
  
  function afficherCatalogue(typeOffre) {

      typeOffreActuel = typeOffre;
      document.getElementById('accueil').style.display = 'none';
      
      document.getElementById('catalogue').style.display = 'block';
      document.getElementById('titre-catalogue').textContent =
          typeOffre === 'ACHAT' ? 'Véhicules à vendre' : 'Véhicules en location';
      rechercherVehicules();
  }



    function retourAccueil() {

       document.getElementById('catalogue').style.display = 'none';
      document.getElementById('accueil').style.display = 'block';
      document.getElementById('liste-vehicules').innerHTML = '';
  }

  

            async function rechercherVehicules() {

      const marque = document.getElementById('filtre-marque').value;

      const modele = document.getElementById('filtre-modele').value;
      
       const prixMin = document.getElementById('filtre-prix-min').value;
      const prixMax = document.getElementById('filtre-prix-max').value;
      const km = document.getElementById('filtre-km').value;

        const params = { typeOffre: typeOffreActuel };
      if (marque) params.marque = marque;
      if (modele) params.modele = modele;
      if (prixMin) params.prixMin = prixMin;
      if (prixMax) params.prixMax = prixMax;
      if (km) params.kilometrageMax = km;

      const response = await axios.get('http://localhost:8080/vehicules', { params });
         const vehicules = response.data;
      const div = document.getElementById('liste-vehicules');

      if (vehicules.length === 0) {
          div.innerHTML = '<p>Aucun véhicule trouvé.</p>';
          return;
      }

        div.innerHTML = '';
      vehicules.forEach(function(vehicule) {
          div.innerHTML += `
              <div class="carte-vehicule">
                  <h3>${vehicule.marque} ${vehicule.modele}</h3>
                  <p>Année : ${vehicule.annee}</p>
                  <p>Prix : ${vehicule.prix} €</p>
                  <p>Kilométrage : ${vehicule.kilometrage} km</p>
              </div>
          `;
      }); 


  }


    
      
  document.getElementById('filtre-marque').addEventListener('input', rechercherVehicules);
  document.getElementById('filtre-modele').addEventListener('input', rechercherVehicules);
  document.getElementById('filtre-prix-min').addEventListener('input', rechercherVehicules);
  document.getElementById('filtre-prix-max').addEventListener('input', rechercherVehicules);
  document.getElementById('filtre-km').addEventListener('input', rechercherVehicules);
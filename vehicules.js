async function chargerVehicules() {
    const response = await axios.get("http://localhost:8080/vehicules");
    const vehicules = response.data;
    const div = document.getElementById("liste-vehicules");

    vehicules.forEach(function(vehicule) {                               
        div.innerHTML += `
            <div>                                       
                <h3>${vehicule.marque} ${vehicule.modele}</h3>
                <p>Année : ${vehicule.annee}</p>
                <p>Prix : ${vehicule.prix} €</p>
                <p>Kilométrage : ${vehicule.kilometrage} km</p>     
                <p>Type : ${vehicule.typeOffre}</p>
            </div>                                                       
            <hr>
        `;
    });                       
}
                                                                         
chargerVehicules();

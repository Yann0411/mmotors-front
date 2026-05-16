
function seDeconnecter() {
    localStorage.clear();
    window.location.href = '../auth/auth.html';
}
  const nomStocke = localStorage.getItem('nom');
  if (nomStocke) {
      document.getElementById('nom-utilisateur').textContent = 'Bonjour ' + nomStocke;
  }





async function deposerDossier() {

     const typeOffre = document.getElementById('typeOffre').value;

      const message = document.getElementById('message').value;
    const msg = document.getElementById('msg-dossier');

    const token = localStorage.getItem('token');

    console.log("=== DÉPÔT DE DOSSIER ===");
    console.log("typeOffre : " + typeOffre);
    console.log("message : " + message);
    console.log("token présent : " + (token ? "OUI" : "NON"));


    if (!token) {
        msg.style.color = 'red';
        msg.textContent = 'Vous devez être connecté pour déposer un dossier.';

        return;
    }

    try {
        await axios.post('http://localhost:8080/dossiers',

            { typeOffre, message },
            { headers: { Authorization: 'Bearer ' + token } }
        );
        msg.style.color = 'green';
        msg.textContent = 'Dossier envoyé ! Vous pouvez suivre son statut.';
    } catch (error) {
        msg.style.color = 'red';
        msg.textContent = error.response?.data || 'Erreur lors de l\'envoi';
    }
}

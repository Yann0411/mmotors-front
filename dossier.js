async function deposerDossier() {

     const typeOffre = document.getElementById('typeOffre').value;

      const message = document.getElementById('message').value;
    const msg = document.getElementById('msg-dossier');

    const token = localStorage.getItem('token');

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

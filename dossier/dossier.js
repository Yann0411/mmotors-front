const token = localStorage.getItem('token');


  if (!token) {
      window.location.href = '../auth/auth.html';

    }

  const params = new URLSearchParams(window.location.search);

  if (params.get('marque')) {

       document.getElementById('typeOffre').value = params.get('typeOffre') || 'ACHAT';
        document.getElementById('message').value =
      
        `Véhicule souhaité : ${params.get('marque')} ${params.get('modele')} ${params.get('annee')} - ${params.get('km')} km - ${params.get('prix')} € - ${params.get('typeOffre')}`;
  }

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
       const message   = document.getElementById('message').value;
         const msg = document.getElementById('msg-dossier');
         const btn = document.querySelector('button[onclick="deposerDossier()"]');

      
         if (!message || message.trim() === '') {
           msg.style.color = 'red';
        
           msg.textContent = 'Veuillez décrire le véhicule souhaité avant d\'envoyer.';
         
           return;
      }

       
       if (!token) {
       
           msg.style.color = 'red';
          msg.textContent = 'Vous devez être connecté pour déposer un dossier.';
          return;
      }

       btn.disabled = true;
        btn.textContent = 'Envoi en cours...';


      
        let succes = false;
        try {


          await axios.post('https://mmotors-back-production.up.railway.app/dossiers',
              { typeOffre, message },
              { headers: { Authorization: 'Bearer ' + token } }
          );
          succes = true;

           msg.style.color = 'green';
          
           msg.textContent = 'Dossier envoyé ! Vous pouvez suivre son statut dans votre espace client.';
      } catch (error) {
           msg.style.color = 'red';
            msg.textContent = error.response?.data || 'Erreur lors de l\'envoi. Veuillez réessayer.';
      } finally {

          if (succes) {

              // Bouton reste désactivé après succès pour éviter les doubles envois
              btn.textContent = '✓ Dossier envoyé';
              btn.style.backgroundColor = '#28a745';
              
          } else {
              btn.disabled = false;
              btn.textContent = 'Envoyer mon dossier';
          }
      }
  }

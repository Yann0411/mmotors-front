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

const params = new URLSearchParams(window.location.search);
 // console.log('params', params.get('marque'), params.get('prix'))


 // protection basique contre les injections
    function contientScript(valeur) {
        return /<|>|javascript:|onerror=/i.test(valeur);
    }


  // si le user vient depuis un véhicule précis
  if (params.get('marque')) {

      // on affiche la carte véhicule en lecture seule
      document.getElementById('vehicule-selectionne').style.display = 'block';

      document.getElementById('info-marque-modele').textContent = params.get('marque') + ' ' + params.get('modele');

        document.getElementById('info-annee').textContent = params.get('annee');

      document.getElementById('info-km').textContent = parseInt(params.get('km')).toLocaleString('fr-FR') + ' km';

      document.getElementById('info-prix').textContent = parseFloat(params.get('prix')).toLocaleString('fr-FR') + ' €';

       document.getElementById('info-type').textContent = params.get('typeOffre') === 'ACHAT' ? 'Achat' : 'Location';

      // on masque le select typeOffre => c'est déjà défini par le véhicule
      document.getElementById('groupe-typeOffre').style.display = 'none';
      document.getElementById('typeOffre').value = params.get('typeOffre') || 'ACHAT';

      // Message devient optionnel
      document.getElementById('label-message').innerHTML = 'Message complémentaire <span style="color:#64748B; font-weight:400;">(optionnel)</span>';
      document.getElementById('message').placeholder = 'Ajoutez un message si vous le souhaitez...';
      document.getElementById('message').value = 'Bonjour, je suis intéressé par ce véhicule, pouvez-vous me recontacter ?'
  }


  async function deposerDossier() {

      const typeOffre  = document.getElementById('typeOffre').value;
      const messageClient = document.getElementById('message').value.trim();
      const telephone = document.getElementById('telephone').value.trim()

      const msg = document.getElementById('msg-dossier');
        const btn = document.getElementById('btn-dossier');

      msg.textContent = '';

      // si pas de véhicule sélectionné, le message est obligatoire

      if (!params.get('marque') && !messageClient) {

        // console.log(dossiers)

          msg.style.color = 'red';
            msg.textContent = 'Veuillez décrire le véhicule souhaité avant d\'envoyer.';
          return;
      }
      if (!telephone) {
      msg.style.color = 'red'
      msg.textContent = 'Veuillez renseigner votre numéro de téléphone.'
      return
  }


      if (messageClient && contientScript(messageClient)) {


            msg.style.color = 'red';
             msg.textContent = 'Le message contient des caractères non autorisés.';
              return;
        }


      if (!token) {

          msg.style.color = 'red';
          msg.textContent = 'Vous devez être connecté pour déposer un dossier.';
          return;

      }

      // construction du message final
      let messageFinal = '';

      if (params.get('marque')) {

            // infos véhicule en lecture seule + message client éventuel
          messageFinal = `Véhicule : ${params.get('marque')} ${params.get('modele')} ${params.get('annee')} - ${parseInt(params.get('km')).toLocaleString('fr-FR')} km - ${parseFloat(params.get('prix')).toLocaleString('fr-FR')} € - ${params.get('typeOffre') === 'ACHAT' ? 'Achat' : 'Location'}`;
          if (messageClient) {
              messageFinal += `\nMa demande : ${messageClient}`;
          }
      } else {
          messageFinal = messageClient;
      }

        btn.disabled = true;
      btn.textContent = 'Envoi en cours...';

      let succes = false;
      try {

          await axios.post('https://mmotors-back-production.up.railway.app/dossiers',
              { typeOffre, message: messageFinal, telephone },
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
              btn.textContent = '✓ Dossier envoyé';
              btn.style.backgroundColor = '#28a745';
              // bouton reste désactivé
          } else {
                btn.disabled = false;
              btn.textContent = 'Envoyer mon dossier';
          }
      }
  }

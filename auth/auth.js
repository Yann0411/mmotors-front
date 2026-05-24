//===== UTILITAIRES =============

  function afficherErreur(idErreur, message) {
    
      const el = document.getElementById(idErreur);
      if (!el) return;
      el.textContent = message;
      el.style.display = message ? 'block' : 'none';
      
      // Bordure rouge sur le champ concerné
      const wrapper = el.previousElementSibling;
      const input = wrapper && wrapper.classList.contains('champ-mdp')
          ? wrapper.querySelector('input')
          : el.previousElementSibling;

      if (input && input.tagName === 'INPUT') input.classList.toggle('input-erreur', !!message);
  }

  function clearErreurs(prefix) {


      document.querySelectorAll(`[id^="err-${prefix}"]`).forEach(el => {
          el.textContent = '';
          el.style.display = 'none';
      });
      document.querySelectorAll('.input-erreur').forEach(el => el.classList.remove('input-erreur'));
  }
  
  function toggleMdp(inputId, btn) {
      const input = document.getElementById(inputId);
      if (input.type === 'password') {
          input.type = 'text';
          btn.innerHTML = '&#128064;';
      } else {
          input.type = 'password';
          btn.innerHTML = '&#128065;';
      }
  }

  // ===== BASCULE FOMULAIRES =====

  function afficherInscription() {
      document.getElementById('box-connexion').style.display = 'none';

        document.getElementById('box-inscription').style.display = 'flex';
        clearErreurs('connexion');
      document.getElementById('msg-connexion').textContent = '';
  }

  function afficherConnexion() {

      document.getElementById('box-inscription').style.display = 'none';
      document.getElementById('box-connexion').style.display = 'flex';
      clearErreurs('inscription'); 
     // document.getElementById('msg-inscription').textContent = '';
      document.getElementById('msg-inscription').textContent = '';
  }

  // ===== INSCRIPTION ===================

  async function sInscrire() {

      const nom = document.getElementById('inscription-nom').value.trim();

      const prenom = document.getElementById('inscription-prenom').value.trim();

      const email= document.getElementById('inscription-email').value.trim();
      const motDePasse = document.getElementById('inscription-mdp').value;
      const msg = document.getElementById('msg-inscription');
      const btn = document.getElementById('btn-inscription');
  
      clearErreurs('inscription');
      msg.textContent = '';

      let hasError = false;

      if (!nom) {

             afficherErreur('err-inscription-nom', 'Veuillez saisir votre nom.');
          hasError = true;
      }
      if (!prenom) {  
          afficherErreur('err-inscription-prenom', 'Veuillez saisir votre prénom.');
          hasError = true;
      }
      if (!email) {
           afficherErreur('err-inscription-email', 'Veuillez saisir votre adresse email.');
          hasError = true;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          afficherErreur('err-inscription-email', 'Veuillez saisir une adresse email valide.');
          hasError = true;
      }

      if (!motDePasse) {
          afficherErreur('err-inscription-mdp', 'Veuillez saisir un mot de passe.');
          hasError = true;
      } else if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(motDePasse)) {
          afficherErreur('err-inscription-mdp', 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial (!@#$%^&*).');
          hasError = true;
      }

      if (hasError) return;
  
      btn.disabled = true;
      btn.textContent = 'Création en cours...';

      try {
          await axios.post('https://mmotors-back-production.up.railway.app/auth/inscription',
              { nom, prenom, email, motDePasse }
          );
          msg.style.color = 'green';
          msg.textContent = 'Compte créé avec succès ! Redirection vers la connexion...';
          setTimeout(() => afficherConnexion(), 2000);
      } catch (error) {
          const data = error.response?.data;
          if (Array.isArray(data)) {
              // Routage des erreurs de validation @Valid vers le bon champ
              data.forEach(errMsg => {

                  if (errMsg.toLowerCase().includes('mot de passe') || errMsg.includes('majuscule')) {
                      afficherErreur('err-inscription-mdp', errMsg);
                  } else if (errMsg.toLowerCase().includes('email')) {
                    
                      afficherErreur('err-inscription-email', errMsg);
                  } else if (errMsg.toLowerCase().includes('prénom')) {
                      afficherErreur('err-inscription-prenom', errMsg);
                  } else if (errMsg.toLowerCase().includes('nom')) {
                      afficherErreur('err-inscription-nom', errMsg);
                  } else {
                      msg.style.color = 'red';
                      msg.textContent = errMsg;
                  }
              });
          } else if (typeof data === 'string' && data.toLowerCase().includes('déjà utilisé')) {
              afficherErreur('err-inscription-email', 'Cette adresse email est déjà associée à un compte. Essayez de vous connecter.');
          } else {
              msg.style.color = 'red';
              msg.textContent = data || 'Une erreur est survenue. Veuillez réessayer.';
          }
      } finally {
          btn.disabled = false;
          btn.textContent = 'Créer mon compte';
      }
  }

  // ===== CONNEXION =====

  async function seConnecter() {

      const email= document.getElementById('connexion-email').value.trim();
      const motDePasse = document.getElementById('connexion-mdp').value;

      const msg = document.getElementById('msg-connexion');
      const btn = document.getElementById('btn-connexion');

      clearErreurs('connexion');
      msg.textContent = '';

      let hasError = false;

      if (!email) {

          afficherErreur('err-connexion-email', 'Veuillez saisir votre adresse email.');
          hasError = true;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

          afficherErreur('err-connexion-email', 'Veuillez saisir une adresse email valide.');
          hasError = true;
      }
      if (!motDePasse) {


          afficherErreur('err-connexion-mdp', 'Veuillez saisir votre mot de passe.');
          hasError = true;
      }

      if (hasError) return;

      btn.disabled = true;
      btn.textContent = 'Connexion en cours...';

      try {

          const response = await axios.post('https://mmotors-back-production.up.railway.app/auth/connexion', {
              email, motDePasse
          });

          localStorage.clear();
          localStorage.setItem('token', response.data.token);


          localStorage.setItem('nom', response.data.nom);
          localStorage.setItem('role', response.data.role);

          msg.style.color = 'green';
          msg.textContent = 'Connexion réussie ! Bonjour ' + response.data.nom;

          if (response.data.role === 'ADMIN') {
              setTimeout(() => window.location.href = '../admin/admin.html', 1500);
          } else {
              setTimeout(() => window.location.href = '../index.html', 1500);
          }
      } catch (error) {


          const data = error.response?.data;
          if (data === 'Email introuvable') {
              afficherErreur('err-connexion-email', 'Email ou mot de passe incorrect.');

          } else if (data === 'Mot de passe incorrect') {

              afficherErreur('err-connexion-mdp', 'Email ou mot de passe incorrect.');
          } else {


              msg.style.color = 'red';
              msg.textContent = data || 'Une erreur est survenue. Veuillez réessayer.';
          }
      } finally {
          btn.disabled = false;
          btn.textContent = 'Se connecter';
      }
  }


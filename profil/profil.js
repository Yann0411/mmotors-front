const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "../auth/auth.html";
}

function seDeconnecter() {
  localStorage.clear();
  window.location.href = "../auth/auth.html";
}

const nomStocke = localStorage.getItem("nom");

if (nomStocke) {
  document.getElementById("nom-utilisateur").textContent =
    "Bonjour " + nomStocke.charAt(0).toUpperCase() + nomStocke.slice(1);
}

function toggleMdp(inputId, btn) {
  const input = document.getElementById(inputId);

  if (input.type === "password") {
    input.type = "text";
    btn.innerHTML = "&#128064;";
  } else {
    input.type = "password";
    btn.innerHTML = "&#128065;";
  }
}

// chargement du profil au démarrage
async function chargerProfil() {
  try {
    const response = await axios.get(
      "https://mmotors-back-production.up.railway.app/profil",
      { headers: { Authorization: "Bearer " + token } },
    );
    document.getElementById("profil-email").value = response.data.email;

    document.getElementById("profil-nom").value = response.data.nom;
    document.getElementById("profil-prenom").value = response.data.prenom;
  } catch (error) {
    document.getElementById("msg-profil").style.color = "red";
    document.getElementById("msg-profil").textContent =
      "Impossible de charger le profil.";
  }
}

async function sauvegarderProfil() {
  const nom = document.getElementById("profil-nom").value.trim();
  const prenom = document.getElementById("profil-prenom").value.trim();
  const msg = document.getElementById("msg-profil");
  const btn = document.getElementById("btn-profil");

  msg.textContent = "";

  if (!nom || !prenom) {
    msg.style.color = "red";
    msg.textContent = "Nom et prénom sont obligatoires.";
    return;
  }

  btn.disabled = true;
  btn.textContent = "Sauvegarde...";

  try {
    await axios.put(
      "https://mmotors-back-production.up.railway.app/profil",
      { nom, prenom },
      { headers: { Authorization: "Bearer " + token } },
    );
    msg.style.color = "green";
    msg.textContent = "Profil mis à jour avec succès.";
    // on met à jour le nom affiché dans la navbar
    localStorage.setItem("nom", prenom);
    document.getElementById("nom-utilisateur").textContent =
      "Bonjour " + prenom.charAt(0).toUpperCase() + prenom.slice(1);
  } catch (error) {
    msg.style.color = "red";
    msg.textContent = error.response?.data || "Erreur lors de la sauvegarde.";
  } finally {
    btn.disabled = false;
    btn.textContent = "Sauvegarder";
  }
}

async function changerMotDePasse() {
  const ancienMdp = document.getElementById("ancien-mdp").value;
  const nouveauMdp = document.getElementById("nouveau-mdp").value;
  const msg = document.getElementById("msg-mdp");

  const btn = document.getElementById("btn-mdp");

  msg.textContent = "";

  if (!ancienMdp || !nouveauMdp) {
    msg.style.color = "red";
    msg.textContent = "Veuillez remplir les deux champs.";
    return;
  }

  btn.disabled = true;
  btn.textContent = "Modification...";

  try {
    await axios.put(
      "https://mmotors-back-production.up.railway.app/profil/mot-de-passe",
      { ancienMotDePasse: ancienMdp, nouveauMotDePasse: nouveauMdp },
      { headers: { Authorization: "Bearer " + token } },
    );
    msg.style.color = "green";
    msg.textContent = "Mot de passe modifié avec succès.";
    document.getElementById("ancien-mdp").value = "";
    document.getElementById("nouveau-mdp").value = "";
  } catch (error) {
    msg.style.color = "red";
    msg.textContent = error.response?.data || "Erreur lors de la modification.";
  } finally {
    btn.disabled = false;
    btn.textContent = "Modifier le mot de passe";
  }
}

chargerProfil();

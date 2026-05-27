**M-Motors — Front-end**  
Application web front-end de M-Motors, spécialiste en vente et location de véhicules d'occasion.  
**Application en ligne :** [https://charming-tarsier-05f0f3.netlify.app](https://charming-tarsier-05f0f3.netlify.app "https://charming-tarsier-05f0f3.netlify.app")  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OQQmAABRAsSeYxZw/lVeDGMACBrCCNxG2BFtmZquOAAD4i3Ot7mr/egIAwGvXA6fOBdd+dKAKAAAAAElFTkSuQmCC)  
**Technologies**  
- HTML5 / CSS3  
- JavaScript (ES6+)  
- Axios (appels HTTP)  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AABAAsSPBCUZfEnoYmFDBhAU2QtIq6DIzW7UHAMBfnGt1V8fXEwAAXrse/wcF74lXkIsAAAAASUVORK5CYII=)  
**Structure du projet**  
mmotors-front/  
 ├── index.html              # Page d'accueil + catalogue véhicules  
 ├── vehicules.js            # Chargement et filtres catalogue  
 ├── styles.css              # Styles globaux  
 ├── assets/                 # Images  
 ├── auth/  
 │   ├── auth.html           # Inscription / Connexion / Mot de passe oublié  
 │   ├── auth.js  
 │   └── auth.css  
 ├── dossier/  
 │   ├── dossier.html        # Formulaire dépôt de dossier  
 │   └── dossier.js  
 ├── espaceClient/  
 │   ├── espaceClient.html   # Suivi des dossiers client  
 │   └── espaceClient.js  
 ├── profil/  
 │   ├── profil.html         # Consultation et modification du profil  
 │   ├── profil.js  
 │   └── profil.css  
 └── admin/  
     ├── admin.html          # Back-office administrateur  
     └── admin.js  
   
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OQQ2AQBAAsSHhiQI0IWp9ngBsYIEfIWkVdJuZs5oAAPiLe6+O6vp6AgDAa+sBhYwEOqBD7p8AAAAASUVORK5CYII=)  
**Installation locale**  
**Prérequis**  
- [VS Code](https://code.visualstudio.com/ "https://code.visualstudio.com/")  
- Extension **Live Server** (VS Code)  
- Le back-end doit être lancé (voir dépôt mmotors-back)  
**Étapes**  
1. Cloner le dépôt :  
git clone https://github.com/Yann0411/mmotors-front.git  
 cd mmotors-front  
   
1. Ouvrir le dossier dans VS Code  
2. Faire un clic droit sur index.html → **Open with Live Server**  
3. L'application s'ouvre sur http://127.0.0.1:5500  
*Par défaut les appels API pointent vers le back-end déployé sur Railway. Pour pointer vers un back-end local, remplacer l'URL * *https://mmotors-back-production.up.railway.app* * par * *http://localhost:8080* * dans les fichiers JS.*  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANElEQVR4nO3OMQ0AIAwAwZIgBKnVgjN8dGDBABMhuZt+/JaZIyJmAADwi9VP1NMNAABu1AaU3AUhiyfJeAAAAABJRU5ErkJggg==)  
**Comptes de test**  
| | | |  
|-|-|-|  
| **Rôle** | **Email** | **Mot de passe** |   
| Admin | [admin@mmotors.fr](mailto:admin@mmotors.fr "mailto:admin@mmotors.fr") | Kakarot@2026 |   
| Client | [test@gmail.com](mailto:test@gmail.com "mailto:test@gmail.com") | Azertyuiop@123 |   
   
*Il est également possible de créer un nouveau compte client depuis la page d'inscription.*  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AABAAsSNhYMMAKlD4OzrxgQU2QtIq6DIzR3UFAMBf3Gu1VefXEwAAXtsfSqADWz4G/HUAAAAASUVORK5CYII=)  
**Déploiement (Netlify)**  
Le front-end est déployé automatiquement sur Netlify à chaque git push sur la branche main.  
Lien Netlify : [https://charming-tarsier-05f0f3.netlify.app](https://charming-tarsier-05f0f3.netlify.app "https://charming-tarsier-05f0f3.netlify.app")  

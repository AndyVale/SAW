import {showLogin} from "../../../jsfunctions/login.js";
import {renderNavbar} from "../../../jsfunctions/navbar.js";
import {renderFooter} from "../../../jsfunctions/footer.js";
import {removeUserData, renderPosts} from "../../../jsfunctions/functions.js";

/**
 * @param {Object} datiUtente - oggetto contenenente i dati dell'utente con campi con lo stesso nome del database
 */
function stampaDatiUtenti(datiUtente) {
  //console.log(datiUtente);
  let nomeCognome = document.getElementById("fullname"),
      nPost = document.getElementById("nPost"),
      nFollower = document.getElementById("nFollowers"),
      nFollowing = document.getElementById("nFollowing"),
      immagineProfilo = document.getElementById("profile-image");
  nPost.textContent = datiUtente.nPost;
  nFollower.textContent = datiUtente.nFollower;
  nFollowing.textContent = datiUtente.nFollowing;
  nomeCognome.textContent = datiUtente.lastname + " " + datiUtente.firstname;
  immagineProfilo.src = "../../immagini/profile/" + datiUtente.profilePicture;
}

/**
 * Funzione che mediante fetch ottiene i post dell'utente loggato
 */
async function getUserPosts(){
  fetch("../../../backend/script/show_profile_posts.php", {
    method: 'GET'
  })
  .then(response =>{
    if(!response.ok){
      throw new Error("Errore nella richiesta");
    }
    return response.json();
  })
  .then(data =>{
    if(data['result'] == "OK"){
      renderPosts(data['data'], document.getElementById("postsContainer"));
    }else{
      switch(data['message']){
        case "ERROR_NOTLOGGED":
          alert("Errore nella richiesta");
          removeUserData();
          break;
        case "POST_NOT_FOUND":
          alert("Errore nel database");
          break;
      }
    }
  })
  .catch(error => {
    console.error('Errore:', error);
    console.log('Nome dell\'errore:', error.name);
    console.log('Messaggio dell\'errore:', error.message);
    console.log('Stack dell\'errore:', error.stack);
 });
}

/**
 * Funzione che mediante fetch ottiene i dati dell'utente loggato come nome, cognome ecc ecc...
 */
async function getUserData(){
  fetch('../../../backend/script/show_profile.php', {
    method: 'GET' //deve "ottenere" i dati
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Errore nella richiesta.');
    }
    return response.json();
  })
  .then(data => {//potrei in realtà usare la memoria del browser per ottenere i dati
      if(data['result'] == "OK"){
        stampaDatiUtenti(data['data']);
      }else{
        switch(data['message']){
          case "ERROR_NOTLOGGED":
            removeUserData();
          showLogin();

            //window.location.href = "../homepage";
            break;
          case "DB_ERROR":
            alert("Errore nel database");
            break;
          case "ERROR_SHOW":
            console.log(data);
            alert("Errore nel mostrare i dati dell'utente");
            break; 
        }
      }
   })
  .catch(error => {
      console.error('Errore:', error);
      console.log('Nome dell\'errore:', error.name);
      console.log('Messaggio dell\'errore:', error.message);
      console.log('Stack dell\'errore:', error.stack);
   });
}

document.addEventListener('DOMContentLoaded', function() {
    // Effettua una richiesta API Fetch per ottenere i dati dell'utente
    renderFooter();
    renderNavbar();

    getUserData();
    getUserPosts();
});

//var postContainer = document.getElementById("postsContainer");

//postContainer.addEventListener("click", (e) =>{
//  if(e.target.id.includes("bottoneLike")){
//    console.log("Ascoltato l'evento click del bottone like del post"+ e.target.id.substring(11));
// }
//});
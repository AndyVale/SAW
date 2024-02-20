//export {getUserData};
import {cookieLogin, showLogin} from "../../../jsfunctions/login.js";
import {renderNavbar} from "../../../jsfunctions/navbar.js";
import {renderFooter} from "../../../jsfunctions/footer.js";
import {storeUserData, removeUserData, renderPosts, getLikedPosts, setLikedPosts, postInteraction} from "../../../jsfunctions/functions.js";


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
    switch(response.status){
      case 401:
        removeUserData();
        showLogin();
        break;
      case 200:
    }
    if(!response.ok){
      throw new Error("Errore nella richiesta a show_profile_posts.php");
    }
    return response.json();
  })
  .then(data =>{
    if(data['result'] == "OK"){
      renderPosts(data['data'], document.getElementById("postsContainer"));//sincrona, quindi sono sicuro che i post siano renderizzati prima di getLikedPosts...
      getLikedPosts().then((postsLiked) => setLikedPosts(postsLiked));
    }else{
      switch(data['message']){
        case "ERROR_NOTLOGGED":
          removeUserData();
          window.location.href = "../homepage";
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
    //console.log("domcontentloaded");
    
    renderFooter();
    cookieLogin().then((res) => {//prima provo a fare il login con i cookie, se va male verrà gestito dalle funzioni richiamate
      renderNavbar();
      getUserData();
      getUserPosts();
    });
});


document.getElementById("postsContainer").addEventListener("click", (e) =>{
  if(e.target.id.includes("bottoneLike")){
    console.log("LIKE");
    postInteraction(e.target, e.target.classList.contains("liked"));
  }
  else if (e.target.parentNode.parentNode.id.includes("bottoneLike")){//TODO: Trovare un modo migliore per gestirlo, altrimenti cliccando sull'inconcina del cuore non funziona
      console.log("LIKE");
      postInteraction(e.target.parentNode.parentNode, e.target.parentNode.parentNode.classList.contains("liked"));
  }
});
//var postContainer = document.getElementById("postsContainer");

//postContainer.addEventListener("click", (e) =>{
//  if(e.target.id.includes("bottoneLike")){
//    console.log("Ascoltato l'evento click del bottone like del post"+ e.target.id.substring(11));
// }
//});
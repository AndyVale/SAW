//export {getUserData};
import {cookieLogin, showLogin} from "../../jsfunctions/login.js";
import {renderNavbar} from "../../jsfunctions/navbar.js";
import {renderFooter} from "../../jsfunctions/footer.js";
import {storeUserData, removeUserData, renderPosts, getLikedPosts, setLikedPosts, postInteraction, getUserPosts} from "../../jsfunctions/functions.js";


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
 * Funzione che mediante fetch ottiene i dati dell'utente loggato come nome, cognome ecc ecc...
 */
function getUserData(){
  fetch('../../../backend/script/show_profile.php', {
    method: 'GET' //deve "ottenere" i dati
  })
  .then(response => {
    switch(response.status){
      case 200:
        return response.json();
      case 401:
          removeUserData();
          return response.json();
          
      default:
        throw new Error('Errore nella richiesta.');
    }
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
    renderFooter();
    cookieLogin().then(() => {//prima provo a fare il login con i cookie, se va male verrà gestito dalle funzioni richiamate
      renderNavbar();
      getUserData();
      getUserPosts().then((posts) => {
        renderPosts(posts, document.getElementById("postsContainer"));
        getLikedPosts().then((postsLiked) => setLikedPosts(postsLiked));
      }).catch(() => document.getElementById("postsContainer").innerHTML = "<div class='h1 text-center'>Errore nel caricamento dei post</div>");
    });
});


document.getElementById("postsContainer").addEventListener("click", (e) =>{
  const bottoneLike = e.target.closest("button");
  if(bottoneLike){
    console.log("LIKE");
    postInteraction(bottoneLike);
  }
});
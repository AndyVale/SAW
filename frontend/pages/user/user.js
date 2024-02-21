import {renderNavbar} from "../../jsfunctions/navbar.js";
import {renderFooter} from "../../jsfunctions/footer.js";
import {removeUserData, storeUserData, renderPosts, getLikedPosts, setLikedPosts, postInteraction, getUserPosts} from "../../jsfunctions/functions.js";
import {cookieLogin, showLogin} from "../../jsfunctions/login.js";

let parts = window.location.search.substring(1).split("&"),
    idUser = null,
    postContainer = document.getElementById("postsContainer"),
    bottoneSegui = document.getElementById("bottoneSeguiUtente");

for (let i = 0; i < parts.length && idUser == null; i++) {
    var temp = parts[i].split("=");
    if(temp[0] == 'ID') idUser = temp[1];
}
console.log("ID inviato: "+idUser);


/**
 * Funzione che permette di stampare i dati dell'utente di cui si vogliono visualizzare le informazioni
 * @param {object} datiUtente oggetto cone i dati dell'utente
 */
function stampaDatiUtenti(datiUtente) {
    console.log("stampaDatiUtenti: ");
    console.log(datiUtente);
    let nomeCognome = document.getElementById("fullname"),
        nPost=document.getElementById("nPost"),
        nFollower=document.getElementById("nFollowers"),
        nFollowing=document.getElementById("nFollowing"),
        imgProfilo = document.getElementById("profile-image");
    nPost.textContent = datiUtente.nPost;
    nFollower.textContent = datiUtente.nFollower;
    nFollowing.textContent = datiUtente.nFollowing;
    nomeCognome.textContent = datiUtente.firstname + " " + datiUtente.lastname;
    imgProfilo.src = "../../immagini/profile/"+datiUtente.profilePicture;
    document.title = datiUtente.firstname + " " + datiUtente.lastname;
  }

/**
 * Funzione asincrona che permette di ottenere le informazioni dell'utente
 * @param {string} idUser id dell'utente di cui si vogliono ottenere le informazioni
 */
async function getUserInfo(idUser){
    return fetch('../../../backend/script/show_user.php?ID='+idUser, {
        method: 'GET'
    }).then(response => response.text());
}

/**
 * Funzione che stampa se l'utente loggato segue o meno l'utente visualizzato
 */
function getIsFollowed(bSegui){
    console.log("getIsFollowed()");
    return fetch("../../../backend/script/follow_unfollow.php?idUtenteSeguito="+idUser, {
        method: "GET"
    }).then(response => {
        if(response.status == 200)
            return response.json();
        return {isFollowed: false};//faccio finta di niente
    })
    .then(data => {
        //console.log(data);
        if(data.isFollowed){
            bSegui.textContent = "Seguito";
        }else{
            bSegui.textContent = "Segui";
        }
    })
    .catch(error => console.log(error));
}

/**
 * Funzione che permette di seguire o smettere di seguire un utente inviando una richiesta al server
 * @param {boolean} segui true se si vuole seguire, false se si vuole smettere di seguire 
 */
async function toggleSegui(segui){
    let metodo = "POST";
    if(!segui)
        metodo = "DELETE";
    fetch("../../../backend/script/follow_unfollow.php?idUtenteSeguito="+idUser, {
        method: metodo
    }).then(response => {
        console.log(response);
        switch(response.status){
            case 200:
                bottoneSegui.textContent = "Segui";
                break;
                //return response.json();
            case 201:
                bottoneSegui.textContent = "Seguito";
                break;
                //return response.json();
            case 204:
                window.location.href = "https://www.youtube.com/watch?v=xvFZjo5PgG0&pp=ygUIcmlja3JvbGw%3D";
                break;
            case 401:
                console.log("Errore nel follow");
                showLogin();
                console.log(response);
                break;
        }
        return response.text();
    }).catch(error => console.log(error));
}

document.addEventListener("DOMContentLoaded", () => {
    renderFooter();
    cookieLogin().then(()=> {//prima provo a fare il login con i cookie, se va male verrà gestito dalle funzioni richiamate
      renderNavbar();
      getUserInfo(idUser).then(data => {
          //console.log("DATI: "+data);
          data = JSON.parse(data);
          console.log(data); 
          stampaDatiUtenti(data['datiUtente']);
          getIsFollowed(bottoneSegui);
      });

      getUserPosts(idUser).then((posts) => {
        renderPosts(posts, postContainer);
        getLikedPosts(idUser).then((postsLiked) => setLikedPosts(postsLiked));
      }).catch(() => document.getElementById("postsContainer").innerHTML = "<div class='h1 text-center'>Errore nel caricamento dei post</div>");
    });
});

postContainer.addEventListener("click", (e) =>{
    const bottoneLike = e.target.closest("button");
    if(bottoneLike){
        console.log("LIKE");
        postInteraction(e.target, e.target.classList.contains("liked"));
    }
});

bottoneSegui.addEventListener("click", () => {
    console.log("Click su segui");
    toggleSegui(bottoneSegui.textContent == "Segui");
});
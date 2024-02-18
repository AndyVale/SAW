import {renderNavbar} from "../../jsfunctions/navbar.js";
import {renderFooter} from "../../jsfunctions/footer.js";
import {renderPosts, getLikedPosts} from "../../jsfunctions/functions.js";
import {cookieLogin, showLogin } from "../../jsfunctions/login.js";

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
 * Funzione che permette di settare il like sui post a cui l'utente loggato ha messo like
 */
function setLikedPosts(postsLiked){
    console.log("setLikedPosts");
    console.log(postsLiked);
    if(postsLiked == null) return;
    postsLiked.forEach(post => {
       document.getElementById("bottoneLike"+post.ID).classList.add("liked");
    });
}

/**
 * Funzione che permette di ottenere se l'utente loggato segue o meno l'utente visualizzato
 */
async function getIsFollowed(){
    console.log("getIsFollowed()");
    return fetch("../../../backend/script/follow_unfollow.php?idUtenteSeguito="+idUser, {
        method: "GET"
    }).then(response => {
        if(response.status == 200)
            return response.json();
        return {isFollowed: false};//faccio finta di niente
    })
    .then(data => {
        console.log(data);
        if(data.isFollowed){
            bottoneSegui.textContent = "Seguito";
        }else{
            bottoneSegui.textContent = "Segui";
        }
    })
    .catch(error => console.log(error));
}

/**
 * Funzione che permette di mettere o togliere un like da un post in modo asincrono
 * @param {HTMLElement} clickedButtonPost bottone del post su cui è stato cliccato
 */
async function postInteraction(clickedButtonPost){
    let postId=clickedButtonPost.id.substring(11);
    //alert("postInteraction: "+postId);
    fetch("../../../backend/script/like_post.php?idPost="+postId, {//devo passare l'id del post, quello dell'utente che lo mette è implicito: se l'utente non è loggato niente like
        method: "GET"
    }).then(response => {
        if(response.ok){
            if(clickedButtonPost.classList.contains("liked")){
                clickedButtonPost.classList.remove("liked");
                clickedButtonPost.childNodes[1].textContent=" "+(parseInt(clickedButtonPost.childNodes[1].textContent)-1);
            }else{
                clickedButtonPost.classList.add("liked");
                clickedButtonPost.childNodes[1].textContent=" "+(parseInt(clickedButtonPost.childNodes[1].textContent)+1);
            }
        }
        else{
            console.log("Errore nel like");
            console.log(response);
            showLogin();
        }
    }).catch(error => console.log(error));
}

/**
 * Funzione che permette di seguire o smettere di seguire un utente inviando una richiesta al server
 * @param {boolean} segui true se si vuole seguire, false se si vuole smettere di seguire 
 */
async function toggleSegui(segui){
    let metodo = "PUT";
    if(!segui)
        metodo = "DELETE";
    fetch("../../../backend/script/follow_unfollow.php?idUtenteSeguito="+idUser, {
        method: metodo
    }).then(response => {
        switch(response.status){
            case 200:
                bottoneSegui.textContent = "Segui";
                break;
                //return response.json();
            case 201:
                bottoneSegui.textContent = "Seguito";
                break;
                //return response.json();
            default:
                console.log("Errore nel follow");
                showLogin();
                console.log(response);
        }
    }).catch(error => console.log(error));
}

document.addEventListener("DOMContentLoaded", () => {
    renderFooter();
    cookieLogin().then((res) => {//prima provo a fare il login con i cookie, se va male verrà gestito dalle funzioni richiamate
      renderNavbar();
      getUserInfo(idUser).then(data => {
          console.log("DATI: "+data);
          data = JSON.parse(data);
          console.log(data); 
          stampaDatiUtenti(data['datiUtente']);
          renderPosts(data['posts'], document.getElementById("postsContainer"));
          getLikedPosts(idUser).then((postsLiked) => setLikedPosts(postsLiked));
          getIsFollowed();
      });
    });
});

postContainer.addEventListener("click", (e) =>{
    if(e.target.id.includes("bottoneLike")){
        console.log("LIKE");
        postInteraction(e.target);
    }
    else if (e.target.parentNode.parentNode.id.includes("bottoneLike")){//TODO: Trovare un modo migliore per gestirlo, altrimenti cliccando sull'inconcina del cuore non funziona
        console.log("LIKE");
        postInteraction(e.target.parentNode.parentNode);
    }
});

bottoneSegui.addEventListener("click", () => {
    console.log("Click su segui");
    let b = false
    if(bottoneSegui.textContent == "Segui")
        b = true;
    toggleSegui(b);
});
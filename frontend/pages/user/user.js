import {renderNavbar} from "../../jsfunctions/navbar.js";
import {renderFooter} from "../../jsfunctions/footer.js";
import {renderPosts, getLikedPosts} from "../../jsfunctions/functions.js";
import {cookieLogin, showLogin } from "../../jsfunctions/login.js";

var parts = window.location.search.substring(1).split("&"), idUser = null, postContainer = document.getElementById("postsContainer");
for (let i = 0; i < parts.length && idUser == null; i++) {
    var temp = parts[i].split("=");
    if(temp[0] == 'ID') idUser = temp[1];
}
console.log("ID inviato: "+idUser);

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
    nomeCognome.textContent = datiUtente.lastname + " " + datiUtente.firstname;
    imgProfilo.src = "../../immagini/profile/"+datiUtente.profilePicture;
  }
 
async function getUserInfo(idUser){
    return fetch('../../../backend/script/show_user.php?ID='+idUser, {
        method: 'GET'
    }).then(response => response.text());
}

function setLikedPosts(postsLiked){
    console.log("setLikedPosts");
    console.log(postsLiked);
    if(postsLiked == null) return;
    postsLiked.forEach(post => {
       document.getElementById("bottoneLike"+post.ID).classList.add("liked");
    });
}

function postInteraction(clickedButtonPost){
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


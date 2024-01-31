import {renderNavbar} from "../../jsfunctions/navbar.js";
import {renderFooter} from "../../jsfunctions/footer.js";
import {renderPosts} from "../../jsfunctions/functions.js";

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

let parts = window.location.search.substring(1).split("&"), idUser = null, postContainer = document.getElementById("postsContainer");
for (let i = 0; i < parts.length && idUser == null; i++) {
    var temp = parts[i].split("=");
    if(temp[0] == 'ID') idUser = temp[1];
}
console.log(idUser);
document.addEventListener("DOMContentLoaded", () => {
    renderFooter();
    renderNavbar();
    getUserInfo(idUser).then(data => {
        console.log("DATI: "+data);
        data = JSON.parse(data);
        console.log(data); 
        stampaDatiUtenti(data['datiUtente']);
        renderPosts(data['posts'], document.getElementById("postsContainer"));
    });
});

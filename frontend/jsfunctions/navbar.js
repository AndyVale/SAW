export {renderNavbar, renderBottoniNavbar};
import {getSnippet, renderSnippet} from "./functions.js";
import {showLogin} from "./login.js";
import {showRegistration} from "./registration.js";

/**
 * Funzione che renderizza i bottoni della navbar in base alla presenza o meno di dati utente nel localStorage, a patto che non
 * siano passate più di 12 ore dall'ultimo aggiornamento dei dati.
 */
function renderBottoniNavbar(){
    console.log("renderBottoniNavbar()");
    let bottoniNavbarContainer = document.getElementById("contenitoreBottoniNavbar");
    let bottoniNavbarContainerSmall = document.getElementById("contenitoreBottoniNavbarSmall");
    bottoniNavbarContainer.innerHTML = "";
    bottoniNavbarContainerSmall.innerHTML = "";

    if(localStorage.getItem("email") != null && localStorage.getItem("firstname") != null && localStorage.getItem("lastname") != null && (new Date().getTime() - localStorage.getItem("lastUpdate")) < 1000*60*60*12){
        bottoniNavbarContainer.insertAdjacentHTML("beforeend", "<button type='button' class='btn btn-outline-dark me-2' style='border-radius: 20px; height: 59px; padding: 16px;' id='bottoneLogout'> Logout </button>");
        bottoniNavbarContainer.insertAdjacentHTML("beforeend", "<button type='button' class='btn btn-outline-dark'style='border-radius: 20px; height: 59px; padding: 16px;' id='bottoneVisualizzaProfilo'>"+localStorage.getItem("firstname")+"</a>");
        bottoniNavbarContainerSmall.insertAdjacentHTML("beforeend", "<button type='button' class='w-100 btn btn-outline-dark me-2' style='border:0px; height: 59px; padding: 16px;' id='bottoneLogoutPiccolo'>Logout</button>");
        bottoniNavbarContainerSmall.insertAdjacentHTML("beforeend", "<button type='button' class='w-100 btn btn-outline-dark me-2' style='border:0px; height: 59px; padding: 16px;' class='w-100 btn' id='bottoneVisualizzaProfiloPiccolo'>"+localStorage.getItem("firstname")+"</a>");
    }else{
        bottoniNavbarContainer.insertAdjacentHTML("beforeend", "<button type='button' class='btn btn-outline-dark me-2' style='border-radius: 20px; height: 59px; padding: 16px;' id='bottoneLogin'> Login </button>");
        bottoniNavbarContainer.insertAdjacentHTML("beforeend", "<button type='button' class='btn btn-outline-dark' style='border-radius: 20px; height: 59px; padding: 16px;' id='bottoneRegistration'> Registrati </button>");    
        bottoniNavbarContainerSmall.insertAdjacentHTML("beforeend", "<button type='button' class='w-100 btn btn-outline-dark me-2' style='border:0px; height: 59px; padding: 16px;' id='bottoneLoginPiccolo'>Login</button>");
        bottoniNavbarContainerSmall.insertAdjacentHTML("beforeend", "<button type='button' class='w-100 btn btn-outline-dark me-2' style='border:0px; height: 59px; padding: 16px;' id='bottoneRegistrationPiccolo'>Registrati</button>");    
    }
}

/**
 * Funzione che renderizza la navbar nel div con id "navbarContainer" e poi renderizza i bottoni della navbar
 */
function renderNavbar(){
    let navbarContainer = document.getElementById("navbarContainer");
    getSnippet("../../snippets_html/snippetNavbar.html").then((snippet) => renderSnippet(snippet, navbarContainer)).then((e)=>renderBottoniNavbar());
}

/**
 * Funzione che effettua il logout dell'utente, inviando una richiesta al server e rimuovendo i dati utente dal localStorage
 */
function logout(){
    fetch("../../../backend/script/logout.php").then((response) => {
      if(response.ok){
        return response.json();
      }else{
        throw new Error("Errore nella richiesta a logout.php");
      }
    }).then((res) => {
      if(res['result'] == "OK"){
        localStorage.clear();
        window.location.href = "./"+window.location.search;
      }
      else{
        console.log("Errore nella richiesta a logout.php");
      }
    }).catch((error) => {
      console.log(error);
    });
}

function gestioneClickBottoni(event){
    console.log("gestioneClickBottoni()");
    console.log(event.target.id);
    switch(event.target.id){
        case "bottoneLogin":
            showLogin();
            break;
        case "bottoneLoginPiccolo":
            showLogin();
            break;
        case "bottoneRegistration":
            showRegistration();
            break;
        case "bottoneRegistrationPiccolo":
            showRegistration();
            break;
        case "bottoneLogout":
            logout();
            break;
        case "bottoneLogoutPiccolo":
            logout();
            break;
        case "bottoneVisualizzaProfilo":
            showProfile();
            break;
        case "bottoneVisualizzaProfiloPiccolo":
            showProfile();
            break;
        default:
            break;
    }
}

function showProfile(){
    console.log("showProfile()");
    window.location.href = "../show_profile/";
}

/**
 * Funzione che stampa i risultati della ricerca
 * @param {Array} data Array di oggetti conententi i dati degli utenti
 * @param {*} where Posizione in cui stampare i risultati
 */
function displaySearchResult(data, where){ 
    let n = data.length;
    for(let i=0; i < n; i++){
        console.log(i);
        where.insertAdjacentHTML("beforeend",
        `<div class="user" id="usersearch-${data[i].id}">
            <img class="rounded-circle img-thumbnail img-fluid" src="../../immagini/profile/${data[i].profilePicture}" alt="../immagini/profile/${data[i].profilePicture}" width ='50px'">
            <div class="user-info">
                <div class="searchvisiblename">${data[i].firstname} ${data[i].lastname}</div>
                <p class="searchvisibleusername"> @${data[i].username}</p>
            </div>
        </div>`);
    }
    if(n>0){
        document.getElementById(`usersearch-${data[n-1].id}`).classList.remove("user");
        document.getElementById(`usersearch-${data[n-1].id}`).classList.add("userlast");
    }
}
    

/**
 * Funzione che cerca gli utenti nel database tramite fetch, se la stringa è vuota ritorna un array vuoto, non
 * effettua chiamata al server se userName è vuota.
 * @param {String} userName Stringa da inviare al server (non deve essere per forza un username)
 * @returns {Promise} Restituisce una promise che contiene un array di oggetti con i dati degli utenti
 */
async function search_user(userName){
    userName = userName.trim();
    if(userName != ""){ // Se la stringa non è vuota
        return fetch('../../../backend/script/search_engine.php?search='+userName)
        .then(result => result.json())
        .catch(error => console.log(error));
    }
    //altrimenti ritorna un array vuoto, e di questo fuori da search_user() ce ne si accorge nemmeno
    return [];
}

function gestisciInputSearchEngine(event){
    console.log("gestisciInputSearchEngine()");
    event.preventDefault();
    if(event.target.id == "searchUser"){
        let users = document.getElementById('users');
        users.innerHTML="";
        search_user(event.target.value).then(data => displaySearchResult(data, document.getElementById('users')));
    }
    if(event.target.id=="searchUserPiccolo"){
        let usersSmall = document.getElementById('usersPiccolo');
        usersSmall.innerHTML="";
        search_user(event.target.value).then(data => displaySearchResult(data, document.getElementById('usersPiccolo')));
    }
}


function gestisciClickSearchEngine(event) {
    console.log("gestisciClickSearchEngine()");

    const userElement = event.target.closest(".user, .userlast");

    if (userElement) {
        const userId = userElement.id.split("-")[1];
        const profileUrl = `../user/?ID=${userId}`;
        window.location.href = profileUrl;
    }
}


navbarContainer.addEventListener("click", (e)=>gestioneClickBottoni(e));
navbarContainer.addEventListener("input", (e)=>gestisciInputSearchEngine(e));
navbarContainer.addEventListener("click", (e)=>gestisciClickSearchEngine(e));
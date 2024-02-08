export {renderNavbar, renderBottoniNavbar};
import {getSnippet, renderSnippet} from "./functions.js";
import {showLogin} from "./login.js";
import {showRegistration} from "./registration.js";

function renderBottoniNavbar(){
    console.log("renderBottoniNavbar()");
    let bottoniNavbarContainer = document.getElementById("contenitoreBottoniNavbar");
    let bottoniNavbarContainerSmall = document.getElementById("contenitoreBottoniNavbarSmall");
    bottoniNavbarContainer.innerHTML = "";
    bottoniNavbarContainerSmall.innerHTML = "";

    if(localStorage.getItem("email") != null && localStorage.getItem("firstname") != null && localStorage.getItem("lastname") != null){
        bottoniNavbarContainer.insertAdjacentHTML("beforeend", "<button type='button' class='btn btn-outline-dark me-2' style='border-radius: 20px; height: 59px; padding: 20px;' id='bottoneLogout'> Logout </button>");
        bottoniNavbarContainer.insertAdjacentHTML("beforeend", "<button type='button' class='btn btn-outline-dark'style='border-radius: 20px; height: 59px; padding: 16px;' id='bottoneVisualizzaProfilo'>"+localStorage.getItem("firstname")+"</span>");
        bottoniNavbarContainerSmall.insertAdjacentHTML("beforeend", "<a href='#' id='bottoneLogoutPiccolo'>Logout</a>");
        bottoniNavbarContainerSmall.insertAdjacentHTML("beforeend", "<a href='#' id='bottoneVisualizzaProfiloPiccolo'>"+localStorage.getItem("firstname")+"</a>");
    }else{
        bottoniNavbarContainer.insertAdjacentHTML("beforeend", "<button type='button' class='btn btn-outline-dark me-2' style='border-radius: 20px; height: 59px; padding: 16px;' id='bottoneLogin'> Login </button>");
        bottoniNavbarContainer.insertAdjacentHTML("beforeend", "<button type='button' class='btn btn-outline-dark' style='border-radius: 20px; height: 59px; padding: 16px;' id='bottoneRegistration'> Registrati </button>");    
        bottoniNavbarContainerSmall.insertAdjacentHTML("beforeend", "<a href='#' id='bottoneLoginPiccolo'>Login</a>");
        bottoniNavbarContainerSmall.insertAdjacentHTML("beforeend", "<a href='#' id='bottoneRegistrationPiccolo'>Registrati</a>");    
      }
}

function renderNavbar(){
    getSnippet("../../snippets_html/snippetNavbar.html").then((snippet) => renderSnippet(snippet, navbarContainer)).then(() => renderBottoniNavbar());
}

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


navbarContainer.addEventListener("click", (e)=>gestioneClickBottoni(e));
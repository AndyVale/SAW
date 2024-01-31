export {renderNavbar, renderBottoniNavbar};
import {getSnippet, renderSnippet} from "./functions.js";
import {showLogin} from "./login.js";
import {showRegistration} from "./registration.js";


function renderBottoniNavbar(){
    console.log("renderBottoniNavbar()");
    let bottoniNavbarContainer = document.getElementById("contenitoreBottoniNavbar");
    bottoniNavbarContainer.innerHTML = "";

    if(sessionStorage.getItem("email") != null && sessionStorage.getItem("firstname") != null && sessionStorage.getItem("lastname") != null){
        bottoniNavbarContainer.insertAdjacentHTML("beforeend", "<button type='button' class='btn btn-outline-dark' style='border-radius: 35px;' id='bottoneLogout'> Logout </button>");
        bottoniNavbarContainer.insertAdjacentHTML("beforeend", "<button type='button' class='btn btn-outline-dark'style='border-radius: 35px;' id='bottoneVisualizzaProfilo'>"+sessionStorage.getItem("firstname")+"</span>");
    }else{
        bottoniNavbarContainer.insertAdjacentHTML("beforeend", "<button type='button' class='btn btn-outline-dark' style='border-radius: 35px;' id='bottoneLogin'> Login </button>");
        bottoniNavbarContainer.insertAdjacentHTML("beforeend", "<button type='button' class='btn btn-outline-dark' style='border-radius: 35px;' id='bottoneRegistration'> Registrati </button>");    
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
        throw new Error("Errore nella richiesta AJAX");
      }
    }).then((res) => {
      if(res['result'] == "OK"){
        sessionStorage.clear();
        window.location.href = "./";
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
        case "bottoneRegistration":
            showRegistration();
            break;
        case "bottoneLogout":
            logout();
            break;
        case "bottoneVisualizzaProfilo":
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
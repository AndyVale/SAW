import {getSnippet, renderSnippet, dbErrorReport, storeUserData, removeUserData} from "./functions.js";
export {showLogin, cookieLogin};

//NOTA PER I POSTERI: i "@param" servono solo per l'IDE, non impongono in nessun modo il tipo dei parametri (JS non è tipato)

/**
 * @param {Boolean} boolWrongCredential - boolWrongCredential specifica se le credenziali sono sicuramente errate
 */
function credentialsAreWrongReport(boolWrongCredential){
    let email = document.getElementById("loginEmail"), password = document.getElementById("loginPassword"), submitButton = document.getElementById("loginSubmitButton"), loginFeedback = document.getElementById("loginFeedback");
    if(boolWrongCredential){
        email.classList.add("is-invalid");
        password.classList.add("is-invalid");
        email.setAttribute("aria-invalid", "true");
        password.setAttribute("aria-invalid", "true");
        email.setAttribute("aria-describedby", "loginFeedback");
        password.setAttribute("aria-describedby", "loginFeedback");
        submitButton.disabled = true;
        loginFeedback.textContent="Credenziali errate, riprovare.";
    }else{
        email.classList.remove("is-invalid");
        password.classList.remove("is-invalid");
        email.setAttribute("aria-invalid", "false");
        password.setAttribute("aria-invalid", "false");
        email.removeAttribute("aria-describedby");
        password.removeAttribute("aria-describedby");
        submitButton.disabled = false;
        loginFeedback.textContent="";
    }
}

function cookieLogin(){
    console.log("cookieLogin()");
    if(document.cookie.includes("PHPSESSID")) return new Promise((resolve, reject) => resolve({result: "KO"}));//se c'è il cookie PHPSESSID vuol dire che l'utente ha già interagito con il server
    return fetch("../../../backend/script/cookie_login.php").then((response) => {
        if(response.ok){
            return response.json();
        }else{
            throw new Error("Errore nella richiesta a cookie_login.php");
        }
    }).then((res) => {
        if(res['result'] == "OK"){
        storeUserData(res['data']);
        //window.location.href = "./"+window.location.search;
        }else{
            removeUserData();
        }
    }) 
    .catch((error) => {
        console.log(error);
    });
}

/**
 * Funzione che mostra il form di login renderizzandolo nel loginFormContainer, per funzionare richiede il file "functions.js" e lo stile css "cssform.css"
 */
function showLogin(){
    document.getElementById("registrationFormContainer").style.display = "none";
    document.querySelectorAll("body *:not(#loginFormContainer, #loginFormContainer *)").forEach((node)=>node.style.filter="blur(5px)");//TODO: non mi piace molto questa metodologia ma non ho trovato di meglio, se qualcuno ha idee migliori sono ben accette...
    if(loginFormContainer.firstChild == null){
        console.log("showLogin():login fetch");
        getSnippet("../../snippets_html/snippetLogin.html").then((snippet) => renderSnippet(snippet, loginFormContainer));
    }
    loginFormContainer.style.display = "block";
}

function gestoreEventiClickLogin(e){
    console.log("gestoreEventiClickLogin");
    if(e.target.id=="bottoneChiusuraLogin"){//non voglio dover rifare il fetch ogni volta che chiudo il form
        document.querySelectorAll("body *:not(#loginFormContainer, #loginFormContainer *)").forEach((node)=>node.style.filter="");//TODO: non mi piace molto questa metodologia ma non ho trovato di meglio, se qualcuno ha idee migliori sono ben accette...
        loginFormContainer.style.display = "none";
    }
}

function gestoreEventiSubmitLogin(e){
    e.preventDefault();
    console.log("gestoreEventiSubmitLogin");
    let dataContainer = document.getElementById("loginForm"),
        loginContainer = document.getElementById("loginContainer"),
        dati = new FormData(dataContainer);//associo i dati del form a quelli da inviare con la fetch
        
        console.clear();
        console.log(dataContainer)   ;
        console.log(dati);
        fetch("../../../backend/script/login.php",
        {
            method: "POST",//potrebbe essere GET(?)
            body: dati
        }).then(function(response){
            if(response.ok){
                return response.json();
            }else{
                console.log(response);
                throw new Error("Errore nella richiesta a login.php");
            }
        }).then(function(res){
            console.log(res);
            if(res['result']=="OK"){
                storeUserData(res['data']);
                window.location.href = "./"+window.location.search;
            }else{//TODO: gestire i vari casi di errore
                switch(res["message"]){
                    case "WRONG_CREDENTIALS":
                        credentialsAreWrongReport(true);
                        break;
                    case "DB_ERROR":
                        dbErrorReport(loginContainer);
                        break;
                    default:
                        alert("You did play with the code, didn't you?");
                        break;
                }
            }    
        }).catch(function(error){
            console.log(error);
            dbErrorReport(loginContainer);
        });
   // }
}

function gestoreEventiInputLogin(e){
    console.log("gestoreEventiInputLogin");
    if(e.target === loginEmail || e.target === loginPassword){
        credentialsAreWrongReport(false);
    }
}

var loginFormContainer = document.getElementById("loginFormContainer");

loginFormContainer.addEventListener("click", (e)=>gestoreEventiClickLogin(e));
loginFormContainer.addEventListener("submit", (e)=>gestoreEventiSubmitLogin(e));
loginFormContainer.addEventListener("input", (e)=>gestoreEventiInputLogin(e));

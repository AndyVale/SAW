import {getSnippet, renderSnippet, dbErrorReport, storeUserData, removeUserData} from "./functions.js";
export {showLogin, cookieLogin};

//NOTA PER I POSTERI: i "@param" servono solo per l'IDE, non impongono in nessun modo il tipo dei parametri (JS non è tipato)

/**
 * @param {Boolean} boolWrongCredential - boolWrongCredential specifica se le credenziali sono sicuramente errate
 */
function credentialsAreWrongReport(boolWrongCredential){
    console.log("credentialsAreWrongReport() " +boolWrongCredential);
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

/**
 * Funzione che controlla se l'utente è già loggato mediante cookie, in caso positivo aggiorna l'ultimo accesso e i dati dell'utente.
 * Se l'utente ha già interagito con il server (ha il cookie PHPSESSID), si limita a aggiornare l'ultimo accesso ma non rieffettua
 * chiamate al server.
 * @returns {Promise} - ritorna una promessa che si risolve quando il cookie è stato controllato
 */
async function cookieLogin(){
    console.log("cookieLogin()");
    if(document.cookie.includes("PHPSESSID")){
        if(localStorage.getItem("lastUpdate"))
            localStorage.setItem("lastUpdate", Date.now());
        return;
    }//se c'è il cookie PHPSESSID vuol dire che l'utente ha già interagito con il server

    return fetch("../../../backend/script/cookie_login.php").then((response) => {
        if(response.ok){
            return response.json();
        }else{
            throw new Error("Errore nella richiesta a cookie_login.php");
        }
    }).then((res) => {
        //alert("cookieLogin():"+res);
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

/**
 * Funzione che gestisce l'evento di click sul form di login, chiudendolo se si clicca sul bottone di chiusura.
 * La chiusura del form, che è semplicemente un cambio dell'attributo display, comporta anche la rimozione del filtro di sfocatura dal resto della pagina.
 * @param {Event} e - evento di click
 */
function gestoreEventiClickLogin(e){
    console.log("gestoreEventiClickLogin");
    if(e.target.id=="bottoneChiusuraLogin"){//non voglio dover rifare il fetch ogni volta che chiudo il form
        document.querySelectorAll("body *:not(#loginFormContainer, #loginFormContainer *)").forEach((node)=>node.style.filter="");//TODO: non mi piace molto questa metodologia ma non ho trovato di meglio, se qualcuno ha idee migliori sono ben accette...
        loginFormContainer.style.display = "none";
    }
}

/**
 * Funzione che gestisce l'evento di submit del form di login, inviando i dati al server e gestendo la risposta.
 * @param {Event} e - evento di submit del form di login
 */
function gestoreEventiSubmitLogin(e){
    e.preventDefault();
    console.log("gestoreEventiSubmitLogin");
    let dataContainer = document.getElementById("loginForm"),
        loginContainer = document.getElementById("loginContainer"),
        dati = new FormData(dataContainer);//associo i dati del form a quelli da inviare con la fetch
        
        fetch("../../../backend/script/login.php",
        {
            method: "POST",//potrebbe essere GET(?)
            body: dati
        }).then((response)=>{
            switch(response.status){
                case 200:
                    return response.json();
                case 401:
                case 400:
                    credentialsAreWrongReport(true);
                    return response.json();
                default:
                    throw new Error("Errore nella richiesta a login.php");
            }
        }).then((res)=>{
            console.log(res);
            if(res['result']=="OK"){
                storeUserData(res['data']);
                window.location.href = "./"+window.location.search;
            }else{//TODO: gestire i vari casi di errore
                switch(res["message"]){
                    case "WRONG_CREDENTIALS":
                    case "MISSING_FIELDS":
                        //credentialsAreWrongReport(true);
                        break;
                    case "DB_ERROR":
                        dbErrorReport(loginContainer);
                        break;
                    default:
                        alert("Errore sconosciuto...scusa :(");
                        break;
                }
            }    
        }).catch((error)=>{
            console.log(error);
            dbErrorReport(loginContainer);
        });
   // }
}

/**
 * Funzione che gestisce l'evento di input dei campi del form di login, rimuovendo eventuali segnalazioni di errore.
 * @param {Event} e - evento di input
 */
function gestoreEventiInputLogin(e){
    console.log("gestoreEventiInputLogin");
    let loginEmail = document.getElementById("loginEmail"), loginPassword = document.getElementById("loginPassword");
    if(e.target === loginEmail || e.target === loginPassword){
        credentialsAreWrongReport(false);
    }
}

var loginFormContainer = document.getElementById("loginFormContainer");

loginFormContainer.addEventListener("click", (e)=>gestoreEventiClickLogin(e));
loginFormContainer.addEventListener("submit", (e)=>gestoreEventiSubmitLogin(e));
loginFormContainer.addEventListener("input", (e)=>gestoreEventiInputLogin(e));

import {getSnippet, renderSnippet, dbErrorReport} from "./functions.js";
export {showRegistration};
/**
 * @param {Boolean} areValids - areValids specifica se le password sono uguali o no
 */
function passwordsAreValidsReport(areValids){
    let password = document.getElementById("password");
    let confirm = document.getElementById("confirm");

    if(areValids){
        password.classList.remove("is-invalid");
        confirm.classList.remove("is-invalid");
        confirmFeedback.textContent="Conferma la tua password";
        password.setAttribute("aria-invalid", "false");
        confirm.setAttribute("aria-invalid", "false");
    }else{
        password.classList.add("is-invalid");
        confirm.classList.add("is-invalid");
        confirmFeedback.textContent="Le password non coincidono";
        password.setAttribute("aria-invalid", "true");
        confirm.setAttribute("aria-invalid", "true");
    }
}

/**
 * @param {Boolean} possiblyUnique - possiblyUnique specifica se la mail può essere univoca o no. Il valore falso indica che la mail è sicuramente in uso
 */
function emailIsUniqueReport(possiblyUnique){
    let email = document.getElementById("email");
    if(possiblyUnique){
        email.classList.remove("is-invalid");
        emailFeedback.textContent="Inserisci la tua email";
        email.setAttribute("aria-invalid", "false");
    }else{
        email.classList.add("is-invalid");
        emailFeedback.textContent="Email già in uso";
        email.setAttribute("aria-invalid", "true");
    }
}

function gestoreEventiClickRegistration(e){
    if(e.target.id == "bottoneChiusuraRegistration"){
        registrationFormContainer.style.display = "none";
    }
}

function gestoreEventiSubmitRegistration(e){
    let password = document.getElementById("password"),
        confirm = document.getElementById("confirm"),
        dataContainer = document.getElementById("registrationForm"),
        registrationContainer = document.getElementById("registrationContainer");

    e.preventDefault();

    if(password.value!=confirm.value){
        passwordsAreValidsReport(false);
        return;
    }

    let dati = new FormData(dataContainer);//associo i dati del form a quelli da inviare con la fetch
    fetch("../../../backend/script/registration.php",
    {
        method: "POST",//POST Corretto
        body: dati
    }).then(function(response){
        if(response.ok){
            return response.json();
        }else{
            console.log(response);
            throw new Error("Errore nella richiesta AJAX");
        }
    }).then(function(json){
        if(json["result"]=="OK"){
            alert("Registrazione avvenuta con successo");
        }
        else{
            //alert(json["message"]);
            switch(json["message"]){
                case "EMAIL_ALREADY_EXISTS":
                    emailIsUniqueReport(false);
                    break;
                case "DB_ERROR":
                    dbErrorReport(registrationContainer);
                    break;
                default:
                    alert("You did play with the code, didn't you?");
                    break;
            }
        }
    }).catch(function(error){
        dbErrorReport(registrationContainer);
    });
}

function gestoreEventiInputRegistration(e){
    let password = document.getElementById("password"), 
        confirm = document.getElementById("confirm");
    console.log("gestoreEventiInputRegistration");
    if(e.target.id === "email"){
        emailIsUniqueReport(true);
    }
    if(e.target.id === "password" || e.target.id === "confirm"){
        if(password.value!=confirm.value){
            passwordsAreValidsReport(false);
        }else{
            passwordsAreValidsReport(true);
        }
    }
}

/**
 * Funzione che mostra il form di registrazione renderizzandolo in registrationFormContainer, per funzionare richiede il file "functions.js" e lo stile css "cssform.css"
 */
function showRegistration(){
    loginFormContainer.style.display = "none";
    if(registrationFormContainer.firstChild == null){
        console.log("showRegistration():registration fetch");
        getSnippet("../../snippets_html/snippetRegistration.html").then((snippet) => renderSnippet(snippet, registrationFormContainer));
    }
    registrationFormContainer.style.display = "block";
}

var registrationFormContainer = document.getElementById("registrationFormContainer");

registrationFormContainer.addEventListener("click", gestoreEventiClickRegistration);
registrationFormContainer.addEventListener("submit", gestoreEventiSubmitRegistration);
registrationFormContainer.addEventListener("input", gestoreEventiInputRegistration);

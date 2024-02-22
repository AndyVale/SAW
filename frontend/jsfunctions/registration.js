import {getSnippet, renderSnippet, dbErrorReport, emailIsUniqueReport, passwordsAreValidsReport} from "./functions.js";
export {showRegistration};

function gestoreEventiClickRegistration(e){
    if(e.target.id == "bottoneChiusuraRegistration"){
        document.querySelectorAll("body *:not(#registrationFormContainer, #registrationFormContainer *)").forEach((node)=>node.style.filter="");//TODO: non mi piace molto questa metodologia ma non ho trovato di meglio, se qualcuno ha idee migliori sono ben accette...
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
            throw new Error("Errore nella richiesta a registration.php");
        }
    }).then(function(json){
        if(json["result"]=="OK"){
            alert("Registrazione avvenuta con successo");//TODO: gestire il caso di registrazione, ad esempio mostrando un messaggio di successo
            //window.location.href = "./"+window.location.search;
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
                    alert("Errore sconosciuto...scusa :(");
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
        if(password.value!=confirm.value){//TODO: aspettare che l'utente finisca di scrivere la password per segnalare l'errore
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
    document.querySelectorAll("body *:not(#registrationFormContainer, #registrationFormContainer *)").forEach((node)=>node.style.filter="blur(5px)");//TODO: non mi piace molto questa metodologia ma non ho trovato di meglio, se qualcuno ha idee migliori sono ben accette...
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

/**
 * @param {node} container - container specifica in che container inserire il messaggio di errore 
 */
function dbErrorReport(container){
    let title = document.createElement("p");
    let img = document.createElement("img");
    let p1 = document.createElement("p");
    //let p2 = document.createElement("p");

    img.setAttribute("src", "../immagini/serverError.jpg");
    img.setAttribute("alt", 
    "Immagine di due ragazzi a scuola seduti uno dietro l'altro. Su quello dietro c'è scritto 'Server' e su quello davanti 'Browser'. Il primo passa un bigliettino con scritto 'Internal Server Error' al secondo.");
    img.setAttribute("width", "60%");

    p1.setAttribute("class", "fs-6 my-0");
    p1.textContent = "Riprova più tardi ricaricando la pagina";
    //p2.setAttribute("class", "fs-6 my-0");
    //p2.textContent = "(o non farlo, tanto non funzionerà)";//da notare che la parentesi me l'ha suggerita copilot

    title.setAttribute("class", "h6 bg-danger text-white rounded p-1");
    title.textContent = "Impossibile comunicare con il server";
    container.removeChild(container.firstChild);
    let exitButton = container.firstChild;//TODO: migliorare sta roba poco carina
    //console.log(exitButton);
    while(container.firstChild){
        container.removeChild(container.firstChild);
    }
    container.appendChild(exitButton);
    container.appendChild(title);
    container.appendChild(img);
    container.appendChild(p1);
    //container.appendChild(p2);
}

/**
 * @param {Boolean} areValids - areValids specifica se le password sono uguali o no
 */
function passwordsAreValidsReport(areValids){
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

form = document.getElementById("form");
fieldSetForm = document.getElementById("fieldSetForm");
registrationContainer = document.getElementById("registrationContainer");

passwordFields = document.getElementById("passwordFields");
confirmFeedback = document.getElementById("confirmFeedback");
password = document.getElementById("password");
confirm = document.getElementById("confirm");

email = document.getElementById("email");
emailFeedback = document.getElementById("emailFeedback");

form.addEventListener("submit", function(event){
    event.preventDefault();
    if(password.value!=confirm.value){
        passwordsAreValidsReport(false);
        return;
    }

    passwordsAreValidsReport(true);

    dati = new FormData(this);//associo i dati del form a quelli da inviare con la fetch
    fetch("../php/registration.php",
    {
        method: "POST",
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
            window.location.href = "loginForm.html";
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

});

email.addEventListener("input", function(event){
    emailIsUniqueReport(true);
});

passwordFields.addEventListener("input", function(event){
    if(password.value!=confirm.value){
        passwordsAreValidsReport(false);
    }else{
        passwordsAreValidsReport(true);
    }
});

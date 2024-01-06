container = document.getElementById("loginContainer");
password=document.getElementById("password");
email = document.getElementById("email");
loginFeedback = document.getElementById("loginFeedback");
form = document.getElementById("form");
rememberMe = document.getElementById("rememberMeCheck");
submitButton = document.getElementById("submitButton");

//NOTA PER I POSTERI: i "@param" servono solo per l'IDE, non impongono in nessun modo il tipo dei parametri (JS non è tipato)

/**
 * @param {Boolean} boolWrongCredential - boolWrongCredential specifica se le credenziali sono sicuramente errate
 */
function credentialsAreWrongReport(boolWrongCredential){
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

form.addEventListener("submit", function(event){
    event.preventDefault();

    dati = new FormData(this);//associo i dati del form a quelli da inviare con la fetch
    fetch("../php/login.php",
    {
        method: "POST",
        body: dati
    }).then(function(response){
        if(response.ok){
            return response.text();
        }else{
            console.log(response);
            throw new Error("Errore nella richiesta AJAX");
        }
    }).then(function(text){
        alert(text);
        if(text=="OK"){
            window.location.href = "login.jpg";
        }else{
            credentialsAreWrongReport(true);
        }    
    }).catch(function(error){
        console.log(error);
    });

});

form.addEventListener("input", function(event){//TODO: Rimuovere il checkbox dalla roba
    if(event.target === email || event.target === password){
        credentialsAreWrongReport(false);
    }
});

//---------------------------------------QUESTO FILE RICHIEDE IL FILE "functions.js" PER FUNZIONARE---------------------------------------//

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

function addLoginEvents(){
    container = document.getElementById("loginContainer");
    password=document.getElementById("password");
    email = document.getElementById("email");
    loginFeedback = document.getElementById("loginFeedback");
    form = document.getElementById("form");
    rememberMe = document.getElementById("rememberMeCheck");
    submitButton = document.getElementById("submitButton");
    closeButton = document.getElementById("closeButton");
    form.addEventListener("submit", function(event){
        event.preventDefault();

        dati = new FormData(this);//associo i dati del form a quelli da inviare con la fetch
        fetch("../../../backend/script/login.php",
        {
            method: "POST",//potrebbe essere GET(?)
            body: dati
        }).then(function(response){
            if(response.ok){
                return response.json();
            }else{
                console.log(response);
                throw new Error("Errore nella richiesta AJAX");
            }
        }).then(function(res){
            console.log(res);
            if(res['result']=="OK"){
                successfulLogin(res['data']);
                //window.location.href = "../immagini/login.jpg";
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

    closeButton.addEventListener("click", function(event){
        document.getElementById("form").parentNode.removeChild(document.getElementById("form"));
    });
}

function successfulLogin(dati){
    let contenitoreBottoni = document.getElementById("contenitoreBottoni");
    let bottoneLogout = document.getElementById("bottoneLogout");
    let bottoneModificaProfilo = document.getElementById("bottoneModificaProfilo");
    
    localStorage.setItem("email", dati.email);
    localStorage.setItem("firstname", dati.firstname);
    localStorage.setItem("lastname", dati.lastname);

    removeNodeById("form");//controlla già che non sia null

    while(contenitoreBottoni.firstChild){//rimuovo tutti i figli del contenitore
        contenitoreBottoni.removeChild(contenitoreBottoni.firstChild);
    }
    
    contenitoreBottoni.insertAdjacentHTML("beforeend", "<button type='button' class='btn btn-outline-dark' style='border-radius: 35px;' id='bottoneLogout'> Logout </button>");
    contenitoreBottoni.insertAdjacentHTML("beforeend", "<button type='button' class='btn btn-outline-dark'style='border-radius: 35px;' id='bottoneModificaProfilo'>"+dati['firstname']+"</span>");
}

/**
 * Funzione che mostra il form di login in sovraimpressione nella pagina, per funzionare richiede il file "functions.js" e lo stile css "cssform.css"
 */
function showLogin(){
    let container = document.querySelector("body");
    removeNodeById("form");
    //if(localStorage.getItem("login") != null){
    //    console.log("showLogin():login in cache");
    //    renderSnippet(localStorage.getItem("login"), container, addLoginEvents);
    //}
    //else{
        console.log("showLogin():login fetch");
        getSnippet("../../snippets_html/snippetLogin.html").then((snippet) => renderSnippet(snippet, container, addLoginEvents));
    //}
}


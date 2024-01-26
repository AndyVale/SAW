//---------------------------------------QUESTO FILE RICHIEDE IL FILE "functions.js" PER FUNZIONARE---------------------------------------//

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



/**
 * Funzione che mostra il form di login renderizzandolo nel loginFormContainer, per funzionare richiede il file "functions.js" e lo stile css "cssform.css"
 */
function showLogin(){
    registrationFormContainer.style.display = "none";
    if(loginFormContainer.firstChild == null){
        console.log("showLogin():login fetch");
        getSnippet("../../snippets_html/snippetLogin.html").then((snippet) => renderSnippet(snippet, loginFormContainer));
    }
    loginFormContainer.style.display = "block";
}

function gestoreEventiClickLogin(e){
    console.log("gestoreEventiClickLogin");
    if(e.target.id=="bottoneChiusuraLogin"){//non voglio dover rifare il fetch ogni volta che chiudo il form
        loginFormContainer.style.display = "none";
    }
}

function gestoreEventiSubmitLogin(e){
    e.preventDefault();
    console.log("gestoreEventiSubmitLogin");
    let dataContainer = document.getElementById("loginForm");
    //if(e.target.id=="submitButton"){
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
                throw new Error("Errore nella richiesta AJAX");
            }
        }).then(function(res){
            console.log(res);
            if(res['result']=="OK"){
                storeUserData(res['data']);
                renderBottoniNavbar("loginForm");
                loginFormContainer.style.display = "none";
            }else{//TODO: gestire i vari casi di errore
                credentialsAreWrongReport(true);
            }    
        }).catch(function(error){
            console.log(error);
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

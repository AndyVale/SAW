import {storeUserData, removeUserData, stampaDatiUtenti, emailIsUniqueReport, passwordsAreValidsReport} from '../../jsfunctions/functions.js';
import {renderNavbar} from '../../jsfunctions/navbar.js';
import {renderFooter} from '../../jsfunctions/footer.js';
import {cookieLogin} from "../../jsfunctions/login.js";

function stampaDatiForm(datiUtente) {
  if ('firstname' in datiUtente && 'lastname' in datiUtente && 'email' in datiUtente && 'username' in datiUtente) {
    let Nome  = document.getElementById('firstname'),
    Cognome = document.getElementById('lastname'),
    EmailInput = document.getElementById('email'),
    usernameInput = document.getElementById('username');

    if (Nome && Cognome && EmailInput && usernameInput) {
      Nome.value = datiUtente.firstname;
      Cognome.value = datiUtente.lastname;
      usernameInput.value = datiUtente.username;
      EmailInput.value = datiUtente.email;
    }
    else {
      console.error("Uno o più elementi HTML non sono stati trovati.");
    }
 } else {
  console.error("I dati ricevuti non sono nel formato atteso.");
}
}

document.addEventListener('DOMContentLoaded', function() {
    renderFooter();
    cookieLogin().then(()=>{
      renderNavbar();
      fetch('../../../backend/script/show_profile.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      //verifica che non siano necessari altri controlli più specifici
      .then(response => {
        if(response.status == 401){
          window.location.href = "../homepage";
          return;
        }
        if (!response.ok) {
          throw new Error('Errore nella richiesta.');
        }
        return response.json();
      })
      .then(data => {
        if(data['result'] == "OK"){
          stampaDatiUtenti(data['data']);
          stampaDatiForm(data['data']);
        }else{
          switch(data['message']){
            case "ERROR_NOTLOGGED":
              //removeUserData(); Delegato alla homePage
              //showLogin(); potrei mostrare il login ma sarebbe più complicato da gestire a livello di sicurezza direi
              window.location.href = "../homepage";
              break;
            case "DB_ERROR":
              alert("Errore nel database");
              break;
            case "ERROR_SHOW":
              alert("Errore nel mostrare i dati dell'utente");
              break; 
          }
        }
       })
       .catch(error => {
       console.error('Errore:', error);
       console.log('Nome dell\'errore:', error.name);
       console.log('Messaggio dell\'errore:', error.message);
       console.log('Stack dell\'errore:', error.stack);
       });
    });
});

var UpdateForm = document.getElementById("update_form");
UpdateForm.addEventListener("submit", function(e) {
  e.preventDefault();
  let dati = new FormData(this);
  console.log(dati);
  fetch('../../../backend/script/update_profile.php', {
    method: 'POST',
    body: dati
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if (data['result'] == "OK") {
        //console.log(data['data']);
        //non può fare cross-site scripting perchè i dati vengono salvati solo in questo caso in locale. Su un altro dispositivo vengono presi dal database (dove sono sanificati).
        console.log({"firstanem":dati.get('firstname'), 'lastname':dati.get('lastname'),'email': dati.get('email')});
        storeUserData({"firstname":dati.get('firstname'), 'lastname':dati.get('lastname'),'email': dati.get('email'), 'username': dati.get('username')});
        //alert("Profilo aggiornato con successo!");
        window.location.href = "../show_profile/index.html";
    } else {
      switch(data['message']){
        case "ERROR_NOTLOGGED":
          //removeUserData(); Delegato alla homePage
          window.location.href = "../../homepage/index.html";
          break;
        case "DUPLICATE_EMAIL":
          //alert("Email già in uso");
          emailIsUniqueReport(false);
          break; 
        case "ERROR_MISSINGFIELDS":
          alert("Ci sono dei campi vuoti!");//non dovrebbe mai succedere se l'utente non gioca con il codice
          window.location.href = "./index.html";
          break;
        case "ERROR_WRONGEMAILFORMAT":
          alert("L'email non è nel formato corretto!");//non dovrebbe mai succedere se l'utente non gioca con il codice
          window.location.href = "./index.html";
          break;
        case "ERROR_WRONGIMAGEFORMAT":
          alert("Sono accettati solo file con estensioni: .jpg, .jpeg, .png");
          window.location.href = "./index.html";
          break;
        case "DB_ERROR":
          alert("Errore nel database");
          break;
        case "ERROR_UPDATE":
          alert("Errore nell'aggiornare i dati dell'utente");
          break;       
      }
    }
  })
  .catch(error => {
    console.error('Errore:', error);
    console.log('Nome dell\'errore:', error.name);
    console.log('Messaggio dell\'errore:', error.message);
    console.log('Stack dell\'errore:', error.stack);
  });
});

var UpdatePassForm = document.getElementById("new_password_form");
UpdatePassForm.addEventListener("submit", function(e) {
e.preventDefault();
let dati = new FormData(this);
console.log(dati);
fetch('../../../backend/script/change_password.php', {
  method: 'POST',
  body: dati
})
.then(response => response.json())
.then(data => {
  if (data['result'] == "OK") {
      //alert("Password cambiata con successo!");//TODO:notificare l'utente con un messaggio di successo
      window.location.href = "../show_profile/index.html";
  } else {
    switch(data['message']){
      case "ERROR_NOTLOGGED":
        removeUserData();
        window.location.href = "../../homepage/index.html";
        break;
      case "DIFFERENT_PASSWORDS":
        alert("Le password inserite sono diverse.");
        passwordsAreValidsReport(false);
        break; 
      case "ERROR_MISSINGFIELDS":
        alert("Ci sono dei campi vuoti!");//non dovrebbe mai succedere se l'utente non gioca con il codice
        break;
      case "DB_ERROR":
        alert("Errore nella richiesta. Riprovare più tardi");
        break;
      case "ERROR_UPDATE":
        alert("Errore nell'aggiornare i dati. Riprovare più tardi");
        break;   
      case "WRONG_CREDENTIALS":
        document.getElementById('currentpass').classList.add("is-invalid");
        document.getElementById('currPasswordFeedback').textContent = "Password errata";
        break;       
    }
  }
})
.catch(error => {
  console.error('Errore:', error);
  console.log('Nome dell\'errore:', error.name);
  console.log('Messaggio dell\'errore:', error.message);
  console.log('Stack dell\'errore:', error.stack);
});
});

email.addEventListener("input", function(e) {
  emailIsUniqueReport(true);
});

document.getElementById("new_password_form").addEventListener("input", function(e) {
  let new_password = document.getElementById("password"),
      confirm_password = document.getElementById("confirm"),
      old_password = document.getElementById("currentpass");
  if (e.target.id === "password" || e.target.id === "confirm") {
    if (new_password.value != confirm_password.value) {
      passwordsAreValidsReport(false);
    } else {
      passwordsAreValidsReport(true);
    }
  }
  if(e.target.id === "currentpass"){
    old_password.classList.remove("is-invalid");
  }
});


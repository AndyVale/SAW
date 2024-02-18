import {renderNavbar} from "../../../jsfunctions/navbar.js";
import {renderFooter} from "../../../jsfunctions/footer.js";
import {removeUserData} from "../../../jsfunctions/functions.js";
//import{getUserData} from "../../show_profile/js/show_profile.js";

document.addEventListener('DOMContentLoaded', function() {
    // Effettua una richiesta API Fetch per ottenere i dati dell'utente
    //console.log("domcontentloaded");
    renderFooter();
    renderNavbar();
    //getUserData();
});


var UpdatePass = document.getElementById("new_password");
UpdatePass.addEventListener("submit", function(e) {
e.preventDefault();
let dati = new FormData(this);
console.log(dati);
fetch('../../../backend/script/change_password.php', {
  method: 'POST',
  body: dati
})
.then(response => response.json())
.then(data => {
  //console.log(data);
  //data = JSON.parse(data);
  if (data['result'] == "OK") {
      //console.log(data['data']);
      //non può fare cross-site scripting perchè i dati vengono salvati solo in questo caso in locale. Su un altro dispositivo vengono presi dal database (dove sono sanificati).
      //console.log({"firstanem":dati.get('firstname'), 'lastname':dati.get('lastname'),'email': dati.get('email')});
      //storeUserData({"firstname":dati.get('firstname'), 'lastname':dati.get('lastname'),'email': dati.get('email')});
      alert("Password cambiata con successo!");
      window.location.href = "../show_profile/index.html";
  } else {
    switch(data['message']){
      case "ERROR_NOTLOGGED":
        removeUserData();
        window.location.href = "../../homepage/index.html";
        break;
      case "DIFFERENT_PASSWORDS":
        alert("Le password inserite sono diverse.");
        break; 
      case "ERROR_MISSINGFIELDS":
        alert("Ci sono dei campi vuoti!");
        window.location.href = "./index.html";
        break;
      case "DB_ERROR":
        alert("Errore nella richiesta. Riprovare più tardi");
        break;
      case "ERROR_UPDATE":
        alert("Errore nell'aggiornare i dati. Riprovare più tardi");
        break;   
      case "WRONG_CREDENTIALS":
        alert("Si è verificato un errore.");
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

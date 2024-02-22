import {storeUserData, removeUserData, changeRatio} from '../../jsfunctions/functions.js';
import {renderNavbar} from '../../jsfunctions/navbar.js';
import {renderFooter} from '../../jsfunctions/footer.js';
import { cookieLogin } from "../../jsfunctions/login.js";


function stampaDati(datiUtente) {
  if ('firstname' in datiUtente && 'lastname' in datiUtente && 'email' in datiUtente && 'username' in datiUtente) {
    //console.log(datiUtente);
    let NomeCognome = document.getElementById('fullname'),
    Nome  = document.getElementById('firstname'),
    Cognome = document.getElementById('lastname'),
    Email = document.getElementById('email'),
    nPost = document.getElementById('nPost'),
    nFollower = document.getElementById('nFollowers'),
    nFollowing = document.getElementById('nFollowing'),
    immagineProfilo = document.getElementById('profile-image'),
    username = document.getElementById('username');

    if (NomeCognome && Nome && Cognome && Email && username && nPost && nFollower && nFollowing && immagineProfilo) {
      NomeCognome.textContent = datiUtente.firstname + " " + datiUtente.lastname;
      Nome.value = datiUtente.firstname;
      username.value = datiUtente.username;
      Cognome.value = datiUtente.lastname;
      Email.value = datiUtente.email;
      nPost.textContent = datiUtente.nPost;
      nFollower.textContent = datiUtente.nFollower;
      nFollowing.textContent = datiUtente.nFollowing;
      immagineProfilo.src = "../../immagini/profile/" + datiUtente.profilePicture;
      changeRatio(1, immagineProfilo);
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
          'Content-Type': 'application/json' // Specifica il tipo di contenuto come JSON se necessario
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
          stampaDati(data['data']);
        }else{
          switch(data['message']){
            case "ERROR_NOTLOGGED":
              //removeUserData(); Delegato alla homePage
              //alert("Non sei loggato!");
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
    // Effettua una richiesta API Fetch per ottenere i dati dell'utente
    
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
    //data = JSON.parse(data);
    if (data['result'] == "OK") {
        //console.log(data['data']);
        //non può fare cross-site scripting perchè i dati vengono salvati solo in questo caso in locale. Su un altro dispositivo vengono presi dal database (dove sono sanificati).
        console.log({"firstanem":dati.get('firstname'), 'lastname':dati.get('lastname'),'email': dati.get('email')});
        storeUserData({"firstname":dati.get('firstname'), 'lastname':dati.get('lastname'),'email': dati.get('email'), 'username': dati.get('username')});
        alert("Profilo aggiornato con successo!");
        window.location.href = "../show_profile/index.html";
    } else {
      switch(data['message']){
        case "ERROR_NOTLOGGED":
          //removeUserData(); Delegato alla homePage
          window.location.href = "../../homepage/index.html";
          break;
        case "DUPLICATE_EMAIL":
          alert("Email già in uso");
          //scrivere email già in uso è sbagliato perchè suggerisce a un hacker un'email valida? Meglio usare 'Impossibile usare questa email'?
          break; 
        case "ERROR_MISSINGFIELDS":
          alert("Ci sono dei campi vuoti!");
          window.location.href = "./index.html";
          break;
        case "ERROR_WRONGEMAILFORMAT":
          alert("L'email non è nel formato corretto!");
          window.location.href = "./index.html";
          break;
        case "ERROR_WRONGIMAGEFORMAT":
          alert("Sono accettati solo file con estensioni: .jpg, .jpeg, .png");
          window.location.href = "./index.html";
          break;
        case "DB_ERROR":
          alert("OHHHH cosa fai");
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
  //console.log(data);
  //data = JSON.parse(data);
  if (data['result'] == "OK") {
      //console.log(data['data']);
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



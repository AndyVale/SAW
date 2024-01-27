function stampaDati(datiUtente) {
  if ('firstname' in datiUtente && 'lastname' in datiUtente && 'email' in datiUtente) {
  console.log(datiUtente);
  let NomeCognome = document.getElementById('fullname');
  let Nome  = document.getElementById('firstname');
  let Cognome = document.getElementById('lastname');
  let Email = document.getElementById('email');
  let nPost = document.getElementById('nPost');
  let nFollower = document.getElementById('nFollowers');
  let nFollowing = document.getElementById('nFollowing');

  if (NomeCognome && Nome && Cognome && Email && nPost && nFollower && nFollowing) {
  NomeCognome.textContent = datiUtente.firstname + " " + datiUtente.lastname;
  Nome.value = datiUtente.firstname;
  Cognome.value = datiUtente.lastname;
  Email.value = datiUtente.email;
  nPost.textContent = datiUtente.nPost;
  nFollower.textContent = datiUtente.nFollower;
  nFollowing.textContent = datiUtente.nFollowing;
 } else {
  console.error("Uno o più elementi HTML non sono stati trovati.");
 }
 } else {
  console.error("I dati ricevuti non sono nel formato atteso.");
}
}

function AggiornaImmagine(){
  const newImage = document.getElementById('new_profile_image');
  const oldImage = document.getElementById('old_profile_picture');
  const file = input.files[0];
  if (file) {
    //creazione dell'istanza di un oggetto FileReader
    const reader = new FileReader();

    reader.onload = function (event) {
        var dataURL = event.target.result;
        oldImage.src = dataURL;
    };

    reader.readAsDataURL(file);
}
}

document.addEventListener('DOMContentLoaded', function() {
    // Effettua una richiesta API Fetch per ottenere i dati dell'utente
    fetch('../../../backend/script/show_profile.php', {
      method: 'GET', // Puoi cambiare questo a 'POST' se necessario
      headers: {
        'Content-Type': 'application/json' // Specifica il tipo di contenuto come JSON se necessario
      }
    })
    //verifica che non siano necessari altri controlli più specifici
    .then(response => {
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
            removeUserData();
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

var UpdateImage = document.getElementById("update_image_button");
UpdateImage.addEventListener("click", function() {
    alert("Hai provato ad aggiornare l'immagine!");
    AggiornaImmagine();
    //Da sistemare!
    //Essendo nel form viene eseguito anche lo script update_profile.php
});

var UpdateForm = document.getElementById("update_form");
UpdateForm.addEventListener("submit", function(e) {
e.preventDefault();
dati = new FormData(this);
console.log(dati);
fetch('../../../backend/script/update_profile.php', {
  method: 'POST',
  body: dati,
  //headers: {
  //  'Content-Type': 'application/json' // Specifica il tipo di contenuto come JSON se necessario
  //} 
})
.then(response => response.json())
.then(data => {
  console.log(data);
  //data = JSON.parse(data);
  if (data['result'] == "OK") {
      //console.log(data['data']);
      //non può fare cross-site scripting perchè i dati vengono salvati solo in questo caso in locale. Su un altro dispositivo vengono presi dal database (dove sono sanificati).
      console.log({"firstanem":dati.get('firstname'), 'lastname':dati.get('lastname'),'email': dati.get('email')});
      storeUserData({"firstname":dati.get('firstname'), 'lastname':dati.get('lastname'),'email': dati.get('email')});
      alert("Profilo aggiornato con successo!");
      window.location.href = "../show_profile/index.html";
  } else {
    switch(data['message']){
      case "ERROR_NOTLOGGED":
        removeUserData();
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


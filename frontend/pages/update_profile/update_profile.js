function stampaDati(datiUtente) {
  if ('firstname' in datiUtente && 'lastname' in datiUtente && 'email' in datiUtente) {
  console.log(datiUtente);
  let NomeCognome = document.getElementById('fullname');
  let Nome  = document.getElementById('firstname');
  let Cognome = document.getElementById('lastname');
  let Email = document.getElementById('email');

  if (NomeCognome && Nome && Cognome && Email) {
  NomeCognome.textContent = datiUtente.firstname + " " + datiUtente.lastname;
  Nome.value = datiUtente.firstname;
  Cognome.value = datiUtente.lastname;
  Email.value = datiUtente.email;
 } else {
  console.error("Uno o più elementi HTML non sono stati trovati.");
 }
 } else {
  console.error("I dati ricevuti non sono nel formato atteso.");
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
            alert("Non sei loggato");
            window.location.href = "../homepage";
            break;
          case "ERROR_DB":
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


fetch('../../../backend/script/update_profile.php', {
  method: 'POST',
  headers: {
      'Content-Type': 'application/json',
  },
})
.then(response => response.json())
.then(data => {
  if (data['result'] == "OK") {
      alert("Profilo aggiornato con successo!");
      window.location.href = "../show_profile/index.html";
  } else {
    switch(data['message']){
      case "ERROR_NOTLOGGED":
        alert("Non sei loggato");
        window.location.href = "../homepage";
        break;
      /*
      case "ERROR_NOTALLFIELDS":
        alert("Ci sono dei campi vuoti oppure niente è stato modificato");
        window.location.href = "../update_profile/index.html";
        break;
      */
      case "ERROR_DB":
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
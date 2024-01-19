function stampaDatiUtenti(datiUtente) {
    console.log(datiUtente);
    let nomeCognome = document.getElementById("fullname");

    nomeCognome.textContent = datiUtente.lastname + " " + datiUtente.firstname;
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
        //potrei in realtà usare la memoria del browser per ottenere i dati
        //console.log(data);
        if(data['result'] == "OK"){
          stampaDatiUtenti(data['data']);
        }else{
          switch(data['message']){
            case "ERROR_NOTLOGGED":
              alert("Non sei loggato");
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

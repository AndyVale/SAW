function stampaDatiUtenti(datiUtente) {
    let nome = datiUtente['firstname'], cognome = datiUtente['lastname'], email = datiUtente['email'],
        nomeCognomeDOM = document.getElementById('fullname'), nomeInput = document.getElementById('firstname'),
        cognomeInput = document.getElementById('lastname'), emailInput = document.getElementById('email'),
        usernameInput = document.getElementById('username'), fotoProfilo = document.getElementById('profile-image');
    if(localStorage.getItem('firstname') == null){
        localStorage.setItem('firstname', nome);
    }
    if(localStorage.getItem('lastname') == null){
        localStorage.setItem('lastname', cognome);
    }
    if(localStorage.getItem('email') == null){
        localStorage.setItem('email', email);
    }

    nomeCognomeDOM.textContent = nome + ' ' + cognome;
    nomeInput.value = nome;
    cognomeInput.value = cognome;
    emailInput.value = email;
    usernameInput.value = 'username';//TODO: inserire username
    //fotoProfilo.src="../homepage/immagini/5060694-84.png";
}

document.addEventListener('DOMContentLoaded', function() {
    // Effettua una richiesta API Fetch per ottenere i dati dell'utente
    fetch('../../backend/script/show_profile.php', {
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
        //console.log(data);
        //potrei in realtà usare la memoria del browser per ottenere i dati
        //console.log(data['data']['firstname']);
        stampaDatiUtenti(data['data']);
     })
    .catch(error => {
        console.error('Errore:', error);
        console.log('Nome dell\'errore:', error.name);
        console.log('Messaggio dell\'errore:', error.message);
        console.log('Stack dell\'errore:', error.stack);
     });
});

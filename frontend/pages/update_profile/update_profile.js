document.addEventListener('DOMContentLoaded', function() {
    // Effettua una richiesta API Fetch per ottenere i dati dell'utente
    fetch('../../../backend/script/update_profile.php', {
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
      // Popola i campi del form con i dati ottenuti
      document.getElementById('lastname').value = data.lastname;
      document.getElementById('firstname').value = data.firstname;
      document.getElementById('username').value = data.username;
      document.getElementById('lastname').value = data.lastname;
      document.getElementById('email').value = data.email;
      document.getElementById('posts').innerText = data.posts;
      document.getElementById('followers').innerText = data.followers;
      document.getElementById('following').innerText = data.following;
      document.getElementById('fullname').innerText = data.firstname + " " + data.lastname;
     })
     .catch(error => {
     console.error('Errore:', error);
     console.log('Nome dell\'errore:', error.name);
     console.log('Messaggio dell\'errore:', error.message);
     console.log('Stack dell\'errore:', error.stack);
     });
    });
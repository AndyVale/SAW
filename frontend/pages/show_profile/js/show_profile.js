/**
 * @param {Object} datiUtente - oggetto contenenente i dati dell'utente con campi con lo stesso nome del database
 */
function stampaDatiUtenti(datiUtente) {
  console.log(datiUtente);
  let nomeCognome = document.getElementById("fullname");

  nomeCognome.textContent = datiUtente.lastname + " " + datiUtente.firstname;
}

/**
 * @param {Array} posts - array di oggetti contenenti i dati dei post con campi con lo stesso nome del database
 */
function showUserPosts(posts){
  posts.forEach(post => {
    console.log(post);
    renderPost(post);
  });
}

/*<div class="col-12 col-md-6 col-lg-4 p-2 p-md-3 p-lg-4 border">
  <div class="card">
    <img src="../../immagini/104028-84.png" width="100%" alt="" class="card-img-top">
  </div>
  <div class="card-body pb-0 pt-1">
    <button class="btn w-100 m-auto" style="background-color: #6FD08C; color: white;">
      <div class="icon heart heart-icon">
        <span> 
          <i class="fas fa-heart"> </i>
        </span>
      </div>
      1000
    </button>
  </div>
</div>*/
function renderPost(post){
 let
  postsContainer = document.getElementById("postsContainer"), 
  wrapper = document.createElement("div"),
  card = document.createElement("div"),
  button = document.createElement("button"),
  icon = document.createElement("div"),
  span = document.createElement("span"),
  i = document.createElement("i"),
  img = document.createElement("img");

  wrapper.classList.add("col-12", "col-md-6", "col-lg-4", "p-2", "p-md-3", "p-lg-4", "border");
  card.classList.add("card");
  card.style.maxWidth = "500px";
  card.style.maxHeight = "500px";
  button.classList.add("btn", "w-100", "m-auto");
  button.style.backgroundColor = "#6FD08C";
  button.style.color = "white";
  icon.classList.add("icon", "heart", "heart-icon");
  span.textContent = post.likes;
  i.classList.add("fas", "fa-heart");
  img.src = "../../immagini/"+post.urlImmagine;
  img.alt = "Post di michelino";
  card.appendChild(img);
  icon.appendChild(span);
  icon.appendChild(i);
  button.appendChild(icon);
  button.appendChild(span);
  wrapper.appendChild(card);
  wrapper.appendChild(button);
  postsContainer.appendChild(wrapper);

}


/**
 * Funzione che mediante fetch ottiene i post dell'utente loggato
 */
async function getUserPosts(){
  fetch("../../../backend/script/show_profile_posts.php", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json' // Specifica il tipo di contenuto come JSON se necessario
    }
  }).then(response =>{
    if(!response.ok){
      throw new Error("Errore nella richiesta");
    }
    return response.json();
  }).then(data =>{
    if(data['result'] == "OK"){
      showUserPosts(data['data']);
    }else{
      switch(data['message']){
        case "ERROR_NOTLOGGED":
          alert("Non sei loggato");
          window.location.href = "../homepage";
          break;
        case "POST_NOT_FOUND":
          alert("Errore nel database");
          break;
      }
    }
  }).catch(error => {
    console.error('Errore:', error);
    console.log('Nome dell\'errore:', error.name);
    console.log('Messaggio dell\'errore:', error.message);
    console.log('Stack dell\'errore:', error.stack);
 });
}

/**
 * Funzione che mediante fetch ottiene i dati dell'utente loggato come nome, cognome ecc ecc...
 */
async function getUserData(){
  fetch('../../../backend/script/show_profile.php', {
    method: 'GET', //deve "ottenere" i dati
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
}

document.addEventListener('DOMContentLoaded', function() {
    // Effettua una richiesta API Fetch per ottenere i dati dell'utente
    getUserData();
    getUserPosts();
});

/**
 * @param {Object} datiUtente - oggetto contenenente i dati dell'utente con campi con lo stesso nome del database
 */
function stampaDatiUtenti(datiUtente) {
  //console.log(datiUtente);
  let nomeCognome = document.getElementById("fullname"),
      nPost=document.getElementById("nPost"),
      nFollower=document.getElementById("nFollowers"),
      nFollowing=document.getElementById("nFollowing");
  nPost.textContent = datiUtente.nPost;
  nFollower.textContent = datiUtente.nFollower;
  nFollowing.textContent = datiUtente.nFollowing;
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

/*
<div class="col-12 col-md-6 col-lg-4">
  <div class="card">
    <img src="../../immagini/square.png" class="card-img-top" alt="...">
    <div class="card-body">
      <button class="btn w-100 m-auto" style="background-color: #6FD08C; color: white;">
          <span class="icon heart heart-icon"> 
            <i class="fas fa-heart"> </i>
          </span>
        1000
      </button>
    </div>
  </div>
</div>
*/
function renderPost(post){
 let
  postsContainer = document.getElementById("postsContainer"), 
  wrapper = document.createElement("div"),
  card = document.createElement("div"),
  cardBody = document.createElement("div"),
  button = document.createElement("button"),
  span = document.createElement("span"),
  i = document.createElement("i"),
  img = document.createElement("img");

  wrapper.classList.add("col-12", "col-md-6", "col-lg-4");
  card.classList.add("card");
  img.classList.add("card-img-top");
  img.setAttribute("src", "../../Immagini/"+post.urlImmagine);
  cardBody.classList.add("card-body");
  button.classList.add("btn", "w-100", "m-auto");
  button.style.backgroundColor = "#6FD08C";
  button.style.color = "white";
  span.classList.add("icon", "heart", "heart-icon");
  i.classList.add("fas", "fa-heart");

  span.appendChild(i);
  button.appendChild(span);
  button.appendChild(document.createTextNode(" "+post.likes+" "));
  button.id = "bottoneLike"+post.ID;
  cardBody.appendChild(button);
  card.appendChild(img);
  card.appendChild(cardBody);
  wrapper.appendChild(card);
  postsContainer.appendChild(wrapper);
}


/**
 * Funzione che mediante fetch ottiene i post dell'utente loggato
 */
async function getUserPosts(){
  fetch("../../../backend/script/show_profile_posts.php", {
    method: 'GET'
  })
  .then(response =>{
    if(!response.ok){
      throw new Error("Errore nella richiesta");
    }
    return response.json();
  })
  .then(data =>{
    if(data['result'] == "OK"){
      showUserPosts(data['data']);
    }else{
      switch(data['message']){
        case "ERROR_NOTLOGGED":
          removeUserData();
          window.location.href = "../homepage";
          break;
        case "POST_NOT_FOUND":
          alert("Errore nel database");
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

/**
 * Funzione che mediante fetch ottiene i dati dell'utente loggato come nome, cognome ecc ecc...
 */
async function getUserData(){
  fetch('../../../backend/script/show_profile.php', {
    method: 'GET' //deve "ottenere" i dati
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Errore nella richiesta.');
    }
    return response.json();
  })
  .then(data => {//potrei in realtà usare la memoria del browser per ottenere i dati
      if(data['result'] == "OK"){
        stampaDatiUtenti(data['data']);
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
            console.log(data);
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

var postContainer = document.getElementById("postsContainer");

postContainer.addEventListener("click", (e) =>{
  if(e.target.id.includes("bottoneLike")){
    console.log("Ascoltato l'evento click del bottone like del post"+ e.target.id.substring(11));
  }
});
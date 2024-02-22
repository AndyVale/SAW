export {getSnippet, renderSnippet, storeUserData, removeUserData, dbErrorReport,
        renderPosts, renderAPost, changeRatio, getLikedPosts, setLikedPosts, postInteraction
        ,getUserPosts};


/**
 * Funzione che restituisce lo snippet di una pagina in modalità ASINCRONA
 * @param {string} url -url della pagina da cui prendere lo snippet
 * @returns {Promise} - risultato della fetch all'url indicato o null se la fetch non va a buon fine
 */
async function getSnippet(url){
    //let result = null;
    console.log("getSnippet(): "+url);
    return fetch(url, {cache: "no-cache"})
        .then(res=>{
            if(res.ok)
                return res.text();
            throw new Error("Impossibile ottenere lo snippet della pagina richiesta");
        })
        .catch(
            (error)=>{console.log(error); return null;}
        )
}

/**
 * Funzione che renderizza codice html in un elemento DOM specificato
 * @param {string} snippetHTML - codice html dello snippet da renderizzare
 * @param {string} where - oggetto DOM in cui renderizzare lo snippet
 */
function renderSnippet(snippetHTML, where){
    if(!snippetHTML){
        where.insertAdjacentHTML("beforeend", "<p>Errore 404 :(</p>");
        return;
    }
    if(!where){
        console.log("Errore: elemento in cui renderizzare lo snippet non trovato");
        return;
    }
    console.log("renderSnippet(): inzio renderizzazione");
    where.insertAdjacentHTML("beforeend", snippetHTML);
    console.log("renderSnippet(): renderizzato");
    console.log("renderSnippet(): eventi caricati");
}

/**
 * Funzione che salva i dati dell'utente nel localStorage
*/
function storeUserData(dati){
    console.log("Salvataggio dati utente");
    localStorage.setItem("email", dati.email);
    localStorage.setItem("firstname", dati.firstname);
    localStorage.setItem("lastname", dati.lastname);
    localStorage.setItem("username",dati.username);
    localStorage.setItem("lastUpdate", new Date().getTime());//TODO: Trovare un modo più elegante
}

/**
 * Funzione che rimuove i dati dell'utente dal localStorage
*/
function removeUserData(){
    console.log("Rimozione dati utente");
    localStorage.removeItem("email");
    localStorage.removeItem("firstname");
    localStorage.removeItem("lastname");
    localStorage.removeItem("username");
    localStorage.removeItem("lastUpdate");
}

/**
 * Funzione che stampa un'immmagine di errore interno del server all'interno di un container (loginContainer o registrationContainer)
 * @param {node} container - container specifica in che container inserire il messaggio di errore 
 */
function dbErrorReport(container){
    let title = document.createElement("p");
    let img = document.createElement("img");
    let p1 = document.createElement("p");
    //let p2 = document.createElement("p");

    img.setAttribute("src", "../../immagini/serverError.jpg");
    img.setAttribute("alt", 
    "Immagine di due ragazzi a scuola seduti uno dietro l'altro. Su quello dietro c'è scritto 'Server' e su quello davanti 'Browser'. Il primo passa un bigliettino con scritto 'Internal Server Error' al secondo.");
    img.setAttribute("width", "60%");

    p1.setAttribute("class", "fs-6 my-0");
    p1.textContent = "Riprova più tardi ricaricando la pagina";
    //p2.textContent = "(o non farlo, tanto non funzionerà)";//da notare che la parentesi me l'ha suggerita copilot

    title.setAttribute("class", "h6 bg-danger text-white rounded p-1");
    title.textContent = "Impossibile comunicare con il server";
    if(container.firstChild != null)
        container.removeChild(container.firstChild);
    let exitButton = container.firstChild;//TODO: migliorare sta roba poco carina
    //console.log(exitButton);
    while(container.firstChild){
        container.removeChild(container.firstChild);
    }
    container.appendChild(exitButton);
    container.appendChild(title);
    container.appendChild(img);
    container.appendChild(p1);
    //container.appendChild(p2);
}

/**
 * Funzione che renderizza più post usando la funzione renderPost
 * @param {Array} posts - array di oggetti contenenti i dati dei post con campi con lo stesso nome del database
 * @param {HTMLElement} postContainer - Specifica in che container inserire i post
 */
function renderPosts(posts, postContainer){
    console.log("renderPosts()");
    posts.forEach(post => {
        console.log(post);
        renderAPost(post, postContainer);
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

/**
 * Funzione che renderizza un post
 * @param {Object} post Oggetto contenente i dati del post con campi con lo stesso nome del database
 * @param {HTMLElement} postContainer - Specifica in che container inserire il post
 */
function renderAPost(post, postsContainer){

let wrapper = document.createElement("div"),
    card = document.createElement("div"),
    cardBody = document.createElement("div"),
    button = document.createElement("button"),
    span = document.createElement("span"),
    i = document.createElement("i"),
    img = document.createElement("img");

    wrapper.classList.add("col-12", "col-md-6", "col-lg-4");
    card.classList.add("card");
    img.classList.add("card-img-top");
    img.setAttribute("src", "../../immagini/post/"+post.urlImmagine);
    img.setAttribute("alt", post.altDescription);
    changeRatio(1, img);
    cardBody.classList.add("card-body");
    button.classList.add("btn", "w-100", "m-auto", "likebutton");
    span.classList.add("icon", "heart", "heart-icon");
    i.classList.add("fas", "fa-heart");

    span.appendChild(i);
    button.appendChild(span);
    button.appendChild(document.createTextNode(" "+post.likes+" "));
    button.id = "bottoneLike"+post.ID;
    cardBody.appendChild(img);
    cardBody.appendChild(button);

    card.appendChild(cardBody);
    wrapper.appendChild(card);
    postsContainer.appendChild(wrapper);
}

/**
 * Funzione che cambia l'aspect ration di un immagine usando un canvas
 * @param {number} aspectRatio - aspect ratio voluto
 * @param {HTMLElement} immagine - Specifica di che immagine si vuole cambiare l'aspect ratio. ATTENZIONE: Deve contenere l'attributo src dell'immagine
 */
function changeRatio(aspectRatio, immagine){
    //console.log("Rendering dell'imamgine: "+path);
	//console.log(inputImage);
    console.log("changeRatio()");
    let img = new Image();//serve per non innescare una reazione a catena di eventi
    img.src = immagine.src;
	img.addEventListener("load", ()=>{//Quando l'immagine sarà caricata (stessa cosa di un EventListener): non è molto elegante ma non ho trovato un modo migliore
		const inputWidth = immagine.naturalWidth;
		const inputHeight = immagine.naturalHeight;
        
		const inputImageAspectRatio = inputWidth / inputHeight;

		let outputWidth = inputWidth;
		let outputHeight = inputHeight;
		if (inputImageAspectRatio > aspectRatio) {//devo aumentare la larghezza->spazio ai lati orizzontali
			outputHeight = (1/aspectRatio)*inputWidth;
		} else if (inputImageAspectRatio < aspectRatio) {//devo aumentare l'altezza->spazio ai lati verticali
			outputWidth = aspectRatio*inputHeight;
		}

		const outputX = (1*outputWidth - 1*inputWidth) * .5;
		const outputY = (1*outputHeight - 1*inputHeight) * .5;

		const tempCanvas = document.createElement('canvas');

		tempCanvas.width = outputWidth;
		tempCanvas.height = outputHeight;
		
		const ctx = tempCanvas.getContext('2d');
		ctx.drawImage(immagine, outputX, outputY);
        immagine.src = tempCanvas.toDataURL();
        immagine.style="width: 100%;";
	});
}

/**
 * Funzione che mediante fetch ottiene i post dell'utente specificato oppure, se non specificato, dell'utente loggato
 * @param {int} idUser - id dell'utente di cui si vogliono ottenere i post, se non specificato viene invata una richiesta senza parametri (utente loggato)
 */
async function getUserPosts(idUser=null){
    let qryString = "";
    if(idUser != null)
        qryString = "?idUtente="+idUser;
    return fetch("../../../backend/script/post_handler.php"+qryString, {
        method: "GET"
    }).then(response => response.json());
}

/**
 * Funzione che restituisce un array contenente gli id dei post a cui l'utente loggato ha messo like
 * @param {int} idUser - id dell'utente tra cui cercare i post likeati, se non specificato viene invata una richiesta senza parametri
 * @returns {Array} - array contenente gli id dei post che l'utente ha messo like
 */
async function getLikedPosts(idUser=null){
    let qryString = "";
    if(idUser != null){
        qryString = "?ID="+idUser;
    }

    return fetch("../../../backend/script/like_post.php"+qryString, {
        method: "GET"
    }).then(response => {
        if(response.ok){
            return response.json();
        }else{
            throw new Error("Errore nella richiesta fetch in getLikedPosts");
        }
    }).catch(error => console.log(error));
}

/**
 * Funzione che permette di settare il like sui post a cui l'utente loggato ha messo like
 */
function setLikedPosts(postsLiked){
    console.log("setLikedPosts");
    console.log(postsLiked);
    if(postsLiked == null) return;
    postsLiked.forEach(post => {
       document.getElementById("bottoneLike"+post.ID).classList.add("liked");
    });
}

/**
 * Funzione che permette di mettere o togliere un like da un post in modo asincrono
 * @param {HTMLElement} clickedButtonPost bottone del post su cui è stato cliccato
 */
async function postInteraction(clickedButtonPost){
    let postId=clickedButtonPost.id.substring(11);
    let alreadyLiked = clickedButtonPost.classList.contains("liked");
    console.log(postId, alreadyLiked);
    let method = "POST";
    if(alreadyLiked){
        method = "DELETE";
    }
    return fetch("../../../backend/script/like_post.php", {//devo passare l'id del post, quello dell'utente che lo mette è implicito: se l'utente non è loggato niente like
        method: method,
        body : JSON.stringify({
            idPost: postId
        }),
    }).then(response => {
        if(response.ok){
            if(clickedButtonPost.classList.contains("liked")){
                clickedButtonPost.classList.remove("liked");
                clickedButtonPost.childNodes[1].textContent=" "+(parseInt(clickedButtonPost.childNodes[1].textContent)-1);
            }else{
                clickedButtonPost.classList.add("liked");
                clickedButtonPost.childNodes[1].textContent=" "+(parseInt(clickedButtonPost.childNodes[1].textContent)+1);
            }
        }
        return response.text();
    }).catch(error => console.log(error));
}

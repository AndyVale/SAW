export {removeNodeById, getSnippet, renderSnippet, storeUserData, removeUserData, dbErrorReport, renderPosts, renderAPost, renderImg, getLikedPosts, setLikedPosts, postInteraction};

/**
 * @param {string} id - id dell'elemento da rimuovere
 */
function removeNodeById(id){
    let node = document.getElementById(id);
    if(node != null)
        document.getElementById(id).parentNode.removeChild(document.getElementById(id));
}

/**
 * Funzione che restituisce lo snippet di una pagina in modalità ASINCRONA
 * @param {string} url -url della pagina da cui prendere lo snippet
 * @returns {string} - risultato della fetch all'url indicato o null se la fetch non va a buon fine
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
 * @returns {string} - risultato della fetch all'url indicato o null se la fetch non va a buon fine
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
    localStorage.setItem("email", dati.email);
    localStorage.setItem("firstname", dati.firstname);
    localStorage.setItem("lastname", dati.lastname);
    localStorage.setItem("username",dati.username);
    localStorage.setItem("lastUpdate", new Date().getTime());
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
 * Funzione che stampa un'immmagine di errore interno del server
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
    //p2.setAttribute("class", "fs-6 my-0");
    //p2.textContent = "(o non farlo, tanto non funzionerà)";//da notare che la parentesi me l'ha suggerita copilot

    title.setAttribute("class", "h6 bg-danger text-white rounded p-1");
    title.textContent = "Impossibile comunicare con il server";
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
    renderImg("../../Immagini/"+post.urlImmagine, 1, card);
    card.appendChild(cardBody);
    wrapper.appendChild(card);
    postsContainer.appendChild(wrapper);
}

/**
 * Funzione che renderizza un immagine in un canvas impostando un determinato aspect ratio
 * @param {string} path - path dell'immagine da renderizzare
 * @param {number} aspectRatio - aspect ratio voluto
 * @param {HTMLElement} container - Specifica in che container inserire il canvas generato
 */
function renderImg(path, aspectRatio, container){
	let inputImage = new Image();//same as document.createElement("img");
	inputImage.src = path;
    console.log("Rendering dell'imamgine: "+path);
	//console.log(inputImage);
	inputImage.onload = () =>{
		const inputWidth = inputImage.naturalWidth;
		const inputHeight = inputImage.naturalHeight;
		//console.log(inputWidth, inputHeight);
		// get the aspect ratio of the input image
		const inputImageAspectRatio = inputWidth / inputHeight;

		// if it's bigger than our target aspect ratio
		let outputWidth = inputWidth;
		let outputHeight = inputHeight;
		if (inputImageAspectRatio > aspectRatio) {//devo aumentare la larghezza->spazio ai lati orizzontali
			outputHeight = (1/aspectRatio)*inputWidth;
		} else if (inputImageAspectRatio < aspectRatio) {//devo aumentare l'altezza->spazio ai lati verticali
			outputWidth = aspectRatio*inputHeight;
		}

		// calculate the position to draw the image at
		const outputX = (1*outputWidth - 1*inputWidth) * .5;
		const outputY = (1*outputHeight - 1*inputHeight) * .5;

		// create a canvas that will present the output image
		const outputImage = document.createElement('canvas');
		//outputImage.id=path+"canvas";
		// set it to the same size as the image
		outputImage.width = outputWidth;
		outputImage.height = outputHeight;
		
		// draw our image at position 0, 0 on the canvas
		const ctx = outputImage.getContext('2d');
		ctx.drawImage(inputImage, outputX, outputY);
		outputImage.style="background-color: white; border: 1px solid black; width: 100%;";
        const outputImgTag = document.createElement("img");
        outputImgTag.src = outputImage.toDataURL();
        outputImgTag.style="width: 100%;";
        container.insertBefore(outputImgTag, container.firstChild);
	}
}

/**
 * Funzione che restituisce un array contenente gli id dei post a cui l'utente ha messo like
 * @param {int} idUser - id dell'utente tra cui cercare i post likeati, se non specificato viene invata una richiesta senza parametri
 * @returns {Array} - array contenente gli id dei post che l'utente ha messo like
 */
async function getLikedPosts(idUser){
    let getFields = "";
    if(idUser != null){
        getFields = "?ID="+idUser;
    }
    return fetch("../../../backend/script/like_post.php"+getFields, {
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
async function setLikedPosts(postsLiked){
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
 * @param {boolean} alreadyLiked true se l'utente ha già messo like al post, false altrimenti
 */
async function postInteraction(clickedButtonPost, alreadyLiked){
    let postId=clickedButtonPost.id.substring(11);
    let method = "POST";
    if(alreadyLiked){
        method = "DELETE";
    }
    //alert("postInteraction: "+postId);
    fetch("../../../backend/script/like_post.php?idPost="+postId, {//devo passare l'id del post, quello dell'utente che lo mette è implicito: se l'utente non è loggato niente like
        method: method
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
        else{
            console.log("Errore nel like");
            console.log(response);
            showLogin();
        }
        return response.text();
    }).catch(error => console.log(error));
}

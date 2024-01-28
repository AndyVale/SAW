export {removeNodeById, getSnippet, renderSnippet, storeUserData, removeUserData, dbErrorReport};
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
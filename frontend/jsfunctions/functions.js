
/**
 * @param {string} id - id dell'elemento da rimuovere
 */
function removeNodeById(id){
    let node = document.getElementById(id);
    if(node != null)
        document.getElementById(id).parentNode.removeChild(document.getElementById(id));
}

/**
 * @param {string} parentId - id dell'elemento da rimuovere
 * @param {string} wrapperId - id che deve avere il div wrapper
 * @returns {HTMLDivElement} - div che contiene l'elemento tutti gli elementi figli del nodo con id parentId 
 */
/*function wrapInDiv(parentId, divId){
    let wrapper = document.createElement('div');
    let tmp = document.getElementById(parentId);
    console.log(wrapper);
    wrapper.id = divId;
    
    if(!tmp.children) return wrapper;
    
    for(let i = 0; i < tmp.children.length; i++){
        if(tmp.children[i].tagName == "SCRIPT"){
            continue;
        }
        console.log(tmp.children[i]);
        wrapper.appendChild(tmp.children[i]);
    }
    console.log(wrapper);
    return wrapper;
}*/

/**
 * @param {string} wrapperId - id dell'elemento da dewrappare
 */
/*function deWrap(wrapperId){
    let wrapper = document.getElementById(wrapperId);
    let parent = wrapper.parentNode;
    while(wrapper.firstChild){
        parent.insertBefore(wrapper.firstChild, wrapper);
    }
    parent.removeChild(wrapper);
}
*/
/**
 * Funzione che applica un layer di sfocatura a tutto il body inserendo un div con id "blurAll" come primo elemento
 *//*
function blurAll(){
    document.getElementsByTagName("body")[0].prepend(wrapInDiv("body", "blurAll")); //lo inserisco come primo elemento
    document.getElementById("blurAll").classList.add("blur");  
}*/

/**
 * Funzione che rimuove il layer di sfocatura inserito dalla funzione blurAll()
 *//*
function blurAllRemove(){
    deWrap("blurAll");   
}*/

/**
 * Funzione che restituisce lo snippet di una pagina in modalità ASINCRONA
 * @param {string} url -url della pagina da cui prendere lo snippet
 * @returns {string} - risultato della fetch all'url indicato o null se la fetch non va a buon fine
 */
async function getSnippet(url){
    //let result = null;
    return fetch(url, {cache: 'no-cache'})
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
 * Funzione che restituisce lo snippet di una pagina in modalità SINCRONA
 * @param {string} snippetHTML - codice html dello snippet da renderizzare
 * @param {string} where - oggetto DOM in cui renderizzare lo snippet
 * @returns {string} - risultato della fetch all'url indicato o null se la fetch non va a buon fine
 */
async function renderSnippet(snippetHTML, where, eventLoader){
    if(!snippetHTML){
        where.insertAdjacentHTML("beforeend", "<p>Errore 404 :(</p>");
        return;
    }
    if(!where){
        console.log("Errore: elemento in cui renderizzare lo snippet non trovato");
        return;
    }
    where.insertAdjacentHTML("beforeend", snippetHTML);
    eventLoader();
}

/**
 * @param {string} id - id dell'elemento da rimuovere
 */
function removeNodeById(id){
    document.getElementById(id).parentNode.removeChild(document.getElementById(id));
}

/**
 * @param {string} parentId - id dell'elemento da rimuovere
 * @param {string} wrapperId - id che deve avere il div wrapper
 * @returns {HTMLDivElement} - div che contiene l'elemento tutti gli elementi figli del nodo con id parentId 
 */
function wrapInDiv(parentId, divId){
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
}

/**
 * @param {string} wrapperId - id dell'elemento da dewrappare
 */
function deWrap(wrapperId){
    let wrapper = document.getElementById(wrapperId);
    let parent = wrapper.parentNode;
    while(wrapper.firstChild){
        parent.insertBefore(wrapper.firstChild, wrapper);
    }
    parent.removeChild(wrapper);
}

/**
 * Funzione che applica un layer di sfocatura a tutto il body inserendo un div con id "blurAll" come primo elemento
 */
function blurAll(){
    document.getElementsByTagName("body")[0].prepend(wrapInDiv("body", "blurAll")); //lo inserisco come primo elemento
    document.getElementById("blurAll").classList.add("blur");  
}

/**
 * Funzione che rimuove il layer di sfocatura inserito dalla funzione blurAll()
 */
function blurAllRemove(){
    deWrap("blurAll");   
}
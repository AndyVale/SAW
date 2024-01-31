export {search_user, displaySearchResult};
/**
 * Funzione che stampa i risultati della ricerca
 * @param {Array} data Array di oggetti conententi i dati degli utenti
 * @param {*} where Posizione in cui stampare i risultati
 */
function displaySearchResult(data, where){ 
    users.innerHTML="";
    for(let i=0;i<data.length;i++){
        console.log(i);
        where.innerHTML+=
        `<div class="user">
            <img src="../immagini/profile/${data[i].profilePicture}" alt="../immagini/profile/${data[i].profilePicture}" width ='50px'">
            <div class="user-info">
                <h3>${data[i].firstname} ${data[i].lastname}</h3>
                <p>${data[i].username}</p>
            </div>
        </div>`;
    }
}

/**
 * Funzione che cerca gli utenti nel database tramite fetch, se la stringa è vuota ritorna un array vuoto, non
 * effettua chiamata al server se userName è vuota.
 * @param {String} userName Stringa da inviare al server (non deve essere per forza un username)
 * @returns {Promise} Restituisce una promise che contiene un array di oggetti con i dati degli utenti
 */
function search_user(userName){
    userName = userName.trim();
    if(userName != ""){ // Se la stringa non è vuota
        return fetch('../../backend/script/search_engine.php?search='+userName)
        .then(result => result.json())
        .catch(error => console.log(error));
    }
    //altrimenti ritorna un array vuoto, e di questo fuori da search_user() ce ne si accorge nemmeno
    return new Promise ((resolve, reject) => resolve([]));
}

let searcher = document.getElementById('searchUser');

searcher.addEventListener('keyup',(e) => search_user(e.target.value).then(
        data => displaySearchResult(data, document.getElementById('users')) 
    )
);
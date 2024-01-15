window.onscroll = function() {myFunction()};
    window.addEventListener("load", (event) => {
      let presentation = document.getElementById("name");
      presentation.classList.add("show-name")
    });

    function myFunction() {      
      let inspo = document.getElementById("ispirazione");

      /*
      let background = document.querySelector('.background'); 
      let top = window.scrollY;
      let offset = background.offsetTop;
      let height = background.offsetHeight; 
      if (window.scrollY >= (offset*5) && top < (offset + height)){
          background.classList.add("show-remove");
         
      } else {
          background.classList.remove("show-remove");
          
      }
      */

      let like =  document.getElementById("like");
      let profile =  document.getElementById("profile");
      let search =  document.getElementById("search");
      let plus =  document.getElementById("plus"); 
      if(window.scrollY >= (like.offsetTop/4) && window.scrollY < (like.offsetTop + like.offsetHeight)){
        document.getElementById("like").classList.add("show-name");
        document.getElementById("profile").classList.add("show-name");
        document.getElementById("search").classList.add("show-name");
        document.getElementById("plus").classList.add("show-name");
      } else {
        document.getElementById("like").classList.remove("show-name");
        document.getElementById("profile").classList.remove("show-name");
        document.getElementById("search").classList.remove("show-name");
        document.getElementById("plus").classList.remove("show-name");
      } 

      if(window.scrollY >= (inspo.offsetTop/2) && window.scrollY < (inspo.offsetTop + inspo.offsetHeight)){
        inspo.classList.add("show-name");
      } else {
        inspo.classList.remove("show-name");
      }
    }

    let image1 = document.getElementById("img1");
    let image2 = document.getElementById("img2");
    let image3 = document.getElementById("img3");
    let image4 = document.getElementById("img4");
    let image5 = document.getElementById("img5");
    let image6 = document.getElementById("img6");

    function gestisciEventoMouseOver(number){
      let img = document.getElementById("img"+number);
      //console.log("Il cursore è sopra l'elemento numero "+number+"!");
      img.style.transform = 'scale(1.1)';
    }
    
    function gestisciEventoMouseOut(number) {
      let img = document.getElementById("img"+number);
      //console.log("Il cursore è sopra l'elemento numero "+number+"!");
      img.style.transform = 'scale(1)';
    }

    image1.addEventListener('mouseover', ()=> gestisciEventoMouseOver("1"));
    image2.addEventListener('mouseover', ()=> gestisciEventoMouseOver("2"));
    image3.addEventListener('mouseover', ()=> gestisciEventoMouseOver("3"));
    image4.addEventListener('mouseover', ()=> gestisciEventoMouseOver("4"));
    image5.addEventListener('mouseover', ()=> gestisciEventoMouseOver("5"));
    image6.addEventListener('mouseover', ()=> gestisciEventoMouseOver("6"));

    image1.addEventListener('mouseout', ()=> gestisciEventoMouseOut("1"));
    image2.addEventListener('mouseout', ()=> gestisciEventoMouseOut("2"));
    image3.addEventListener('mouseout', ()=> gestisciEventoMouseOut("3"));
    image4.addEventListener('mouseout', ()=> gestisciEventoMouseOut("4"));
    image5.addEventListener('mouseout', ()=> gestisciEventoMouseOut("5"));
    image6.addEventListener('mouseout', ()=> gestisciEventoMouseOut("6"));


    

    /*
    function addIconWithLink() {
      // Esegui la richiesta AJAX per ottenere il contenuto del tuo link
      $.ajax({
        url: 'nopage.html', // Sostituisci con il tuo URL
        success: function(data) {
          // Crea un elemento HTML con l'icona di Font Awesome e il link
          var iconWithLinkFacebook = '<a href="nopage.html">' +
                               '<i class="fab fa-facebook"></i>' +
                               '</a>';
          var iconWithLinkInstagram = '<a href="nopage.html">' +
                               '<i class="fab fa-instagram"></i>' +
                               '</a>';
          var iconWithLinkGithub = '<a href="nopage.html">' +
                               '<i class="fab fa-github"></i>' +
                               '</a>';
          var iconWithLinkYoutube = '<a href="nopage.html">' +
                               '<i class="fab fa-youtube"></i>' +
                               '</a>';

          // Aggiungi l'elemento HTML con l'icona e il link al container
          document.getElementById('facebook-icon').innerHTML = iconWithLinkFacebook;
          document.getElementById('instagram-icon').innerHTML = iconWithLinkInstagram;
          document.getElementById('github-icon').innerHTML = iconWithLinkGithub;
          document.getElementById('youtube-icon').innerHTML = iconWithLinkYoutube;
        }
      });
    }

    // Chiama la funzione al caricamento della pagina
    window.onload = addIconWithLink;
    */
function logout(){
  fetch("../../backend/script/logout.php").then((response) => {
    if(response.ok){
      return response.json();
    }else{
      throw new Error("Errore nella richiesta AJAX");
    }
  }).then((res) => {
    if(res['result'] == "OK"){
      localStorage.clear();
      console.log(res);
      //window.location.href = "./";
    }
  }).catch((error) => {
    console.log(error);
  });
}

function showProfile(){
  window.location.href = "./PROFILO_ANCORA_DA_IMPLEMENTARE";
}

let bottoneAccedi = document.getElementById("bottoneAccedi");
let bottoneIscriviti = document.getElementById("bottoneIscriviti");

function gestioneBottoni(event){
  switch(event.target.id){
    case "bottoneAccedi":
      showLogin();
      break;
    case "bottoneIscriviti":
      showRegistration();
      break;
    case "bottoneLogout":
      logout();
      break;
    case "bottoneModificaProfilo":
      showProfile();
      break;
    default:
      break;
  }
}

document.getElementById("contenitoreBottoni").addEventListener("click", (e)=>gestioneBottoni(e));

fetch("../../backend/script/cookie_login.php").then((response) => {//per prima cosa controllo se l'utente è già loggato tramite i cookie
  if(response.ok){
      return response.json();
  }else{
      throw new Error("Errore nella richiesta AJAX");
  }
}).then((res) => {
  console.log(res);
  if(res['result'] == "OK"){
      successfulLogin(res['data']);
  }
}).catch((error) => {
  console.log(error);
});
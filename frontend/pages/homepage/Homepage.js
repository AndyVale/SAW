import { renderFooter } from "../../jsfunctions/footer.js";
import { cookieLogin } from "../../jsfunctions/login.js";
import { renderNavbar } from "../../jsfunctions/navbar.js";

window.onscroll = function() {myFunction()};
window.addEventListener("load", (event) => {
  let presentation = document.getElementById("name");
  presentation.classList.add("show-name")
});

function myFunction() {      
  let inspo = document.getElementById("ispirazione");
  let like =  document.getElementById("like"),
      profile =  document.getElementById("profile"),
      search =  document.getElementById("search"),
      plus =  document.getElementById("plus"); 
      
  if(window.scrollY >= (like.offsetTop/4) && window.scrollY < (like.offsetTop + like.offsetHeight)){ //TODO: se si ricarica la pagina in questo punto non si vede nulla, da cambiare
    document.getElementById("like").classList.add("show-name");
    profile.classList.add("show-name");
    search.classList.add("show-name");
    plus.classList.add("show-name");
  } else {
    document.getElementById("like").classList.remove("show-name");
    profile.classList.remove("show-name");
    search.classList.remove("show-name");
    plus.classList.remove("show-name");
  } 

  if(window.scrollY >= (inspo.offsetTop/2) && window.scrollY < (inspo.offsetTop + inspo.offsetHeight)){ //TODO: se si ricarica la pagina in questo punto non si vede nulla, da cambiare
    inspo.classList.add("show-name");
  } else {
    inspo.classList.remove("show-name");
  }
}

function gestisciEventoMouseOver(number){
  let img = document.getElementById("img"+number);
  img.style.transform = 'scale(1.1)';
}

function gestisciEventoMouseOut(number) {
  let img = document.getElementById("img"+number);
  img.style.transform = 'scale(1)';
}

let image1 = document.getElementById("img1");//TODO: Da modificare usando il bubbling
let image2 = document.getElementById("img2");
let image3 = document.getElementById("img3");
let image4 = document.getElementById("img4");
let image5 = document.getElementById("img5");
let image6 = document.getElementById("img6");

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

document.addEventListener("DOMContentLoaded", function(){
  renderFooter();
  cookieLogin().then(renderNavbar());
});
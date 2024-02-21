import { renderFooter } from "../../jsfunctions/footer.js";
import { changeRatio } from "../../jsfunctions/functions.js";
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
      
  if(window.scrollY >= (like.offsetTop/4) && window.scrollY < (like.offsetTop + like.offsetHeight)){ 
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

  if(window.scrollY >= (inspo.offsetTop/2) && window.scrollY < (inspo.offsetTop + inspo.offsetHeight)){ 
    inspo.classList.add("show-name");
  } else {
    inspo.classList.remove("show-name");
  }
}



function displayRandomPosts(data, number){
  for(let i=0; i < number; i++){
    document.getElementById("img"+i).src = "../../immagini/"+data[i]["urlImmagine"];
    document.getElementById("img"+i).alt = data[i]["altDescription"];
    document.getElementById("author"+i).innerText = data[i]["username"];
    document.getElementById("link"+i).href = `../user/?ID=${data[i]["idUtente"]}`;
     changeRatio(1,  document.getElementById("img"+i));
  }
}

function randomPosts(){
  fetch("../../../backend/script/homepage.php",
  {
      method: "GET",
  }).then(function(response){
      if(response.ok){
          return response.json();
      }else{
          throw new Error("Errore nella richiesta a homepage.php");
      }
  }).then(function(data){
      console.log(data);      
      if(data["result"]=="OK"){
          displayRandomPosts(data['data'], 6);
      }
      else{
          console.log("upload default images");
      }
  }).catch(function(error){
      console.error('Errore:', error);
      console.log('Nome dell\'errore:', error.name);
      console.log('Messaggio dell\'errore:', error.message);
      console.log('Stack dell\'errore:', error.stack);
  });
}

function gestisciEventoMouseOver(event){
  const CardMouseOver = event.target.closest(".card");
  if (CardMouseOver) {
    CardMouseOver.style.transform = 'scale(1.1)';
  }
}

function gestisciEventoMouseOut(event) {
  const CardMouseOut = event.target.closest(".card");
  if (CardMouseOut) {
    CardMouseOut.style.transform = 'scale(1)';
  }
}

document.addEventListener("DOMContentLoaded", function(){
  renderFooter();
  randomPosts();
  cookieLogin().then(renderNavbar());
});

let userPostHomeContainer = document.getElementById("user-post-homepage-container");
userPostHomeContainer.addEventListener('mouseover', (e)=>gestisciEventoMouseOver(e));
userPostHomeContainer.addEventListener('mouseout', (e)=>gestisciEventoMouseOut(e));

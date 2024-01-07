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

    image1.addEventListener('mouseover', gestisciEventoMouseOver1);
    image2.addEventListener('mouseover', gestisciEventoMouseOver2);
    image3.addEventListener('mouseover', gestisciEventoMouseOver3);
    image4.addEventListener('mouseover', gestisciEventoMouseOver4);
    image5.addEventListener('mouseover', gestisciEventoMouseOver5);
    image6.addEventListener('mouseover', gestisciEventoMouseOver6);
    image1.addEventListener('mouseout', gestisciEventoMouseOut1);
    image2.addEventListener('mouseout', gestisciEventoMouseOut2);
    image3.addEventListener('mouseout', gestisciEventoMouseOut3);
    image4.addEventListener('mouseout', gestisciEventoMouseOut4);
    image5.addEventListener('mouseout', gestisciEventoMouseOut5);
    image6.addEventListener('mouseout', gestisciEventoMouseOut6);

    function gestisciEventoMouseOver1() {
    console.log('Il cursore è sopra l\'elemento!');
    image1.style.transform = 'scale(1.1)';
    }

    function gestisciEventoMouseOver2() {
    console.log('Il cursore è sopra l\'elemento!');
    image2.style.transform = 'scale(1.1)';
    }

    function gestisciEventoMouseOver3() {
    console.log('Il cursore è sopra l\'elemento!');
    image3.style.transform = 'scale(1.1)';
    }

    function gestisciEventoMouseOver4() {
    console.log('Il cursore è sopra l\'elemento!');
    image4.style.transform = 'scale(1.1)';
    }

    function gestisciEventoMouseOver5() {
    console.log('Il cursore è sopra l\'elemento!');
    image5.style.transform = 'scale(1.1)';
    }

    function gestisciEventoMouseOver6() {
    console.log('Il cursore è sopra l\'elemento!');
    image6.style.transform = 'scale(1.1)';
    }

    function gestisciEventoMouseOut1() {
    console.log('Il cursore è sopra l\'elemento!');
    image1.style.transform = 'scale(1)';
    }

    function gestisciEventoMouseOut2() {
    console.log('Il cursore è sopra l\'elemento!');
    image2.style.transform = 'scale(1)';
    }

    function gestisciEventoMouseOut3() {
    console.log('Il cursore è sopra l\'elemento!');
    image3.style.transform = 'scale(1)';
    }

    function gestisciEventoMouseOut4() {
    console.log('Il cursore è sopra l\'elemento!');
    image4.style.transform = 'scale(1)';
    }

    function gestisciEventoMouseOut5() {
    console.log('Il cursore è sopra l\'elemento!');
    image5.style.transform = 'scale(1)';
    }

    function gestisciEventoMouseOut6() {
    console.log('Il cursore è sopra l\'elemento!');
    image6.style.transform = 'scale(1)';
    }

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
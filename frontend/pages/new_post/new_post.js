import { renderFooter } from "../../jsfunctions/footer.js";
import { showLogin } from "../../jsfunctions/login.js";
import { renderNavbar } from "../../jsfunctions/navbar.js";
console.log(document.getElementById('imageCanvas').clientWidth);
console.log(document.getElementById('imageCanvas').clientHeight);

var canvas=new fabric.Canvas('imageCanvas', {
    width: document.getElementById('dropZone').clientWidth,
    height: 350
}); //creo un canvas con dimensioni iniziali, poi verrà ridimensionato in base all'immagine

function verificaRatio(width, height) {
    const ratio = width / height;
    const ratios = {
        '1:1': 1,
        '4:5': 4/5,
        '2:3': 2/3,
        '1.91:1': 1.91,
        '16:9': 16/9
    };

    let closest = Number.MAX_SAFE_INTEGER;
    let closestRatio;

    for (let r in ratios) {
        const diff = Math.abs(ratios[r] - ratio);
        if (diff < closest) {
            closest = diff;
            closestRatio = r;
        }
    }

    return closestRatio;
}

function riadattaCanvas(deviceWidth, deviceHeight, imageWidth, imageHeight) {
    const ratio = verificaRatio(imageWidth, imageHeight);
    const [ratioWidth, ratioHeight] = ratio.split(':').map(Number);

    if (deviceWidth / deviceHeight > ratioWidth / ratioHeight) {
        canvas.setWidth(deviceHeight * (ratioWidth / ratioHeight));
        canvas.setHeight(deviceHeight);
    } else {
        canvas.setWidth(deviceWidth);
        canvas.setHeight(deviceWidth * (ratioHeight / ratioWidth));
    }
}

function impostaImmagineCanvas(e){
    let imgObj = e.target;
    console.log(imgObj);
    var image = new fabric.Image(imgObj);
    let ratio = image.width / image.height;
    document.getElementById("imageLoader").style.display = "none";
    console.log(ratio);
    riadattaCanvas(window.innerWidth/2, window.innerHeight/2, image.width, image.height);
    if(image.height >= image.width){//se è più alta che larga la oriento in verticale
        console.log("scale to height");
        image.scaleToHeight(canvas.height);
    }else{//altrimenti in orizzontale
        console.log("scale to width");
        image.scaleToWidth(canvas.width);
    }
    canvas.clear();
    canvas.add(image);
    canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas));
    canvas.centerObject(image);
    canvas.renderAll();
}

function handleFileImageUpload(e){
    var reader = new FileReader();//leggo dagli input file
    textAreasContainer.innerHTML = '';//pulisco il contenitore dei campi di testo
    document.getElementById('dropZone').classList.remove('border');
    reader.addEventListener("load", event => readerShowImage(event));
    reader.readAsDataURL(e.target.files[0]);
}


function handleAddTextArea(){
    if(canvas == null){return;}

    num = num + 1;//incremento la variabile globale per tenere traccia del numero di campi di testo

    let inputsGroup = document.createElement('div'), 
        text = document.createElement('input'),
        color = document.createElement('input'),
        fontSelector = document.createElement('select'),
        options = ['Arial', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact', 'Lucida Console', 'Lucida Sans Unicode', 'Palatino Linotype', 'Tahoma', 'Garamond', 'Bookman Old Style'],
        removeButton = document.createElement('button');

    let textInCanvas = new fabric.Text('Casella di testo ' + num, {
        fill: 'black'
    });

    //aggiunta di attributi e classi ai vari elementi:
    console.log(num);
    text.type = 'text';
    text.placeholder = 'Testo ' + num;
    color.type = 'color';
    
    removeButton.innerHTML = 'Rimuovi';
    for(let i = 0; i < options.length; i++){
        let option = document.createElement('option');
        option.value = options[i];
        option.innerHTML = options[i];
        fontSelector.appendChild(option);
    }

    inputsGroup.id = 'inputsGroup'+ num;
    inputsGroup.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'my-2');
    text.id = 't'+ num;
    color.id = 'c'+ num;
    fontSelector.id = 'f'+ num;
    removeButton.id = 'r'+ num;
    removeButton.classList.add('btn', 'btn-danger', 'mx-2');
    text.classList.add('form-control', 'mx-2');
    color.classList.add('mx-2');
    fontSelector.classList.add('form-select', 'mx-2');

    //aggiunta di elementi al DOM:
    inputsGroup.appendChild(text);
    inputsGroup.appendChild(color);
    inputsGroup.appendChild(fontSelector);
    inputsGroup.appendChild(removeButton);
    textAreasContainer.appendChild(inputsGroup);
    textInCanvas.moveTo(num);

    //aggiunta di eventi ai vari elementi:
    /*Nota: Non è elegante gestire gli eventi in questo modo ma la modifica di elementi 'Fabric' imporrebbe l'utilizzo di un array globale o simili.
            se si trovano alternative migliori per sfruttare il bubbling degli eventi sarebbe meglio*/
    
    text.addEventListener('input', (e) => {
        let id = e.target.id.substring(1);
        console.log(id);
        textInCanvas.set('text', e.target.value);
        canvas.renderAll();
        console.log(e.target.value);
    });
    color.addEventListener('input', (e) => {
        let id = e.target.id.substring(1);
        console.log(id);
        textInCanvas.set('fill', e.target.value);
        canvas.renderAll();
        console.log(e.target.value);
    });
    fontSelector.addEventListener('change', (e) => {
        let id = e.target.id.substring(1);
        console.log(id);
        textInCanvas.set('fontFamily', e.target.value);
        canvas.renderAll();
        console.log(e.target.value);
    });
    removeButton.addEventListener('click', (e) => {
        let id = e.target.id.substring(1);
        console.log(id);
        canvas.remove(textInCanvas);
        document.getElementById('inputsGroup'+id).remove();
    });

    //aggiunta di elementi al canvas:
    canvas.add(textInCanvas);
    canvas.centerObject(textInCanvas);
    canvas.renderAll();
}

function hadleUpload(){
    let file = document.getElementById('imageLoader');
    console.log(file.files[0]);

    let canvasImg = document.getElementById('imageCanvas');
    canvas.discardActiveObject().renderAll();
    var imgData = canvasImg.toDataURL({
        format: 'png',
        multiplier: 1//per avere un'immagine di 800px di larghezza quale sia la dimensione del canvas (che in base allo schermo potrebbe essere differente)
    });
    fetch('../../../backend/script/post_handler.php', {
        method: 'POST',
        body:  imgData
    })
    .then(response =>{
        if(response.status == 401)
            showLogin()
        if(response.status == 201)
            window.location.href = '../show_profile/';
    })
    .then(data => console.log(data))
    .catch(error => console.log(error));
}

function readerShowImage(event){
    var imgObj = new Image();//creo un oggetto immagine
    imgObj.src = event.target.result;
    imgObj.addEventListener('load',(e)=> impostaImmagineCanvas(e));
    document.getElementById('addTextButton').style.display = 'block';
    document.getElementsByClassName('canvas-container')[0].classList.add('mx-auto');//gli elementi canvas-container e upper-canvas sono generati da Fabric.js
    document.getElementsByClassName('upper-canvas')[0].classList.add('border', 'border-3', 'border-dark', 'rounded-3', 'shadow-lg');
}


var imageLoader = document.getElementById('imageLoader'),
    uploadButton = document.getElementById('uploadButton'),
    addTextButton = document.getElementById('addTextButton'),
    textAreasContainer = document.getElementById('textAreasContainer'),
    dropZone = document.getElementById("dropZone"),
    num = 0;

uploadButton.addEventListener('click', hadleUpload, false)
imageLoader.addEventListener('change', handleFileImageUpload, false);
addTextButton.addEventListener('click', handleAddTextArea, false);

dropZone.addEventListener("dragover", (e)=>{
    //console.log(event.target);
    //console.log(this);
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('border', 'border-3');
    dropZone.style.border = '3px dashed #000';
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();

    let reader = new FileReader();//leggo dal drop
    textAreasContainer.innerHTML = '';//pulisco il contenitore dei campi di testo
    reader.addEventListener("load", event => readerShowImage(event));
    reader.readAsDataURL(e.dataTransfer.files[0]);

    dropZone.style.border = '';
});

dropZone.addEventListener("dragleave", (e)=>{
    e.preventDefault();
    e.stopPropagation();
    dropZone.style.border = '';
    dropZone.classList.add('border', 'border-3');
});

document.addEventListener("DOMContentLoaded", (e)=>{
    fetch('../../../backend/script/post_handler.php', {
        method: 'OPTIONS'
    }).then(response =>{
        if(response.status == 401)
            showLogin();
    })
    .catch(error => console.log(error));

    renderFooter();
    renderNavbar();
});
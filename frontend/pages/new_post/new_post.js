import { renderFooter } from "../../jsfunctions/footer.js";
import { cookieLogin, showLogin } from "../../jsfunctions/login.js";
import { renderNavbar } from "../../jsfunctions/navbar.js";
import {replaceContentWithImg} from "../../jsfunctions/functions.js";

var canvas=new fabric.Canvas('imageCanvas', {
    width: document.getElementById('dropZone').clientWidth,
    height: 350
}); //creo un canvas con dimensioni iniziali, poi verrà ridimensionato in base all'immagine

function notificaErrore(){
    let mR = document.getElementById('mainRow');
    let imgError = document.createElement('img');
    imgError.src = '../../immagini/new_post_error.png';
    imgError.style.width = '60%';
    imgError.classList.add('mx-auto', 'd-block');
    imgError.alt = 'Gatto che guarda un computer con espressione stupita, ti dice che c\'è stato un errore nel caricamento dell\'immagine';
    replaceContentWithImg(mR, imgError);
    document.getElementById('uploadButton').style.display = 'none';
}

//notificaErrore();

/**
 * Funzione che verifica il rapporto tra larghezza e altezza dell'immagine e restituisce il rapporto più vicino a quello dell'immagine
 * @param {Number} width 
 * @param {Number} height 
 * @returns 
 */
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

window.addEventListener('resize', () => {//TODO: Aggiungere resize immagine in automatico
    const deviceWidth = window.innerWidth/2;
    const deviceHeight = window.innerHeight/2;
    const imageWidth = canvas.width;
    const imageHeight = canvas.height;
    riadattaCanvas(deviceWidth, deviceHeight, imageWidth, imageHeight);
});//non fa nulla ma serve per evitare un errore di console

function riadattaCanvas(deviceWidth, deviceHeight, imageWidth, imageHeight) {
    const ratio = verificaRatio(imageWidth, imageHeight);
    const [ratioWidth, ratioHeight] = ratio.split(':');
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
    //canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas));
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

/**
 * Funzione che aggiunge un campo di testo al canvasFabric e aggiunge al DOM gli input per modificare il testo, il colore e il font, e
 * un bottone per rimuovere il campo di testo.
 * Aggiunge anche gli eventi neccessari all'interazione tra Fabric e gli elementi del DOM.
 */
function handleAddTextArea(){
    if(canvas == null){return;}

    num = num + 1;//incremento la variabile globale per tenere traccia del numero di campi di testo

    let inputsGroup = document.createElement('div'), 
        text = document.createElement('input'),
        color = document.createElement('input'),
        fontSelector = document.createElement('select'),
        options = ['Arial', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact', 'Lucida Console', 'Lucida Sans Unicode', 'Palatino Linotype', 'Tahoma', 'Garamond', 'Bookman Old Style'],
        removeButton = document.createElement('button');

    let textInCanvas = new fabric.Text('Testo ' + num, {
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

/**
 * Funzione che ridimensiona un canvas in base a una larghezza e altezza massima, senza distorcere l'immagine,
 * ovvero mantenendo l'aspect ratio dell'immagine.
 * @param {canvas} cnvs Canvas da ridimensionare
 * @param {*} maxWidth larghezza massima che si vuole ottenere
 * @param {*} maxHeight altezza massima che si vuole ottenere
 * @returns {canvas} Canvas ridimensionato
 */
function resizeCanvas(cnvs, maxWidth, maxHeight, minWidth=0, minHeight=0) {
    let tempCanvas = document.createElement('canvas'),
        tempContext = tempCanvas.getContext('2d'),
        aspectRatio = cnvs.width / cnvs.height;

    if (cnvs.width > maxWidth) {
        tempCanvas.width = maxWidth;
        tempCanvas.height = maxWidth / aspectRatio;
    } else if (cnvs.height > maxHeight) {
        tempCanvas.height = maxHeight;
        tempCanvas.width = maxHeight * aspectRatio;
    } else {
        tempCanvas.width = cnvs.width;
        tempCanvas.height = cnvs.height;
    }

    tempContext.drawImage(cnvs, 0, 0, tempCanvas.width, tempCanvas.height);
    return tempCanvas;
}


function hadleUpload(){
    let file = document.getElementById('imageLoader'), altDescription = document.getElementById('alternativeText');
    console.log(file.files[0]);
    if(altDescription.value == '' || altDescription.value.length > 2000){
        altDescription.style.border = '2px solid red';
        return;
    }
    let canvasImg = document.getElementById('imageCanvas');
    canvas.discardActiveObject().renderAll();
    canvasImg = resizeCanvas(canvasImg, 1000, 1000);//per evitare di caricare immagini troppo grandi
    let imgData = canvasImg.toDataURL({
        format: 'png',
        multiplier: 1
    });

    fetch('../../../backend/script/post_handler.php', {
        method: 'POST',
        body: JSON.stringify({
            postImg: imgData,
            altDescription: altDescription.value
        })
    })
    .then(response =>{
        switch(response.status){
            case 201:
                window.location.href = '../show_profile/';
                break;
            case 400:
                notificaErrore();
                break;
            case 401:
                showLogin();
                break;
            default:
                notificaErrore();
                break;
        }
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
    document.getElementById('alternativeText').style.display = 'block';
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
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('border', 'border-3');
    dropZone.style.border = '3px dashed #000';
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();

    let reader = new FileReader();//leggo dal drop
    //textAreasContainer.innerHTML = '';//pulisco il contenitore dei campi di testo
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
    renderFooter();
    cookieLogin().then(()=>{
        renderNavbar();
    });
});
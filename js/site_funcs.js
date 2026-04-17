let jsonCards = null;
let paintings = [];

let simpleList = null;

const queryStr = window.location.search;
const urlParam = new URLSearchParams(queryStr);

function make_card(name, desc, link, img, parent) {
    const root = document.createElement('div');
    const col = document.createElement('div');
    const cardImg = document.createElement('img');
    const cardLink = document.createElement('a');
    const col2 = document.createElement('div');
    const descTitle = document.createElement('h3');
    const description = document.createElement('p');

    root.setAttribute('class', 'col-6 row bg_window text-center rounded p-2 shadow');

    col.setAttribute('class', 'col');
    cardImg.setAttribute('class', 'w-100 rounded');
    cardImg.style.width = '30vh';
    cardImg.style.height = '30vh';
    cardImg.src = img;
    cardLink.innerHTML = name;
    cardLink.href = link;
    cardLink.setAttribute('class', 'm-3 p-2 bg-success nav-link text-light rounded');

    col2.setAttribute('class', 'col');
    descTitle.setAttribute('class', 'text-dark');
    descTitle.innerHTML = 'Omschrijving';
    description.setAttribute('class', 'text-dark');
    description.textContent = desc;

    col.append(cardImg);
    col.append(cardLink);
    col2.append(descTitle);
    col2.append(description);

    root.append(col);
    root.append(col2);
    const parent_node = document.getElementById(parent);
    parent_node.append(root);
}

async function load_JSON(file) {
    const response = await fetch(file);
    const json = await response.json();

    jsonCards = json
    InitMain();
}

function InitMain(){
    //console.log(jsonCards);
    const museum_wind = document.getElementById('museum_window');

    for (let i = 0; i < jsonCards.length; i++){
        const curCard = jsonCards[i];
        let offset = (i * 5) - 7;
        if (!curCard.link){continue;}//curCard.link = '404.html'}
        if(simpleList){
            make_card(curCard.title, curCard.description, curCard.link, curCard.icon, 'card_container');
        }
        else{
            paintings[paintings.length++] = {url: curCard.link, texture: curCard.icon, position: {x: offset, y: 2, z: -9}};
        }
    }

    if(!simpleList){
        const game_frame = document.getElementById('game_frame');
        game_frame.src = 'museum.html';
        game_frame.onload = () => {
            sendMsg(game_frame.contentWindow, [paintings]);
        }
    }
    else{
        museum_wind.style.setProperty('display', 'none', 'important');
    }
}

let win_location = window.location.pathname;
if (win_location.includes('projecten.html')){
    simpleList = urlParam.get('interface');
    load_JSON("../js/projectcards.json");
}

//simpleList = urlParam.get('interface');
//load_JSON("../js/projectcards.json");

if(urlParam.get('museum')){
    const Header = document.getElementById('pageHeader');
    const btnBack = document.createElement('button');

    btnBack.setAttribute('class', 'btn btn-dark p-2 text-light rounded');
    btnBack.innerHTML = 'Terug naar Museum';
    console.log(Header.children)
    Header.children[0].style.setProperty('display', 'none', 'important');

    btnBack.addEventListener('click', (e) => {
        window.parent.location.href = 'projecten.html';
    });

    Header.append(btnBack);
    console.log("Inside 3D Museum!");
}

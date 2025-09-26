let jsonCards = null;

function make_card(name, desc, link, img, parent) {
    const root = document.createElement('div');
    const col = document.createElement('div');
    const cardImg = document.createElement('img');
    const cardLink = document.createElement('a');
    const col2 = document.createElement('div');
    const descTitle = document.createElement('h3');
    const description = document.createElement('p');

    root.setAttribute('class', 'col-6 row bg-primary bg-gradient text-center rounded p-2 shadow');

    col.setAttribute('class', 'col');
    cardImg.setAttribute('class', 'w-100 rounded');
    cardImg.style.width = '30vh';
    cardImg.style.height = '30vh';
    cardImg.src = img;
    cardLink.innerHTML = name;
    cardLink.href = link;
    cardLink.setAttribute('class', 'm-3 p-2 bg-success nav-link text-light rounded');

    col2.setAttribute('class', 'col');
    descTitle.setAttribute('class', 'text-light');
    descTitle.innerHTML = 'Omschrijving';
    description.setAttribute('class', 'text-light');
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
    console.log(jsonCards);

    for (let i = 0; i < jsonCards.length; i++){
        const curCard = jsonCards[i];
        if (!curCard.link){curCard.link = '404.html'}
        make_card(curCard.title, curCard.description, curCard.link, curCard.icon, 'card_container');
    }
}

let win_location = window.location.pathname;
if (true){//(win_location == 'Portfoilio/pages/projecten.html'){
    load_JSON("../js/projectcards.json");
}

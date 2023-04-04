const carousal = document.querySelector(".carousal");
const images = document.querySelectorAll(".carousal>img");
const carousal_buttons = document.querySelectorAll("#carousal_buttons>div");

var index = 0;
var prev_index = null;

for(let elem of carousal_buttons){
    elem.addEventListener("click",()=>{
        index = +elem.className -1;
        scroll(index);
    })
}

scroll();

setInterval(scroll, 5000);

function scroll(){
    if(index == images.length){
        index = 0;
    }
    carousal.scroll({
        left: carousal.clientWidth*index,
        behavior: 'smooth'
    });

    const text = document.querySelector(".h4");
    if(carousal_buttons[prev_index]){
        carousal_buttons[prev_index].removeChild(text);
        carousal_buttons[prev_index].style.width = "10px";
        carousal_buttons[prev_index].style.height = "10px";
        carousal_buttons[prev_index].style.border = "1px solid white";
        carousal_buttons[prev_index].style.marginLeft = "1%";
        carousal_buttons[prev_index].style.borderRadius = "100%";
        carousal_buttons[prev_index].style.backgroundColor = "grey";
    }

    let h4 = document.createElement("p");
    h4.setAttribute("class","h4");
    h4.innerText = `${index+1}/${images.length}`;

    carousal_buttons[index].style.width = "25px";
    carousal_buttons[index].style.height = "15px";
    carousal_buttons[index].style.backgroundColor = "rgb(43, 43, 43)";
    carousal_buttons[index].style.borderRadius = "20px";
    carousal_buttons[index].append(h4);

    prev_index = index;
    index++;
}

let carousal_content = [
    {
        img:"https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Desktop-192_55738f37-c97c-4e73-874a-dd117eb9a9a2_1400x.jpg?v=1676466626",
        id:"6403037a59bc201a26b3c415"
    },
    {
        img:"https://cdn.shopify.com/s/files/1/0057/8938/4802/files/DD-Desktop_1400x.jpg?v=1676020067",
        id:"6403037a59bc201a26b3c415"
    },
    {
        img:"https://cdn.shopify.com/s/files/1/0057/8938/4802/files/DC-Desktop-Banner_1400x.jpg?v=1676607577",
        id:"6403037a59bc201a26b3c415"
    },
    {
        img:"https://cdn.shopify.com/s/files/1/0057/8938/4802/files/trinity-web_c5e16c27-35b7-498b-a046-bdec250d517b_1400x.jpg?v=1676960518",
        id:"6403037a59bc201a26b3c415"
    },
    {
        img:"https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Desktop-192_55738f37-c97c-4e73-874a-dd117eb9a9a2_1400x.jpg?v=1676466626",
        id:"6403037a59bc201a26b3c415"
    }
]

let adminmsg = "Enhance your Tech Buying Experience";

let new_card = [
    "6403037a59bc201a26b3c415",
    "640303c059bc201a26b3c417",
    "640304b659bc201a26b3c419",
    "64035dbf057b9a959ce1b8ae",
    "64036252057b9a959ce1b8b3"
];

let explore_cards = [];

let carousal_elements = document.querySelectorAll(".carousal img")

for(x = 0; x < carousal_elements.length; x++){
    carousal_elements[x].src = carousal_content[x].img
    carousal_elements[x].style.cursor = "pointer";

    let id = carousal_content[x].id
    carousal_elements[x].addEventListener("click",()=>{
        localStorage.setItem("product_id",id);
        window.location.href = "./product_view.html"
    })
}

document.querySelector(".admin_msg h2").innerText = adminmsg;

let all_cards_elem = document.querySelectorAll(".cards");

for(let cards_elem of all_cards_elem){
    cards_elem.innerHTML = "";

    var url = "https://weak-tick-sweatpants.cyclic.app/products/";

    for(let elem of new_card){
        getdata(url+elem);
        async function getdata(url){
            let data = await fetch(url);
            data = await(data.json());
            console.log(data);
            render(data,cards_elem);
        }
    }

}



function render(data,cards_elem){
    let card = document.createElement("div");
    card.className = "card";

    let div1 = document.createElement("div");
    let highlight = document.createElement("div");
    highlight.className = "highlight";

    let h4 = document.createElement("h4");
    h4.innerText = "Highlight";

    highlight.append(h4);

    let img = document.createElement("img");
    img.src = data.images[0];

    div1.append(highlight,img);


    let div2 = document.createElement("div");
    let title = document.createElement("h3");
    title.innerText = data.title;

    let variants = Object.keys(data.price);

    let price = document.createElement("h4");
    price.innerText = data.price[variants[0]];

    let hr = document.createElement("hr");

    let brand = document.createElement("p");
    prev_index.innerText = data.brand

    let button = document.createElement("button");
    button.className = data._id;
    button.innerText = "View";

    button.addEventListener("click",()=>{
        let id = button.className;
        localStorage.setItem("product_id",id);
        window.location.href = "./product_view.html"
    })

    div2.append(title,price,hr,brand,button);

    card.append(div1,div2);

    cards_elem.append(card);
}
let filters = document.querySelectorAll(".filter select");

if(localStorage.getItem("device_filters")){
    let values = JSON.parse(localStorage.getItem("device_filters"));
    for(let elem of filters){
        elem.value = values[elem.id];
    }
}

let url = "https://weak-tick-sweatpants.cyclic.app/products/"

generate_values(filters);

function generate_values(filters){
    let values = {}
    for(let elem of filters){
        values[elem.id] = elem.value;
    }

    console.log(values);
    localStorage.setItem("device_filters",JSON.stringify(values));
    getproducts(url,values);
}

async function getproducts(url,values){
    let data = await fetch(url);

    data = await data.json();

    // console.log(values);

    filter(data,values);
}

function filter(data,values){
    let finaldata = [];

    for(let elem of data){
        let ans = true;
        for(let key in values){

            if(values[key] == ""){
                continue;
            }

            if(elem.filter[key].length){
                if(!elem.filter[key].includes(values[key]) && !elem.filter[key].includes(+values[key])){
                    ans = false;
                    console.log(elem.filter[key],values[key]);
                    break;
                }
            }

            else if(elem.filter[key] !== values[key]){
                ans = false;
                break;
            }
        }
        if(ans){
            finaldata.push(elem);
        }
    }

    // console.log(values)
    // console.log(finaldata);
    render(finaldata);
}

document.querySelector("#apply").addEventListener("click",()=>{
    let filters = document.querySelectorAll(".filter select");
    generate_values(filters);
})

document.querySelector("#reset").addEventListener("click",()=>{
    let filters = document.querySelectorAll(".filter select");
    for(let elem of filters){
        elem.value = "";
    }
    generate_values(filters);
})


let gallery = document.querySelector(".gallery");

function render(data){
    gallery.innerHTML = "";
    for(let elem of data){
        let div = document.createElement("div");
        div.className = elem._id;

        let imgdiv = document.createElement("div");
        let img = document.createElement("img");
        img.src = elem.images[0];
        imgdiv.append(img);

        let detaildiv = document.createElement("div");

        let title = document.createElement("h3");
        title.innerText = elem.title;

        let price = document.createElement("h3");
        let variants = Object.keys(elem.price);
        // console.log(variants)
        price.innerText = `Rs. ${elem.price[variants[0]]}`;

        let variant = document.createElement("h3");
        variant.innerText = `${variants[0]}`;

        let hr = document.createElement("hr");

        let colourdiv = document.createElement("div");
        colourdiv.className = "colours"
        for(let key in elem.colors){
            let color = document.createElement("div");
            let colorimg = document.createElement("img");
            colorimg.className = key;
            colorimg.src = elem.colors[key];
            colorimg.addEventListener("mouseenter",()=>{
                img.src = colorimg.src;
            })
            color.append(colorimg);
            colourdiv.append(color);
        }
        

        let button = document.createElement("button");
        button.className = "view";
        button.innerText = "View"

        detaildiv.append(title,price,variant,hr,colourdiv,button);

        div.append(imgdiv,detaildiv);

        gallery.append(div);

    }

    let buttons = document.querySelectorAll(".view");

    for(let elem of buttons){
        elem.addEventListener("click",()=>{
            let id = elem.parentElement.parentElement.className;
            localStorage.setItem("product_id",id);
            window.location.href = "./product_view.html"
        })
    }
}

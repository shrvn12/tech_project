let url = "https://weak-tick-sweatpants.cyclic.app/wishlist";

let gallery = document.querySelector(".gallery");

// let cur_user = localStorage.getItem("cur_user");
// cur_user = JSON.parse(cur_user);

if(cur_user && cur_user.token){
    getitems();
}
else{
    gallery.innerHTML = "";
    let h1 = document.createElement("h1");
    h1.innerText = "Please login to view your wishlist..."
    gallery.append(h1);
}

async function getitems(){
    let res = await fetch(url,{
        method:"GET",
        headers:{
            "content-type":"application/json",
            authorization: cur_user.token
        }
    })
    res = await res.json();

    if(res.length){
        for(let elem of res){
            getproduct(`https://weak-tick-sweatpants.cyclic.app/products/${elem}`);
        }
    }
    else{
        gallery.innerHTML = "";
        let h1 = document.createElement("h1");
        h1.innerText = "Your wishlist is empty...";
        gallery.append(h1);
    }

}

async function getproduct(url){
    const res = await (await fetch(url)).json();

    console.log(res);

    render(res);
}

function render(elem){
    gallery.innerHTML = "";
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
    console.log(variants)
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

    let delbutton = document.createElement("button");
    delbutton.innerText = "delete";

    delbutton.addEventListener("click",async ()=>{
        let id = elem._id;
        const url = `https://weak-tick-sweatpants.cyclic.app/removefromwishlist/${id}`;
        let response = await fetch(url,{
            method:"DELETE",
            headers:{
                "content-type":"application/json",
                "authorization": cur_user.token
            }
        })

        response = await response.json();

        alert(response.msg);

        getitems();
    })

    detaildiv.append(title,price,variant,hr,colourdiv,button,delbutton);

    div.append(imgdiv,detaildiv);

    gallery.append(div);

    let buttons = document.querySelectorAll(".view");

    for(let elem of buttons){
        elem.addEventListener("click",()=>{
            let id = elem.parentElement.parentElement.className;
            localStorage.setItem("product_id",id);
            console.log(id);
            window.location.href = "./product_view.html"
        })
    }
}
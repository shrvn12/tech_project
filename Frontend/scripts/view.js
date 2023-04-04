var id = localStorage.getItem("product_id");

var url = "https://weak-tick-sweatpants.cyclic.app/products/";

var main_img = document.querySelector("#main_img");

var title = document.querySelector("#title");

var images = document.querySelectorAll("#images>div>img")

var prices = document.querySelector(".prices");

var highlights = document.querySelector(".highlights");

var colors = document.querySelector(".colors");

var specs = document.querySelector(".full_specs");

console.log(images);

getproduct(url);

async function getproduct(url){
    console.log(id);
    let res = await fetch(url+id);

    res = await res.json();

    document.title = res.title;

    main_img.src = res.images[0];

    title.innerText = res.title;

    prices.innerHTML = "";

    highlights.innerHTML = "";

    for(let elem of res.highlights){
        let li = document.createElement("li");
        li.innerText = elem;
        highlights.append(li);
    }

    for(let key in res.price){
        let variant = document.createElement("h3");
        variant.className = "variant";
        variant.innerText = key;
        let price = document.createElement("h3")
        price.innerText = ` Rs. ${res.price[key]}`;
        let hr = document.createElement("hr");
        if(prices.innerHTML == ""){
            prices.append(variant,price);
        }
        else{
            prices.append(hr,variant,price);
        }
    }

    let wishlistbutton = document.createElement("button");

    wishlistbutton.innerText = "Add to wishlist";

    let cur_user = localStorage.getItem("cur_user");
    cur_user = JSON.parse(cur_user);

    if(cur_user && cur_user.token){
        let res = await fetch("https://weak-tick-sweatpants.cyclic.app/wishlist",{
            method:"GET",
            headers:{
                "content-type":"application/json",
                authorization: cur_user.token
            }
        })

        res = await res.json();

        console.log(res);

        if(res.includes(id)){
            wishlistbutton.innerText = "Remove from wishlist";
        }
    }
    // wishlistbutton.className = res._id
    wishlistbutton.addEventListener("click",async ()=>{
        if(wishlistbutton.innerText == "Add to wishlist"){

            try {
                const url = `https://weak-tick-sweatpants.cyclic.app/addtowishlist/${res._id}`
                let response = await fetch(url,{
                    method:"PATCH",
                    headers:{
                        "content-type":"application/json",
                        "authorization": cur_user.token
                    }
                })

                response = await response.json();

                if(response.msg == "added to wishlist"){
                    wishlistbutton.innerText = "Remove from wishlist";
                }

                alert(response.msg);
            } catch (error) {
                alert("Try logging in again");
                console.log(error);
            }

        }
        else{
            
            try {
                const url = `https://weak-tick-sweatpants.cyclic.app/removefromwishlist/${res._id}`
                let response = await fetch(url,{
                    method:"DELETE",
                    headers:{
                        "content-type":"application/json",
                        "authorization": cur_user.token
                    }
                })

                response = await response.json();

                wishlistbutton.innerText = "Add to wishlist";

                console.log(response);

                alert(response.msg);
            } catch (error) {
                alert("Try logging in again");
                console.log(error);
            }

        }
        
    })


    prices.append(wishlistbutton);

    for(let x = 0; x < images.length; x++){
        images[x].src = res.images[x];
        images[x].addEventListener("mouseenter",()=>{
            main_img.src = images[x].src;
            images[x].parentElement.style.border = "1px solid red";
        })

        images[x].addEventListener("mouseleave",()=>{
            images[x].parentElement.style.border = "1px solid grey";
        })
    }

    for(let key in res.colors){
        let div = document.createElement("div");
        let img = document.createElement("img");
        img.src = res.colors[key];

        img.addEventListener("mouseenter",()=>{
            main_img.src = img.src;
        })

        div.append(img);
        colors.append(div);
    }

    specs.innerHTML = "";

    let memory = document.createElement("h2");
    memory.innerText = "Storage and Ram"

    let memory_details = document.createElement("h3");
    memory_details.innerText = res.memory.join(" | ");

    let hr1 = document.createElement("hr");

    specs.append(memory,memory_details,hr1);

    let dimensions = document.createElement("h2");
    dimensions.innerText = "Dimensions"

    let dimension_details = document.createElement("h3");
    dimension_details.innerText = res.body.join(" | ");

    let hr2 = document.createElement("hr");

    specs.append(dimensions,dimension_details,hr2)

    let rearcamera = document.createElement("h2");
    rearcamera.innerText = "Rear Camera";

    let rearcameras = document.createElement("h3");
    rearcameras.innerText = res.maincamera.cameras.join("\n");

    let rearphoto = document.createElement("h3");
    rearphoto.innerText = res.maincamera.photo.join("\n")

    let rearvideo = document.createElement("h3");
    rearvideo.innerText = res.maincamera.video.join("\n")

    let hr3 = document.createElement("hr");

    specs.append(rearcamera,rearcameras,rearphoto,rearvideo,hr3);

    let frontcamera = document.createElement("h2");
    frontcamera.innerText = "Front Camera";

    let frontcameras = document.createElement("h3");
    frontcameras.innerText = res.selfiecamera.cameras.join("\n");

    let frontphoto = document.createElement("h3");
    frontphoto.innerText = res.selfiecamera.photo.join("\n")

    let frontvideo = document.createElement("h3");
    frontvideo.innerText = res.selfiecamera.video.join("\n")

    let hr4 = document.createElement("hr");

    specs.append(frontcamera,frontcameras,frontphoto,frontvideo,hr4);

    let display = document.createElement("h2");
    display.innerText = "Display";

    let display_details = document.createElement("h3");
    display_details.innerText = res.display.join("\n");

    let hr5 = document.createElement("hr");

    specs.append(display,display_details,hr5)

    let processor = document.createElement("h2");
    processor.innerText = "Processor";

    let processor_details = document.createElement("h3");
    processor_details.innerText = res.platform.join("\n");

    let hr6 = document.createElement("hr");

    specs.append(processor,processor_details,hr6);

    let battery = document.createElement("h2");
    battery.innerText = "Battery & Charging";

    let battery_details = document.createElement("h3");
    battery_details.innerText = res.battery.join("\n");

    let hr7 = document.createElement("hr");

    specs.append(battery,battery_details,hr7);

    let communication = document.createElement("h2");
    communication.innerText = "Network & Communication";

    let bands = document.createElement("h3");
    bands.innerText = res.communication.network_bands.join("\n");

    let bluetooth = document.createElement("h3");
    bluetooth.innerText = res.communication.bluetooth;

    let wifi = document.createElement("h3");
    wifi.innerText = res.communication.wifi;

    let hr8 = document.createElement("hr");

    specs.append(communication,bands,bluetooth,wifi,hr8);

    let sensors = document.createElement("h2");
    sensors.innerText = "Sensors";
    let sensor_details = document.createElement("h3");
    sensor_details.innerText = res.sensors.join(" | ");

    let hr9 = document.createElement("hr");

    specs.append(sensors,sensor_details,hr9);

    let other = document.createElement("h2");
    other.innerText = "Other details";

    let other_details = document.createElement("h3");
    other_details.innerText = `${res.features.join(" | ")} \n ${res.misc.join(" | ")}`;

    let hr10 = document.createElement("hr");

    specs.append(other,other_details,hr10);

    let package = document.createElement("h2");
    package.innerText = "Package Contents";
    package_details = document.createElement("h3");

    package_details.innerText = res.package.join(" | ");

    let hr11 = document.createElement("hr");

    specs.append(package,package_details,hr11);
}
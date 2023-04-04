document.querySelector(".login_form").addEventListener("submit",(event)=>{
    event.preventDefault();
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;

    let payload = {
        email,
        password
    }
    console.log(payload);
    let url = "https://weak-tick-sweatpants.cyclic.app/login";

    login(url);

    async function login(url){
        let res = await fetch(url,{
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body: JSON.stringify(payload)
        })

        res = await res.json();

        const cur_user = {
            name: res.name,
            token: res.token
        }

        localStorage.setItem("cur_user",JSON.stringify(cur_user));

        // alert(res.msg);

        // if(res.logged_in){
        //     window.location.href = "./index.html";
        // }

        let alertbox = document.querySelector(".alertbox");
        let text = document.querySelector(".alertbox>h3");

        text.innerText = res.msg;

        alertbox.style.display = "flex";

        setTimeout(()=>{
            alertbox.style.display = "none";
        },1000)
    }
})
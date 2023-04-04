document.querySelector(".registration_form").addEventListener("submit",(event)=>{
    event.preventDefault();
    let name = document.querySelector("#name").value;
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    let url = "https://weak-tick-sweatpants.cyclic.app/register"

    let payload = {
        name: name,
        email,
        password
    }

    console.log(payload)

    register(url);

    async function register(url){
        let res = await fetch(url,{
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body: JSON.stringify(payload)
        })

        res = await res.json()

        alert(res.msg);

        if(res.registered){
            let url = "https://weak-tick-sweatpants.cyclic.app/login";

            const loginpayload = {
                email,
                password
            }

            await login(url);
        
            async function login(url){
                let res = await fetch(url,{
                    method:"POST",
                    headers:{
                        "content-type":"application/json"
                    },
                    body: JSON.stringify(loginpayload)
                })
        
                res = await res.json();

                console.log(res);

                const cur_user = {
                    name: name,
                    token: res.token
                }
        
                localStorage.setItem("cur_user",JSON.stringify(cur_user));
        
            }
            window.location.href = "./index.html"
        }
    }
})
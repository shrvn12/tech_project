document.querySelector("#user").addEventListener("mouseenter",()=>{
    document.querySelector(".account").style.display = "block";
})

document.querySelector("#user").addEventListener("mouseleave",()=>{
    document.querySelector(".account").style.display = "none";
})

document.querySelector(".account").addEventListener("mouseenter",()=>{
    document.querySelector(".account").style.display = "block";
})

document.querySelector(".account").addEventListener("mouseleave",()=>{
    document.querySelector(".account").style.display = "none";
})

let cur_user = localStorage.getItem("cur_user");

if(cur_user){
    cur_user = JSON.parse(cur_user);
    if(cur_user.name){
        document.querySelector(".username").innerText = cur_user.name;
        let logout = document.querySelector(".user_login");

        logout.innerText = "Logout";

        logout.addEventListener("click",()=>{
            localStorage.removeItem("cur_user");
            // window.location.href = "./index.html";
            window.location.reload();
        })
    }
}
else{
    document.querySelector(".username").innerText = "Login here";
    let login = document.querySelector(".user_login");

    login.innerText = "Login";

    login.addEventListener("click",()=>{
        // localStorage.removeItem("cur_user");
        // window.location.href = "./index.html";
        window.location.href = "./login.html";
    })
}


let logo = document.querySelector(".nav>div:nth-child(1)>img");

logo.addEventListener("click",()=>{
    window.location.href = "./index.html";
})
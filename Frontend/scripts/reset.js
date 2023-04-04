document.querySelector(".reset_form").addEventListener("submit",async(event)=>{
    event.preventDefault();
    let pswd = document.querySelector("#pswd").value;
    let conf_pswd = document.querySelector("#conf_pswd").value;

    if(pswd !== conf_pswd){
        return alert("Passwords do not match");
    }

    const payload = {
        email: localStorage.getItem("verification_email"),
        new_password : pswd
    }

    // console.log(payload);

    let res = await fetch("https://weak-tick-sweatpants.cyclic.app/resetpswd",{
        method:"PATCH",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify(payload)
    })

    res = await(res.json());

    alert(res.msg);

    if(res.msg == "successfully updated the password"){
        window.location.href = "./login.html"
    }
})
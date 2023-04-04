document.querySelector(".email_form").addEventListener("submit",async (event)=>{
    event.preventDefault();
    const email = document.querySelector("#email").value;
    localStorage.setItem("verification_email",email);
    const payload = {
        email
    }

    let prevtext = document.querySelector(".email_form>button").innerText;
    document.querySelector(".email_form>button").innerText = "Working..."
    let res = await fetch("https://weak-tick-sweatpants.cyclic.app/getcode",{
        method:"POST",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify(payload)
    })

    res = await(res.json());

    document.querySelector(".email_form>button").innerText = prevtext

    alert(res.msg);
})

document.querySelector(".otp_form").addEventListener("submit",async (event)=>{
    event.preventDefault();
    const email = localStorage.getItem("verification_email");
    const code = document.querySelector("#otp").value;

    const payload = {
        email,
        code
    }

    let prevtext = document.querySelector(".otp_form>button").innerText;
    document.querySelector(".otp_form>button").innerText = "Working..."

    let res = await fetch("https://weak-tick-sweatpants.cyclic.app/verifycode",{
        method:"POST",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify(payload)
    })

    res = await(res.json());

    document.querySelector(".otp_form>button").innerText = prevtext

    alert(res.msg);

    if(res.msg == "verification successful"){
        window.location.href = "./reset_pswd.html"
    }

})
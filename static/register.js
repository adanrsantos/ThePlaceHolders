const email = document.getElementById("email");
const emailHelp = document.getElementById("emailHelp");
const emailRegex = /^[^\s@]+@my\.utsa\.edu$/;
const password = document.getElementById("password");
const passwordHelp = document.getElementById("passwordHelp");
const passwordRegex = /^.{8,}$/;

function showPass(){
    if(password.type === "password"){
        password.type = "text";
    }
    else{
        password.type = "password";
    }
}

function passCheck(){
    if(passwordRegex.test(password.value)){
        passwordHelp.style.color = "#66cc66";
    }
    else{
        passwordHelp.style.color = "#ff6666";
    }
}

function emailCheck(){
    if(emailRegex.test(email.value)){
        emailHelp.style.color = "#66cc66";
    }
    else{
        emailHelp.style.color = "#ff6666";
    }
}